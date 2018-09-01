from flask import render_template, Blueprint
from app.extensions import db
from app.models import Race

view_blueprint = Blueprint('view', __name__)


@view_blueprint.route("/")
def index():
    return render_template("index.html")


@view_blueprint.route('/races', methods=['GET'])
def race():
    races_from_db = db.session.query(Race.race_name).all()
    return render_template('races.html', races_from_db=races_from_db)