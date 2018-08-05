from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app import db

class Race(db.Model):
    __tablename__ = 'races'
    raceId = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(50), unique=True)
    season = db.Column(db.Integer, unique=True)
    raceName = db.Column(db.String(50), unique=True)
    time = db.Column(db.DateTime(timezone=True), server_default=func.now())
    date = db.Column(db.DateTime(timezone=True), server_default=func.now())
    roundId = db.Column(db.Integer, primary_key=True)

    def __init__(self):
        self.raceId = raceId
        self.url = url
        self.season = season
        self.raceName = raceName
        self.time = time
        self.date = date
        self.round = roundId
