from pymongo import MongoClient

client = MongoClient("mongodb+srv://mostafa_CITI:X0n8BpLFE1xF821a@team-management-cluster.zegijnq.mongodb.net/?appName=team-management-cluster")
db = client["team_management"]
teams = db["teams"]

teams.update_one({"name": "Engineering"}, {"$set": {"achievements": [
    {"title": "Launched v2.0", "description": "Successfully launched the new platform version", "month": "January", "year": 2026},
    {"title": "Zero Downtime", "description": "Achieved 99.9% uptime for the entire month", "month": "February", "year": 2026},
]}})

teams.update_one({"name": "Marketing"}, {"$set": {"achievements": [
    {"title": "10K Campaign", "description": "Reached 10,000 new leads through Q1 campaign", "month": "January", "year": 2026},
]}})

teams.update_one({"name": "Data Science"}, {"$set": {"achievements": [
    {"title": "ML Model Deployed", "description": "Deployed first production ML model with 94% accuracy", "month": "March", "year": 2026},
    {"title": "Data Pipeline", "description": "Built automated data pipeline saving 20 hours per week", "month": "February", "year": 2026},
]}})

print("Done!")
