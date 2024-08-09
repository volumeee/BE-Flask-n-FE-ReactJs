from utils.db import db, jsonify_id
from models.member import Member  # Impor model Member


def create_member(data):
    member = Member(**data)
    result = db.members.insert_one(member.dict(by_alias=True, exclude={"id"}))  # Masukkan data tanpa 'id'
    db.members.update_one({"_id": result.inserted_id}, {"$set": {"id": str(result.inserted_id)}})  # Tambahkan id sebagai field terpisah
    return str(result.inserted_id)

def get_all_members():
    members = db.members.find()
    return [jsonify_id(member) for member in members]

def get_member_by_id(member_id):
    member = db.members.find_one({"id": member_id})
    if member:
        return jsonify_id(member)
    return None

def update_member(member_id, data):
    result = db.members.update_one(
        {"id": member_id},
        {"$set": data}
    )
    if result.matched_count > 0:
        return get_member_by_id(member_id)
    return None

def delete_member(member_id):
    result = db.members.delete_one({"id": member_id})
    return result.deleted_count > 0
