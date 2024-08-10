from utils.db import db, jsonify_id
from models.member import Member
from models.member import Skills

def create_member(data):
    if 'skills' in data:
        data['skills'] = Skills(**data['skills']).dict()  # Convert to dict
    else:
        data['skills'] = Skills().dict()  # Set all skills to 0 if not provided
    member = Member(**data)
    result = db.members.insert_one(member.dict(by_alias=True, exclude={"id"}))
    db.members.update_one({"_id": result.inserted_id}, {"$set": {"id": str(result.inserted_id)}})
    return str(result.inserted_id)


def update_member(member_id, data):
    print("Updating member with data:", data)  # Logging data yang diterima sebelum update
    
    if 'skills' in data:
        data['skills'] = Skills(**data['skills']).dict()  # Convert to dict
    else:
        data['skills'] = Skills().dict()  # Set all skills to 0 if not provided
    
    result = db.members.update_one(
        {"id": member_id},
        {"$set": data}
    )
    
    if result.matched_count > 0:
        return get_member_by_id(member_id)
    return None

def get_all_members():
    members = db.members.find()
    return [jsonify_id(member) for member in members]

def get_member_by_id(member_id):
    member = db.members.find_one({"id": member_id})
    if member:
        return jsonify_id(member)
    return None

def get_all_members():
    members = db.members.find()
    return [jsonify_id(member) for member in members]

def get_member_by_id(member_id):
    member = db.members.find_one({"id": member_id})
    if member:
        return jsonify_id(member)
    return None

def delete_member(member_id):
    result = db.members.delete_one({"id": member_id})
    return result.deleted_count > 0
