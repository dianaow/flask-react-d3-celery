from .celery_app import db_session
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, func, or_, and_, case, desc
from sqlalchemy.exc import DatabaseError
from sqlalchemy.ext.declarative import declarative_base


class MyBase(object):
    def save(self):
        db_session.add(self)
        self._flush()
        return self

    def update(self, **kwargs):
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        return self.save()

    def delete(self):
        db_session.delete(self)
        self._flush()

    def _flush(self):
        try:
            db_session.flush()
        except DatabaseError:
            db_session.rollback()
            raise


MyModel = declarative_base()
MyModel.query = db_session.query_property()


class Race(MyModel):
    __tablename__ = "races"
    id = Column(Integer, primary_key=True)
    season = Column(Integer)
    raceName = Column(String(50))
    roundId = Column(Integer)

    def __init__(self, season, raceName, roundId):
        self.season = season
        self.raceName = raceName
        self.roundId = roundId

        super(Race, self).__init__()

class Results(MyModel):
    __tablename__ = 'results'
    id = Column(Integer, primary_key=True, autoincrement=True)
    constructorRef = Column(String(120))
    driverRef = Column(String(120))
    season = Column(Integer)
    roundId = Column(Integer)
    grid = Column(Integer)
    laps = Column(Integer)
    position = Column(Integer)
    status = Column(String(120))
    raceName = Column(String(120))

    def __init__(self, constructorRef, driverRef, season, roundId, grid, laps, position, status, raceName):
        self.constructorRef = constructorRef
        self.driverRef = driverRef
        self.season = season
        self.roundId = roundId
        self.grid = grid
        self.laps = laps
        self.position = position
        self.status = status
        self.raceName = raceName

        super(Results, self).__init__()

class Schedule(MyModel):
    __tablename__ = 'schedule'
    id = Column(Integer, primary_key=True)
    task_id = Column(String(50))

    def __init__(self, task_id):
        self.task_id = task_id
        super(Schedule, self).__init__()


def commit_db():
    try:
        db_session.flush()
        db_session.commit()
    except DatabaseError:
        db_session.rollback()
        raise

    return 0