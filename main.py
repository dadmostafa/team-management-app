from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pymongo import MongoClient
from pydantic import BaseModel
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb+srv://mostafa_CITI:X0n8BpLFE1xF821a@team-management-cluster.zegijnq.mongodb.net/?appName=team-management-cluster")
db = client["team_management"]
teams_collection = db["teams"]

SECRET_KEY = "acme-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

USERS = {
    "admin": {
        "username": "admin",
        "password": "admin123",
        "role": "admin"
    },
    "viewer": {
        "username": "viewer", 
        "password": "viewer123",
        "role": "viewer"
    }
}

if teams_collection.count_documents({}) == 0:
    teams_collection.insert_many([
        {"id": 1, "name": "Engineering", "location": "New York", "members": 8, "lead": "Sarah Johnson"},
        {"id": 2, "name": "Marketing", "location": "London", "members": 5, "lead": "James Smith"},
        {"id": 3, "name": "Data Science", "location": "Remote", "members": 6, "lead": "Priya Patel"},
    ])

class Team(BaseModel):
    name: str
    location: str
    members: int
    lead: str

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        role = payload.get("role")
        return {"username": username, "role": role}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = USERS.get(form_data.username)
    if not user or user["password"] != form_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": user["username"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "role": user["role"]}
@app.get("/teams")
def get_teams(current_user: dict = Depends(get_current_user)):
    teams = list(teams_collection.find({}, {"_id": 0}))
    return {"teams": teams}

@app.post("/teams")
def create_team(team: Team, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create teams")
    teams_collection.insert_one(team.dict())
    return {"message": "Team created successfully"}

@app.delete("/teams/{team_name}")
def delete_team(team_name: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete teams")
    teams_collection.delete_one({"name": team_name})
    return {"message": "Team deleted successfully"}

@app.put("/teams/{team_name}")
def update_team(team_name: str, team: Team, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update teams")
    teams_collection.update_one({"name": team_name}, {"$set": team.dict()})
    return {"message": "Team updated successfully"}