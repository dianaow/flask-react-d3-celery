from celery.task.base import periodic_task
from celery.schedules import crontab
from app import app
from app.utils  import *
from os import environ
import os
from celery import current_task

with open(os.path.join("./app", 'params.json'), "r") as f:
  params = json.load(f)

@periodic_task(run_every=crontab(minute="*"), bind=True)
def periodic_run_get_manifest(self):
    with app.app_context():
        task_id = self.request.id
        s = Schedule()
        s.taskId = task_id
        db.session.add(s)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(str(e))
        rowId = str(db.session.query(Schedule).order_by(Schedule.scheduleId.desc()).first().scheduleId)
        seasons = [params['schedule'][rowId]['season']]
        races = [params['schedule'][rowId]['roundID']]
        
        print(str(db.session.query(Schedule).all()))
        print(rowId, params['schedule'][rowId]['season'], params['schedule'][rowId]['roundID'])
        
        df_races, df_circuits, constructors, df_drivers, df_results = extract_to_df_race('results', seasons, races)
        for idx,row in df_races.iterrows():
            r = Race()
            r.url = df_races.loc[idx,"url"]
            r.season = df_races.loc[idx,"season"]
            r.raceName = df_races.loc[idx,"raceName"]
            db.session.add(r)
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(str(e))
