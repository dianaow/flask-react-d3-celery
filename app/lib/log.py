from app.models import *
from app.utils import *


def get_results_archive():
    seasons = [2016, 2017]
    races_round = range(1, 21)

    df_races, df_circuits, constructors, df_drivers, df_results = extract_to_df_race('results', seasons, races_round)

    save_results_to_db(df_results, db.session)


def get_qual_archive():

    seasons = [2016, 2017]
    races_round = range(1, 21)

    df_qualifying = extract_to_df_race('qualifying', seasons, races_round)
    print(df_qualifying)
    save_qual_to_db(df_qualifying, db.session)


def get_laptimes_archive():

    seasons = [2015]
    races_round = range(1, 2)

    df_lapTimes = extract_to_df_race('laps', seasons, races_round)
    save_laptimes_to_db(df_lapTimes, db.session)


def get_pitstops_archive():

    seasons = [2016, 2017]
    races_round = range(1, 21)

    df_pitStops = extract_to_df_race('pitstops', seasons, races_round)
    save_pitstops_to_db(df_pitStops, db.session)


def save_results_to_db(df_results, db_session):
    for idx,row in df_results.iterrows():
        r = Results()
        r.constructorRef = df_results.loc[idx,"constructorRef"]
        r.driverRef = df_results.loc[idx,"driverRef"]
        r.season= df_results.loc[idx,"season"]
        r.raceName= df_results.loc[idx,"raceName"]
        r.roundId= df_results.loc[idx,"round"]
        r.grid= df_results.loc[idx,"grid"]
        r.laps= df_results.loc[idx,"laps"]
        r.position= df_results.loc[idx,"position"]
        r.points= df_results.loc[idx,"points"]
        r.status= df_results.loc[idx,"status"]

        db_session.add(r)
        try:
            db_session.commit()
        except:
            db_session.rollback()
            print("Unable to add item to database.")


def save_qual_to_db(df_qualifying, db_session):
    for idx,row in df_qualifying.iterrows():
        r = Qualifying()
        r.constructorRef = df_qualifying.loc[idx,"constructorRef"]
        r.driverRef = df_qualifying.loc[idx,"driverRef"]
        r.season= df_qualifying.loc[idx,"season"]
        r.raceName= df_qualifying.loc[idx,"raceName"]
        r.roundId= df_qualifying.loc[idx,"round"]
        r.Q1= df_qualifying.loc[idx,"Q1"]
        r.Q2= df_qualifying.loc[idx,"Q2"]
        r.Q3= df_qualifying.loc[idx,"Q3"]
        r.position= df_qualifying.loc[idx,"position"]
        
        db_session.add(r)
        db_session.commit()


def save_races_to_db(df_races, db_session):
    for idx,row in df_races.iterrows():
        r = Race()
        r.season = df_races.loc[idx,"season"]
        r.raceName = df_races.loc[idx,"raceName"]
        r.roundId = df_races.loc[idx,"round"]

        db_session.add(r)
        db_session.commit()


def save_laptimes_to_db(df_lapTimes, db_session):
    for idx,row in df_lapTimes.iterrows():
        r = LapTimes()
        r.driverRef = df_lapTimes.loc[idx,"driverRef"]
        r.season= df_lapTimes.loc[idx,"season"]
        r.raceName= df_lapTimes.loc[idx,"raceName"]
        r.roundId= df_lapTimes.loc[idx,"round"]
        r.lap= df_lapTimes.loc[idx,"lap"]
        r.time= df_lapTimes.loc[idx,"time"]
        r.position= df_lapTimes.loc[idx,"position"]
        
        db_session.add(r)
        db_session.commit()


def save_pitstops_to_db(df_pitStops, db_session):
    for idx,row in df_pitStops.iterrows():
        r = PitStops()
        r.driverRef = df_pitStops.loc[idx,"driverRef"]
        r.season= df_pitStops.loc[idx,"season"]
        r.raceName= df_pitStops.loc[idx,"raceName"]
        r.roundId= df_pitStops.loc[idx,"round"]
        r.lap= df_pitStops.loc[idx,"lap"]
        r.duration= df_pitStops.loc[idx,"duration"]
        r.stop= df_pitStops.loc[idx,"stop"]
        
        db_session.add(r)
        db_session.commit()