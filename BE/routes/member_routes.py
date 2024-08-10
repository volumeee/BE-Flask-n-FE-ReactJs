from flask import Blueprint, jsonify, request
from utils.auth import login_required
from services.member_service import (
    get_all_members, 
    get_member_by_id, 
    create_member, 
    update_member, 
    delete_member
)
import os
import json
from werkzeug.utils import secure_filename
import uuid
from flask import send_from_directory

UPLOAD_FOLDER = './data'  
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

member_bp = Blueprint('members', __name__)

# Route untuk melayani file dari folder 'data'
@member_bp.route('/data/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

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
    skills_data = request.form.get('skills')
    if skills_data:
        data['skills'] = eval(skills_data)
    file = request.files.get('file')

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_suffix = f"{uuid.uuid4()}{os.path.splitext(filename)[1]}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_suffix)
        
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
    data = request.form.to_dict()
    
    # Mengatasi jika data skills datang dalam JSON, bukan form-data
    skills_data = request.form.get('skills')
    if not skills_data and request.is_json:
        skills_data = request.json.get('skills')

    if skills_data:
        try:
            data['skills'] = json.loads(skills_data) if isinstance(skills_data, str) else skills_data
        except json.JSONDecodeError as e:
            return jsonify({"error": f"Invalid JSON data: {str(e)}"}), 400

    file = request.files.get('file')
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_suffix = f"{uuid.uuid4()}{os.path.splitext(filename)[1]}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_suffix)

        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        file.save(file_path)
        data['file_url'] = f'/data/{unique_suffix}'

    # Logging data untuk debug
    print(f"Updating member {member_id} with data: {data}")

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
