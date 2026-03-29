from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel

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

@app.get("/teams")
def get_teams():
    teams = list(teams_collection.find({}, {"_id": 0}))
    return {"teams": teams}

@app.post("/teams")
def create_team(team: Team):
    new_team = team.dict()
    teams_collection.insert_one(new_team)
    return {"message": "Team created successfully"}

@app.delete("/teams/{team_name}")
def delete_team(team_name: str):
    teams_collection.delete_one({"name": team_name})
    return {"message": "Team deleted successfully"}