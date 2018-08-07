from app import f1
from models import db

@f1.route('/data/races/all', methods=['GET'])
def race():
    races_from_db = db.session.query(Race.raceName).all()
    return render_template('races.html', races_from_db=races_from_db)
