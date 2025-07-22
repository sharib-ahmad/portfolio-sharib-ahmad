from flask import render_template, request, redirect, url_for, flash, Blueprint,send_file,abort
from models.model import Projects, Technologies, Links, ContactMessage
from models.forms import ContactForm
from models import db
import io

portfolio_bp = Blueprint('portfolio', __name__, template_folder='../templates')

@portfolio_bp.route('/', methods=['GET', 'POST'])
def portfolio():
    form = ContactForm()
    if form.validate_on_submit():
        message = ContactMessage(
            name=form.name.data,
            email=form.email.data,
            subject=form.subject.data,
            message=form.message.data
        )
        db.session.add(message)
        db.session.commit()
        flash('Thank you! Your message has been sent successfully.', 'success')
        return redirect(url_for('portfolio.portfolio'))
    projects = Projects.query.all()

    # Use a set to store unique skill names
    skill_set = set()
    for project in projects:
        for tech in project.technologies.all():  # `.all()` is required for `lazy='dynamic'`
            skill_set.add(tech.name.strip().capitalize())

    return render_template('portfolio.html', projects=projects, skills=skill_set, form=form)


@portfolio_bp.route('/project_image/<int:project_id>')
def project_image(project_id):
    project = Projects.query.get_or_404(project_id)
    if project.image:
        return send_file(io.BytesIO(project.image), mimetype=project.image_mimetype)
    else:
        abort(404)