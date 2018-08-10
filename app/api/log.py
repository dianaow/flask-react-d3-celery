from app import app
from app.models import Race, db
from app.utils  import * 

def historical_records():
    df_races, df_circuits, constructors, df_drivers, df_results = extract_to_df_race('results', seasons, races_round)
    # Check if row exists in table
    #exists = db.session.query(db.exists().scalar())
    #if exists is None:
        #df_races, df_circuits, constructors, df_drivers, df_results = extract_to_df_race('results', seasons, races_round)
        #save_races_to_db(df_races, db)
    #else:
        #print("The database already contains data of 2016 to current race")

def save_races_to_db(df_races, db):
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
            
        
