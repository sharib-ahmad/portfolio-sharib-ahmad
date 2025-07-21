from flask import Blueprint, redirect, render_template, url_for, flash, request, current_app
from flask_login import login_required
from models.forms import ProjectForm
from werkzeug.utils import secure_filename
from models.model import Projects, Technologies, Links
from models import db
import os

admin_bp = Blueprint('admin', __name__, template_folder='../templates')

@admin_bp.route('/admin', methods=['GET', 'POST'])
@login_required
def admin():
    form = ProjectForm()
    image_url = None  # ✅ Initialize image_url before usage

    if form.validate_on_submit():
        try:
            # ✅ Ensure project_images folder exists
            # image_folder = os.path.join(current_app.root_path, 'static', 'project_images')
            # os.makedirs(image_folder, exist_ok=True)

            # # ✅ Handle image saving
            # if form.image.data:
            #     filename = f'{secure_filename(form.title.data)}.png'
            #     image_path = os.path.join(image_folder, filename)
            #     image_url = f'/static/project_images/{filename}'
            #     form.image.data.save(image_path)
            print(form.image.data is not None)
            if form.image.data:
                filename = f'{secure_filename(form.title.data)}.png'
                image_path = os.path.join(current_app.root_path, 'static', 'project_images', filename)
                os.makedirs(os.path.dirname(image_path), exist_ok=True)
                form.image.data.save(image_path)
                image_url = f'/static/project_images/{filename}'
                
            # ✅ Create the project
            project = Projects(
                title=form.title.data,
                description=form.description.data,
                image=image_url,  # This could be None
                rating=int(form.rating.data)
            )
            db.session.add(project)
            db.session.flush()  # Assign ID before adding related entries

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
