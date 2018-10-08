from flask import render_template, Blueprint
from app.extensions import db
from app.models import *

view_blueprint = Blueprint('view', __name__)


@view_blueprint.route("/")
def index():
    return render_template("index.html")

@view_blueprint.route('/races', methods=['GET'])
def race():
    races_from_db = db.session.query(Race.id).all()
    return render_template('races.html', races_from_db=races_from_db)

@view_blueprint.route('/results', methods=['GET'])
def results():
    results_from_db = db.session.query(Results.id).all()
    return render_template('results.html', results_from_db=results_from_db)

@view_blueprint.route('/qualifying', methods=['GET'])
def qualifying():
    results_from_db = db.session.query(Qualifying.id).all()
    return render_template('qualifying.html', results_from_db=results_from_db)
