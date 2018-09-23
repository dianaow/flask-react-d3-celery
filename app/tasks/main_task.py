import os
import json
from app.utils import *
from app.tasks import celery, db_session
from app.tasks.models import Schedule, Race, commit_db
from sqlalchemy import desc
from app.lib.log import *

with open(os.path.join("./app", 'params.json'), "r") as f:
  params = json.load(f)

@celery.task(name="get_manifest")
def run_get_manifest():
    task_id = run_get_manifest.request.id

    s = Schedule(task_id)
    db_session.add(s)
    commit_db()

    row_id = db_session.query(Schedule).order_by(desc(Schedule.id)).first().id
    row_id = str(row_id)
    seasons = [params['schedule'][row_id]['season']]
    races = [params['schedule'][row_id]['roundID']]

    # print(str(db.session.query(Schedule).all()))
    # print(rowId, params['schedule'][rowId]['season'], params['schedule'][rowId]['roundID'])

    df_races, df_circuits, constructors, df_drivers, df_results = extract_to_df_race('results', seasons, races)
    save_races_to_db(df_races, db_session)
    save_results_to_db(df_results, db_session)


