from controllers.admin_route import admin_bp
from controllers.portfolio_route import portfolio_bp
from controllers.auth_route import auth_bp

def register_blueprints(app):
    app.register_blueprint(admin_bp)
    app.register_blueprint(portfolio_bp)
    app.register_blueprint(auth_bp)