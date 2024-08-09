from .member_routes import member_bp

def initialize_routes(app):
    app.register_blueprint(member_bp)
