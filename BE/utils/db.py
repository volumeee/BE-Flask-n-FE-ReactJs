from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client.organization

def jsonify_id(doc):
    doc['id'] = str(doc.get('id', doc['_id']))  
    del doc['_id'] 
    return doc


def init_db():
    members = [
        {"name": "John Doe", "position": "CEO", "reports_to": None},
        {"name": "Jane Smith", "position": "CTO", "reports_to": "John Doe"},
        {"name": "Alice Johnson", "position": "CFO", "reports_to": "John Doe"}
    ]
    if db.members.count_documents({}) == 0:
        db.members.insert_many(members)

