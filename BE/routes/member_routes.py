from flask import Blueprint, jsonify, request
from utils.auth import login_required
from services.member_service import get_all_members, get_member_by_id, create_member, update_member, delete_member
import os
from werkzeug.utils import secure_filename
import uuid

UPLOAD_FOLDER = './data'  
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

member_bp = Blueprint('members', __name__)

@member_bp.route('/api/members', methods=['GET'])
@login_required
def get_members():
    return jsonify(get_all_members())

@member_bp.route('/api/members/<member_id>', methods=['GET'])
@login_required
def get_member(member_id):
    member = get_member_by_id(member_id)
    if member:
        return jsonify(member)
    return jsonify({"error": "Member not found"}), 404

@member_bp.route('/api/members', methods=['POST'])
@login_required
def add_member():
    data = request.form.to_dict()  
    file = request.files.get('file')

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_suffix = f"{uuid.uuid4()}{os.path.splitext(filename)[1]}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_suffix)
        
        # Buat folder jika belum ada
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        
        file.save(file_path)
        data['file_url'] = f'/data/{unique_suffix}'
        new_member = create_member(data)
        return jsonify(new_member), 201
    
    return jsonify({"error": "Invalid file or file not found"}), 400

@member_bp.route('/api/members/<member_id>', methods=['PUT'])
@login_required
def update_member_route(member_id):
    data = request.json
    updated_member = update_member(member_id, data)
    if updated_member:
        return jsonify(updated_member)
    return jsonify({"error": "Member not found"}), 404

@member_bp.route('/api/members/<member_id>', methods=['DELETE'])
@login_required
def delete_member_route(member_id):
    success = delete_member(member_id)
    if success:
        return jsonify({"message": "Member deleted successfully"}), 200
    return jsonify({"error": "Member not found"}), 404

def initialize_routes(app):
    app.register_blueprint(member_bp)
