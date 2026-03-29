from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
client = MongoClient("mongodb+srv://mostafa_CITI:X0n8BpLFE1xF821a@team-management-cluster.zegijnq.mongodb.net/?appName=team-management-cluster")
db = client["team_management"]
teams_collection = db["teams"]

# Add sample data if database is empty
if teams_collection.count_documents({}) == 0:
    teams_collection.insert_many([
        {"id": 1, "name": "Engineering", "location": "New York", "members": 8, "lead": "Sarah Johnson"},
        {"id": 2, "name": "Marketing", "location": "London", "members": 5, "lead": "James Smith"},
        {"id": 3, "name": "Data Science", "location": "Remote", "members": 6, "lead": "Priya Patel"},
    ])

@app.get("/teams")
def get_teams():
    teams = list(teams_collection.find({}, {"_id": 0}))
    return {"teams": teams}