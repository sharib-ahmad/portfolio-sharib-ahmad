from flask import Blueprint, render_template, url_for, redirect
from flask_login import login_user, logout_user, login_required, current_user
from models.model import User
from models.forms import LoginForm
from models import login_manager

auth_bp = Blueprint('auth', __name__, template_folder='../templates')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('admin.admin'))

    form = LoginForm()
    
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password_hash.data):
            login_user(user)
            return redirect(url_for('admin.admin'))
            
    return render_template('login.html', form=form)

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('portfolio.portfolio'))