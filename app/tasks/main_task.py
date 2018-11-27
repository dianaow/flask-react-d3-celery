import os
import json
from app.utils import *
from app.tasks import celery, db_session
from app.tasks.models import Race, Results, Qualifying, LapTimes, PitStops, commit_db
from sqlalchemy import desc
from app.lib.log import *
from .celery_app import celery
from celery.result import AsyncResult

with open(os.path.join("./app", 'params.json'), "r") as f:
  params = json.load(f)

@celery.task(name="get_scheduled_results")
def run_scheduled_results():

    task_id = run_scheduled_results.request.id
    s = Schedule()
    s.task_id = task_id
    db_session.add(s)
    commit_db()

    row_id = db_session.query(Schedule).order_by(desc(Schedule.id)).first().id
    row_id = str(row_id)
    seasons = [params['schedule'][row_id]['season']]
    races = [params['schedule'][row_id]['roundID']]

    df_results, df_races = extract_to_df_race('results', seasons, races)
    df_qualifying = extract_to_df_race('qualifying', seasons, races)
    df_lapTimes = extract_to_df_race('laps', seasons, races)
    df_pitStops = extract_to_df_race('pitstops', seasons, races)
    df_lapTimes.head()
    if (len(df_results) != 0):

        try:
            save_races_to_db(df_races, db_session)
        except:
            pass

        try:
            save_results_to_db(df_results, db_session)
        except:
            pass   

        try:
            save_qual_to_db(df_qualifying, db_session)
        except:
            pass           
 
        try:
            save_laptimes_to_db(df_lapTimes, db_session)
        except:
            pass  

        try:
            save_pitstops_to_db(df_pitStops, db_session)
        except:
            pass  

    else:
        db_session.rollback()


