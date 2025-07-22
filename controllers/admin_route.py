from flask import Blueprint, redirect, render_template, url_for, flash, request, current_app
from flask_login import login_required
from models.forms import ProjectForm
from models.model import Projects, Technologies, Links
from models import db
import os

admin_bp = Blueprint('admin', __name__, template_folder='../templates')

@admin_bp.route('/admin', methods=['GET', 'POST'])
@login_required
def admin():
    form = ProjectForm() 

    if form.validate_on_submit():
        try:
            image_data = None
            image_mimetype = None

            if form.image.data:
                image_data = form.image.data.read()
                image_mimetype = form.image.data.mimetype
                
                
            # ✅ Create the project
            project = Projects(
                title=form.title.data,
                description=form.description.data,
                image=image_data,
                image_mimetype=image_mimetype, 
                rating=int(form.rating.data)
            )
            db.session.add(project)
            db.session.flush() 

            # ✅ Add technologies
            if form.tech.data:
                tech_names = [tech.strip() for tech in form.tech.data.split(',') if tech.strip()]
                for tech_name in tech_names:
                    db.session.add(Technologies(name=tech_name, project_id=project.id))

            # ✅ Add links
            link_index = 0
            while f'links-{link_index}-name' in request.form:
                name = request.form.get(f'links-{link_index}-name', '').strip()
                url = request.form.get(f'links-{link_index}-url', '').strip()
                if name and url:
                    db.session.add(Links(name=name, url=url, project_id=project.id))
                link_index += 1

            db.session.commit()
            flash('Project added successfully!', 'success')
            return redirect(url_for('admin.admin'))

        except Exception as e:
            db.session.rollback()
            flash(f'Error adding project: {str(e)}', 'danger')

    return render_template('admin.html', form=form)
