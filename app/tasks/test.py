from celery.task.base import periodic_task
import requests
import json
import pandas as pd
import datetime
from app import app
from app.models import Race, db

@periodic_task(run_every=datetime.timedelta(seconds=300))
def periodic_run_get_manifest():
    with app.app_context():
        seasons = [2018]
        races_round = range(1,4)
        df_races, df_circuits, constructors, df_drivers, df_results = extract_to_df_race('results', seasons, races_round)
        for idx,row in df_races.iterrows():
            r = Race()
            r.raceId = df_races.loc[idx,"raceId"]
            r.url = df_races.loc[idx,"url"]
            r.season = df_races.loc[idx,"season"]
            r.raceName = df_races.loc[idx,"raceName"]
            db.session.add(r)
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(str(e))

def extract_to_df_race(results_type, seasons, races_round):

    df_results = pd.DataFrame()
    df_drivers = pd.DataFrame()
    df_circuits = pd.DataFrame()
    df_races = pd.DataFrame()
    df_qual = pd.DataFrame()
    df_pitStops = pd.DataFrame()
    df_lapTimes = pd.DataFrame()
    
    laps = range(1,80)
    if results_type == 'laps':   
        for s in seasons:
            for r in races_round:
                try:
                    response = requests.get("http://ergast.com/api/f1/" + str(s) + "/" + str(r) + "/" + "laps?limit=2000.json")
                    #print response.status_code
                    dictionary = response.content # Store content of the response (the data the server returned)
                    dictionary = json.loads(dictionary) # Converts string to a list
                    laptimes = transform_laptimes(dictionary, s, r) 
                    df_lapTimes = pd.concat([df_lapTimes, laptimes])
                except:
                    pass

        return df_lapTimes
    
    for s in seasons:
        for r in races_round:
            try:
                response = requests.get("http://ergast.com/api/f1/" + str(s) + "/" + str(r) + "/" + str(results_type) + ".json")
                #print response.status_code
                dictionary = response.content 
                dictionary = json.loads(dictionary)
                
                if results_type == 'results': 
                    race, circuit, constructors, drivers, results = transform_results(dictionary, s, r) # Transform dictionary of one race's information to a dataframe
                    df_results = pd.concat([df_results, results])
                    df_drivers = pd.concat([df_drivers, drivers])
                    df_circuits = pd.concat([df_circuits, circuit])
                    df_races = pd.concat([df_races, race])
                    
                if results_type == 'qualifying': 
                    qual = transform_qualifying(dictionary, s, r) 
                    df_qual = pd.concat([df_qual, qual])
                    
                if results_type == 'pitstops': 
                    pS = transform_pitstops(dictionary, s, r) 
                    df_pitStops = pd.concat([df_pitStops, pS])
            except:
                pass

        
    if results_type == 'results': 
        constructors.drop_duplicates(keep='first', inplace=True)
        constructors = constructors.reset_index(drop=True).reset_index().rename(columns={'index': 'constructorId'})
        constructors['constructorId'] = constructors['constructorId'] + 1

        df_drivers.drop_duplicates(keep='first', inplace=True)
        df_drivers = df_drivers.reset_index(drop=True).reset_index().rename(columns={'index': 'driverId'})
        df_drivers['driverId'] = df_drivers['driverId'] + 1

        df_circuits = df_circuits.reset_index(drop=True).reset_index().rename(columns={'index': 'circuitId'})
        df_circuits['circuitId'] = df_circuits['circuitId'] + 1
        
        df_races = df_races.reset_index(drop=True).reset_index().rename(columns={'index': 'raceId'})
        df_races['raceId'] = df_races['raceId'] + 1
        
        df_results = df_results.reset_index(drop=True).reset_index().rename(columns={'index': 'resultId'})
        df_results['resultId'] = df_results['resultId'] +1

        return df_races, df_circuits, constructors, df_drivers, df_results
        
    if results_type == 'qualifying':
        df_qual = df_qual.reset_index(drop=True).reset_index().rename(columns={'index': 'qualifyId'})
        df_qual['qualifyId'] = df_qual['qualifyId'] + 1
        
        return  df_qual

    if results_type == 'pitstops':
        return  df_pitStops


