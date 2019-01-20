from app.models import *
from app.utils.utils import *
from datetime import datetime
import os

def get_races_archive():

    startTime = datetime.now()
    df_races = pd.read_csv(os.getcwd() + '/app/lib/raceDescription.csv')
    if len(df_races):   
        save_races_to_db(df_races, db.session)
    else:
        print("Cannot read CSV file containing race description information")
    print("Time taken to process and save races data: {}".format(datetime.now() - startTime))

def get_tyres_archive():

    startTime = datetime.now()
    df_tyres = pd.read_csv(os.getcwd() + '/app/lib/tyreInformation.csv')
    df_tyres.fillna(0, inplace=True)
    if len(df_tyres):   
        save_tyres_to_db(df_tyres, db.session)
    else:
        print("Cannot read CSV file containing tyre information")
    print("Time taken to process and save tyre data: {}".format(datetime.now() - startTime))


def get_results_archive():

    seasons = [2016, 2017]
    races_round = range(4,6)
    startTime = datetime.now()
    df_results, df_races = extract_to_df_race('results', seasons, races_round)
    #print(df_races.tail())
    #print(df_races.info())
    if len(df_results):
        save_results_to_db(df_results, db.session)
    #if len(df_races):   
        #save_races_to_db(df_races, db.session)
    print("Time taken to process and save results data: {}".format(datetime.now() - startTime))

def get_qual_archive():

    seasons = [2016, 2017]
    races_round = range(4, 6)
    startTime = datetime.now()
    df_qualifying = extract_to_df_race('qualifying', seasons, races_round)
    #print(df_qualifying.tail())
    #print(df_qualifying.info())
    if len(df_qualifying):
        save_qual_to_db(df_qualifying, db.session)
    print("Time taken to process and save qualifying data: {}".format(datetime.now() - startTime))

def get_laptimes_archive():

    seasons = [2016]
    races_round = [6,7]
    startTime = datetime.now()
    df_lapTimes = extract_to_df_race('laps', seasons, races_round)
    print(df_lapTimes.tail())
    print(df_lapTimes.info())
    if len(df_lapTimes):
        save_laptimes_to_db(df_lapTimes, db.session)
    print("Time taken to process and save laptimes data: {}".format(datetime.now() - startTime))

def get_pitstops_archive():

    seasons = [2017]
    races_round = range(4,6)
    startTime = datetime.now()
    df_pitStops = extract_to_df_race('pitstops', seasons, races_round)
    #print(df_pitStops.tail())
    #print(df_pitStops.info())
    if len(df_pitStops):
        save_pitstops_to_db(df_pitStops, db.session)
    print("Time taken process and save pitstops data: {}".format(datetime.now() - startTime))

def save_tyres_to_db(df_tyres, db_session):
    for idx,row in df_tyres.iterrows():
        r = Tyre()
        r.season = df_tyres.loc[idx,"season"]
        r.raceName = df_tyres.loc[idx,"raceName"]
        r.driverRef = df_tyres.loc[idx,"driverRef"]
        r.first_set = df_tyres.loc[idx,"first_set"]
        r.stint_1 = df_tyres.loc[idx,"stint_1"]
        r.second_set = df_tyres.loc[idx,"second_set"]
        r.stint_2 = df_tyres.loc[idx,"stint_2"]
        r.third_set = df_tyres.loc[idx,"third_set"]
        r.stint_3 = df_tyres.loc[idx,"stint_3"]
        r.fourth_set = df_tyres.loc[idx,"fourth_set"]
        r.stint_4 = df_tyres.loc[idx,"stint_4"]
        r.fifth_set = df_tyres.loc[idx,"fifth_set"]
        r.stint_5 = df_tyres.loc[idx,"stint_5"]
        r.sixth_set = df_tyres.loc[idx,"sixth_set"]
        r.stint_6 = df_tyres.loc[idx,"stint_6"]
        r.total = df_tyres.loc[idx,"total"]

        db_session.add(r)
        db_session.commit()
    #try:
        #db_session.commit()
        #print("Successfully saved tyres records to database.")
    #except:
        #db_session.rollback()
        #print("Unable to save tyres records to database.")

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
        print("Successfully saved results records to database.")
    except:
        db_session.rollback()
        print("Unable to save results records to database.")


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
    try:
        db_session.commit()
        print("Successfully saved qualifying records to database.")
    except:
        db_session.rollback()
        print("Unable to save qualifying records to database.")


def save_races_to_db(df_races, db_session):
    print(df_races.head())
    for idx,row in df_races.iterrows():
        r = Race()
        r.season = df_races.loc[idx,"season"]
        r.raceName = df_races.loc[idx,"raceName"]
        r.Supersoft = df_races.loc[idx,"Supersoft"]
        r.Soft = df_races.loc[idx,"Soft"]
        r.Medium = df_races.loc[idx,"Medium"]
        r.Hard = df_races.loc[idx,"Hard"]
        r.Ultrasoft = df_races.loc[idx,"Ultrasoft"]
        r.weather = df_races.loc[idx,"weather"]

        db_session.add(r)
    try:
        db_session.commit()
        print("Successfully saved races records to database.")
    except:
        db_session.rollback()
        print("Unable to save races records to database.")


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
    try:
        db_session.commit()
        print("Successfully saved laptimes records to database.")
    except:
        db_session.rollback()
        print("Unable to save laptimes records to database.")


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
    try:
        db_session.commit()
        print("Successfully saved pitstops records to database.")
    except:
        db_session.rollback()
        print("Unable to save pitstops records to database.")