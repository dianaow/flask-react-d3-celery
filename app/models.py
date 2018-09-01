from app.extensions import db
from sqlalchemy.inspection import inspect


class MethodsMixin(object):
    """
    This class mixes in some common Class table functions like
    delete and save
    """
    def save(self):
        db.session.add(self)
        db.session.commit()
        return self.id

    def update(self):
        db.session.commit()
        return self.id

    def delete(self):
        ret = self.id
        db.session.delete(self)
        db.session.commit()
        return ret

    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    def serialize_list(self, lis):
        return [m.serialize() for m in lis]

        
class Race(db.Model, MethodsMixin):
    __tablename__ = 'races'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    url = db.Column(db.String(500))
    season = db.Column(db.Integer)
    race_name = db.Column(db.String(120))

    def __init__(self, **kwargs):
        keys = ['id', 'url', 'season', 'race_name']
        for key in keys:
            setattr(self, key, kwargs.get(key))


class Schedule(db.Model, MethodsMixin):
    __tablename__ = 'schedule'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    task_id = db.Column(db.String(50))
    
    def __init__(self, **kwargs):
        keys = ["task_id"]
        for key in keys:
            setattr(self, key, kwargs.get(key))