def helper(dictionary, s, r, col):

    nest = dictionary['MRData']['RaceTable']['Races']
    
    # Circuits
    df_circuit = pd.DataFrame.from_dict(nest[0]['Circuit'], orient='index').T
    df_circuit.rename(columns={'circuitId':'circuitRef'}, inplace=True)
     
    # Results
    df = pd.DataFrame.from_dict(nest[0][col])
    df['season'] = s
    df['round'] = r
    
    if (col != 'PitStops') & (col != 'Laps'):
        # Races
        df_races = pd.DataFrame.from_dict(nest[0], orient='index').T
        df_races.drop([col, 'Circuit'], axis=1, inplace=True)
        df_races['round'] = df_races['round'].astype(int)
        df_races['season'] = df_races['season'].astype(int)

        # Constructors
        df_constructor = pd.DataFrame()
        for i in df['Constructor']:
            row = pd.DataFrame.from_dict(i, orient='index').T
            df_constructor = pd.concat([df_constructor, row])
        df_constructor.rename(columns={'constructorId': 'constructorRef'}, inplace=True)

        # Drivers
        df_driver = pd.DataFrame()
        for i in df['Driver']:
            driver_row = pd.DataFrame.from_dict(i, orient='index').T
            df_driver = pd.concat([df_driver, driver_row])
        df_driver.rename(columns={'driverId': 'driverRef'}, inplace=True)

        # Index the race results with driver name, constructor name, raceId, season year
        df_results = pd.concat([df_constructor['constructorRef'].reset_index(drop=True), df_driver['driverRef'].reset_index(drop=True)], axis=1)
        df_results['season'] = s
        df_results['round'] = r

        return df_races, df_circuit, df_constructor, df_driver, df_results, df
    else:
        # Races
        df_races = pd.DataFrame.from_dict(nest)
        df_races.drop([col, 'Circuit'], axis=1, inplace=True)
        df_races['round'] = df_races['round'].astype(int)
        df_races['season'] = df_races['season'].astype(int)
        
        return df_races, df


def transform_results(dictionary, s, r):
    
    df_races, df_circuit, df_constructor, df_driver, df_results, df = helper(dictionary, s, r, col='Results') 
    df_results = pd.concat([df_results, df[['grid', 'laps', 'number', 'points', 'position', 'positionText', 'status']]], axis=1)
    df_results = pd.merge(df_results, df_races[['raceName', 'season', 'round']], on=['season', 'round'], how='left')
        
    return df_races, df_circuit, df_constructor, df_driver, df_results

def transform_qualifying(dictionary, s, r):
    
    df_races, df_circuit, df_constructor, df_driver, df_qual, df = helper(dictionary, s, r, col='QualifyingResults')
    df_qual = pd.concat([df_qual, df[['Q1', 'Q2', 'Q3', 'number', 'position']]], axis=1)
    
    return df_qual

def transform_pitstops(dictionary, s, r):
    
    df_races, df_pitStops = helper(dictionary, s, r, col='PitStops')
    df_pitStops = pd.merge(df_pitStops, df_races[['raceName', 'season', 'round']], on=['season', 'round'], how='left')
    df_pitStops.rename(columns={'driverId':'driverRef'}, inplace=True)  
    
    return df_pitStops

def transform_laptimes(dictionary, s, r):
    
    nest = dictionary['MRData']['RaceTable']['Race']["LapsList"]
    
    df_lapTimes = pd.DataFrame()
    for i in nest['Lap']:
        row = pd.DataFrame.from_dict(i)
        for x in row['Timing']:
            row = pd.DataFrame.from_dict(x, orient='index').T
            df_lapTimes = pd.concat([df_lapTimes, row])
    
    df_lapTimes['season'] = s
    df_lapTimes['round'] = r
    
    df_races = pd.DataFrame.from_dict(dictionary['MRData']['RaceTable']['Race'], orient='index').T
    df_races.drop(["LapsList", 'Circuit'], axis=1, inplace=True)
    df_races['round'] = df_races['round'].astype(int)
    df_races['season'] = df_races['season'].astype(int)
    df_races.rename(columns={"RaceName":"raceName"}, inplace=True)   
    df_lapTimes = pd.merge(df_lapTimes, df_races[['raceName', 'season', 'round']], on=['season', 'round'], how='left')

    return df_lapTimes



