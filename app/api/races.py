from flask import json, jsonify, Blueprint
from app.extensions import db
from app.models import Race

race_blueprint = Blueprint('races', __name__)

@race_blueprint.route('/api/races', methods=['GET'])
def race():
    races = db.session.query(Race).all()
    results = []

    for race in races:
        results.append(race.serialize())

    return jsonify({"data": results})
