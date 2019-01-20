from flask import json, jsonify, Blueprint
from app.extensions import db
from app.models import *
from app.utils.munging import *

race_blueprint = Blueprint('races', __name__)
results_blueprint = Blueprint('results', __name__)
qualifying_blueprint = Blueprint('qualifying', __name__)
laptimes_blueprint = Blueprint('laptimes', __name__)
pitstops_blueprint = Blueprint('pitstops', __name__)
tyre_blueprint = Blueprint('tyre', __name__)

@results_blueprint.route('/api/results', methods=['GET'])
def results():
    results = db.session.query(Results).all()
    arr = []
    for result in results:
        arr.append(result.serialize())

    return jsonify({"data": arr})

@qualifying_blueprint.route('/api/qualifying', methods=['GET'])
def qualifying():
    qual_results = db.session.query(Qualifying).all()
    arr = []
    for q in qual_results:
        arr.append(q.serialize())

    return jsonify({"data": arr})

@laptimes_blueprint.route('/api/laptimes', methods=['GET'])
def laptimes():
    laptimes = db.session.query(LapTimes).all()
    arr = []
    for lap in laptimes:
        arr.append(lap.serialize())

    return jsonify({"data": arr})

@pitstops_blueprint.route('/api/pitstops', methods=['GET'])
def pitstops():
    pitstops = db.session.query(PitStops).all()
    arr = []
    for stop in pitstops:
        arr.append(stop.serialize())

    return jsonify({"data": arr})


@race_blueprint.route('/api/races', methods=['GET'])
def races():
    races = db.session.query(Race).all()
    arr = []

    for race in races:
        arr.append(race.serialize())

    return jsonify({"data": arr})

@tyre_blueprint.route('/api/tyres', methods=['GET'])
def tyre():
    tyres = db.session.query(Tyre).all()
    arr = []

    for tyre in tyres:
        arr.append(tyre.serialize())

    return jsonify({"data": arr})
