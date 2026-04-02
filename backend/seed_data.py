from pymongo import MongoClient
import certifi

client = MongoClient(
    "mongodb+srv://mostafa_CITI:X0n8BpLFE1xF821a@team-management-cluster.zegijnq.mongodb.net/?appName=team-management-cluster",
    tlsCAFile=certifi.where()
)
db = client["team_management"]
teams = db["teams"]

# Clear existing teams
teams.delete_many({})
print("Cleared existing teams...")

teams.insert_many([
    {
        "name": "Engineering",
        "location": "New York",
        "lead": "Sarah Johnson",
        "department": "Credit Card Dev",
        "members": 5,
        "team_members": [
            {"name": "Sarah Johnson", "role": "Engineering Manager", "location": "New York", "is_lead": True, "is_direct_staff": True, "is_placeholder": False},
            {"name": "John Smith", "role": "Software Engineer", "location": "New York", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Mike Chen", "role": "DevOps Engineer", "location": "New York", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Lisa Park", "role": "Frontend Developer", "location": "New York", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
            {"name": "James Wilson", "role": "Backend Developer", "location": "New York", "is_lead": False, "is_direct_staff": False, "is_placeholder": False},
        ]
    },
    {
        "name": "Marketing",
        "location": "London",
        "lead": "James Smith",
        "department": "Car Loan Dev",
        "members": 5,
        "team_members": [
            {"name": "James Smith", "role": "Marketing Director", "location": "London", "is_lead": True, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Emma Wilson", "role": "Content Strategist", "location": "London", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Carlos Rivera", "role": "SEO Specialist", "location": "London", "is_lead": False, "is_direct_staff": False, "is_placeholder": False},
            {"name": "Sophie Turner", "role": "Social Media Manager", "location": "London", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Liam Brown", "role": "Brand Designer", "location": "London", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
        ]
    },
    {
        "name": "Data Science",
        "location": "Remote",
        "lead": "Sarah Johnson",
        "department": "Mortgages Dev",
        "members": 5,
        "team_members": [
            {"name": "Sarah Johnson", "role": "Data Science Lead", "location": "Remote", "is_lead": True, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Liu Wei", "role": "ML Engineer", "location": "Remote", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Anna Kowalski", "role": "Data Analyst", "location": "Remote", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Omar Hassan", "role": "Data Engineer", "location": "Remote", "is_lead": False, "is_direct_staff": False, "is_placeholder": False},
            {"name": "Nina Rodriguez", "role": "BI Developer", "location": "Remote", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
        ]
    },
    {
        "name": "Product",
        "location": "San Francisco",
        "lead": "David Kim",
        "department": "Credit Card Dev",
        "members": 5,
        "team_members": [
            {"name": "David Kim", "role": "Product Manager", "location": "San Francisco", "is_lead": True, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Rachel Green", "role": "UX Designer", "location": "San Francisco", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Tom Baker", "role": "Product Analyst", "location": "San Francisco", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Zara Ahmed", "role": "UI Designer", "location": "San Francisco", "is_lead": False, "is_direct_staff": False, "is_placeholder": False},
            {"name": "Chris Lee", "role": "Scrum Master", "location": "San Francisco", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
        ]
    },
    {
        "name": "Finance",
        "location": "Remote",
        "lead": "Jessica White",
        "department": "Mortgages Dev",
        "members": 5,
        "team_members": [
            {"name": "Jessica White", "role": "Finance Director", "location": "Remote", "is_lead": True, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Mark Davis", "role": "Financial Analyst", "location": "Remote", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Amy Zhang", "role": "Accountant", "location": "Remote", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
            {"name": "Paul Martin", "role": "Budget Analyst", "location": "Remote", "is_lead": False, "is_direct_staff": False, "is_placeholder": False},
            {"name": "Sandra Lopez", "role": "Payroll Specialist", "location": "Remote", "is_lead": False, "is_direct_staff": True, "is_placeholder": False},
        ]
    },
])

print("Done! 5 teams inserted:")
print("- Engineering (New York) — Lead: Sarah Johnson — Dept: Credit Card Dev")
print("- Marketing (London) — Lead: James Smith — Dept: Car Loan Dev")
print("- Data Science (Remote) — Lead: Sarah Johnson — Dept: Mortgages Dev")
print("- Product (San Francisco) — Lead: David Kim — Dept: Credit Card Dev")
print("- Finance (Remote) — Lead: Jessica White — Dept: Mortgages Dev")
print("")
print("Sarah Johnson leads both Engineering AND Data Science!")
print("2 remote teams: Data Science and Finance")
