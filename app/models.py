from flask import Flask
from app import db

class Race(db.Model):
    __tablename__ = 'races'
    raceId = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(50), unique=True)
    season = db.Column(db.Integer)
    raceName = db.Column(db.String(50))

    def __init__(self, **kwargs):
        super(Race, self).__init__(**kwargs)
