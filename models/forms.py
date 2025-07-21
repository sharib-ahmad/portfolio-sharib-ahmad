from wtforms import StringField, PasswordField, SubmitField, SelectField, Form, FieldList, FormField, TextAreaField
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.validators import DataRequired, Email, Length, EqualTo, URL, Optional
from wtforms.fields import EmailField, URLField
from flask_wtf import FlaskForm

class LoginForm(FlaskForm):
    email = EmailField('Email Address', validators=[DataRequired(), Email()])
    password_hash = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class LinkForm(Form):  # Note: Not FlaskForm - this is correct for nested forms
    name = StringField('Link Name', validators=[Optional()])  # Made optional since we validate in the route
    url = URLField('Link URL', validators=[Optional(), URL()])  # Made optional since we validate in the route

class ProjectForm(FlaskForm):
    title = StringField('Project Title', validators=[DataRequired(), Length(min=1, max=100)])
    description = TextAreaField('Description', validators=[DataRequired(), Length(min=10, max=1000)])
    image = FileField("Profile Picture", validators=[
        FileAllowed(['jpg', 'jpeg', 'png', 'gif', 'webp'], 'Images only!')
    ])
    rating = SelectField('Rating', choices=[('1', '⭐'), ('2', '⭐⭐'), ('3', '⭐⭐⭐'), ('4', '⭐⭐⭐⭐'), ('5', '⭐⭐⭐⭐⭐')], validators=[DataRequired()])
    tech = StringField('Technologies', validators=[DataRequired(), Length(min=1, max=200)])
    links = FieldList(FormField(LinkForm), min_entries=1, max_entries=10)
    submit = SubmitField('Add Project')
    
    def __init__(self, *args, **kwargs):
        super(ProjectForm, self).__init__(*args, **kwargs)
        # Ensure at least one entry exists
        while len(self.links.entries) < 1:
            self.links.append_entry()


class ContactForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=100)])
    email = EmailField('Email', validators=[DataRequired(), Email(), Length(max=120)])
    subject = StringField('Subject', validators=[DataRequired(), Length(max=150)])
    message = TextAreaField('Message', validators=[DataRequired(), Length(min=10)])
    submit = SubmitField('Send To sharibahmad6716@gmail.com')