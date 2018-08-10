from flask import render_template
from app import app, db
from models import Race

@app.route('/', methods=['GET'])
def race():
    races_from_db = db.session.query(Race.raceName).all()
    return render_template('races.html', races_from_db=races_from_db)
