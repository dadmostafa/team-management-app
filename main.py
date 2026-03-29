from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# This allows your React app to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your teams data
teams = [
    {"id": 1, "name": "Engineering", "location": "New York", "members": 8, "lead": "Sarah Johnson"},
    {"id": 2, "name": "Marketing", "location": "London", "members": 5, "lead": "James Smith"},
    {"id": 3, "name": "Data Science", "location": "Remote", "members": 6, "lead": "Priya Patel"},
]

# When someone visits /teams, return the list
@app.get("/teams")
def get_teams():
    return {"teams": teams}