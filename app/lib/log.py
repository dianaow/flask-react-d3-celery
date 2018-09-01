from app.models import Race, db
from app.utils import *


def historical_records():
    seasons = [2015]
    races_round = range(1, 10)

    df_races, df_circuits, constructors, df_drivers, df_results = extract_to_df_race('results', seasons, races_round)
    df_races = df_races.reset_index(drop=True)
    save_races_to_db(df_races)

def save_races_to_db(df_races):
    for idx,row in df_races.iterrows():
        r = Race()
        r.url = df_races.loc[idx,"url"]
        r.season = df_races.loc[idx,"season"]
        r.race_name = df_races.loc[idx,"raceName"]
        print(df_races.loc[idx,"raceName"])

        db.session.add(r)
        try:
            db.session.commit()
        except:
            db.session.rollback()
            print("Unable to add item to database.")