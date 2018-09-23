from app.models import Race, Results, db
from app.utils import *


def historical_records():
    seasons = [2015]
    races_round = range(1, 3)

    df_races, df_circuits, constructors, df_drivers, df_results = extract_to_df_race('results', seasons, races_round)

    save_races_to_db(df_races, db.session)
    save_results_to_db(df_results, db.session)

def save_races_to_db(df_races, db_session):
    for idx,row in df_races.iterrows():
        r = Race()
        r.season = df_races.loc[idx,"season"]
        r.raceName = df_races.loc[idx,"raceName"]
        r.roundId = df_races.loc[idx,"round"]

        db_session.add(r)
        db_session.commit()

def save_results_to_db(df_results, db_session):
    for idx,row in df_results.iterrows():
        r = Results()
        r.constructorRef = df_results.loc[idx,"constructorRef"]
        r.driverRef = df_results.loc[idx,"driverRef"]
        r.season= df_results.loc[idx,"season"]
        r.roundId= df_results.loc[idx,"round"]
        r.grid= df_results.loc[idx,"grid"]
        r.laps= df_results.loc[idx,"laps"]
        r.position= df_results.loc[idx,"position"]
        r.status= df_results.loc[idx,"status"]
        r.raceName= df_results.loc[idx,"raceName"]

        db_session.add(r)
        try:
            db_session.commit()
        except:
            db_session.rollback()
            print("Unable to add item to database.")

