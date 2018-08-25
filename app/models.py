from flask import Flask
from app import db
from sqlalchemy.inspection import inspect

class Serializer(object):

    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    @staticmethod
    def serialize_list(l):
        return [m.serialize() for m in l]
        
class Race(db.Model, Serializer):
    __tablename__ = 'races'
    raceId = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(500), unique=True)
    season = db.Column(db.Integer)
    raceName = db.Column(db.String(120))

    def __init__(self, **kwargs):
        super(Race, self).__init__(**kwargs)
        
    def serialize(self):
        d = Serializer.serialize(self)
        return d

class Schedule(db.Model):
    __tablename__ = 'schedule'
    scheduleId = db.Column(db.Integer, primary_key=True, unique=True) 
    taskId = db.Column(db.String(50))
    
    def __init__(self, **kwargs):
        super(Schedule, self).__init__(**kwargs)
