from models import db
import enum
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class UserRole(enum.Enum):
    ADMIN = 'admin'
    USER = 'user'

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(1000), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.USER)

    @property
    def password(self):
        raise AttributeError('password: write-only field')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def is_admin(self):
        return self.role == UserRole.ADMIN
    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)
    def __repr__(self):
        return '<User %r>' % self.username
    

class Projects(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.LargeBinary, nullable=True)
    image_mimetype = db.Column(db.String(50), nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    technologies = db.relationship('Technologies', back_populates='projects', lazy='dynamic', cascade='all, delete-orphan')
    links = db.relationship('Links', back_populates='projects', lazy='dynamic', cascade='all, delete-orphan')

    def __repr__(self):
        return '<Project %r>' % self.title

class Technologies(db.Model):
    __tablename__ = 'technologies'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(80), nullable=False)

    projects = db.relationship('Projects', back_populates='technologies')
    def __repr__(self):
        return '<Technology %r>' % self.name
class Links(db.Model):
    __tablename__ = 'links'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    url = db.Column(db.Text, unique=True, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)

    projects = db.relationship('Projects', back_populates='links')
    def __repr__(self):
        return '<Link %r>' % self.name
    

class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Message from {self.name}>"

def auto_admin(app, email, password):
    with app.app_context():
        admin = User.query.filter_by(role = UserRole.ADMIN).first()
        if admin is None:
            admin = User(username='admin', email=email, role=UserRole.ADMIN)
            admin.password = password
            db.session.add(admin)
            db.session.commit()
            print('Admin user created successfully.')