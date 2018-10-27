import requests
import json
import pandas as pd
import datetime
import xmltodict
import numpy as np

def get_sec(time_str):

    if ":" in time_str:
        if time_str[1] == ":":
            time_str = time_str[0:4] + ":" + time_str[5:]
            m, s, ms = time_str.split(':')
        elif time_str[2] == ":":
            time_str = time_str[0:5] + ":" + time_str[6:]
            m, s, ms = time_str.split(':')
        else:
            m = 0
            s = 0
            ms = 0
        return float(int(m) * 60 + int(s) + int(ms)/1000)
    elif " " in time_str:
        return float(0)
    else:
        return time_str

def extract_to_df_race(results_type, seasons, races_round):

    df_results = pd.DataFrame()
    df_drivers = pd.DataFrame()
    df_circuits = pd.DataFrame()
    df_races = pd.DataFrame()
    df_qual = pd.DataFrame()
    df_pitStops = pd.DataFrame()
    df_lapTimes = pd.DataFrame()
    df_all = pd.DataFrame()
    
    laps = range(1,80)
    if results_type == 'laps':   
        for s in seasons:
            for r in races_round:
                try:
                    response = requests.get("http://ergast.com/api/f1/" + str(s) + "/" + str(r) + "/" + "laps?limit=2000.json")
                    dictionary = response.content # Store content of the response (the data the server returned)
                    dictionary = xmltodict.parse(dictionary, attr_prefix='')
                    lapTimes, races = helper_laptimes(dictionary, s, r) 
                    df_lapTimes = pd.concat([df_lapTimes, lapTimes])
                    df_races = pd.concat([df_races, races])
                except:
                    print("Error with transforming json dictionary to pandas dataframe for season %d, race %d." % (s, r))
                    pass
 
    for s in seasons:
        for r in races_round:
            try:
                response = requests.get("http://ergast.com/api/f1/" + str(s) + "/" + str(r) + "/" + str(results_type) + ".json")
                dictionary = response.content 
                dictionary = json.loads(dictionary)
                
                if results_type == 'results': 
                    races, circuit, constructor, driver, results, df = helper(dictionary, s, r, col='Results') 
                    df_results = pd.concat([df_results, results])
                    df_races = pd.concat([df_races, races])
                    df_all = pd.concat([df_all, df])
                    
                if results_type == 'qualifying': 
                    races, circuit, constructor, driver, qual, df = helper(dictionary, s, r, col='QualifyingResults')
                    df_qual = pd.concat([df_qual, qual])
                    df_races = pd.concat([df_races, races])
                    df_all = pd.concat([df_all, df])
                    
                if results_type == 'pitstops': 
                    races, pS = helper(dictionary, s, r, col='PitStops')
                    df_pitStops = pd.concat([df_pitStops, pS])
                    df_races = pd.concat([df_races, races])
                    
            except:
                print("Error with transforming json dictionary to pandas dataframe for season %d, race %d." % (s, r))
                pass
    
    if results_type == 'laps':
        try:
            print("Completed data processing for laptimes data.")
            return transform_laptimes(df_lapTimes, df_races)
        except:
            print("Error with data processing for laptimes data.")
            return []
    
    if results_type == 'results': 
        try:
            print("Completed data processing for results data.")
            return transform_results(df_results, df_races, df_all) 
        except:
            print("Error with data processing for laptimes data..")
            return []
    
    if results_type == 'qualifying':
        try:
            print("Completed data processing for qualifying data.")
            return transform_qualifying(df_qual, df_races, df_all) 
        except:
            print("Error with data processing for qualifying data.")
            return []

    if results_type == 'pitstops':
        try:
            print("Completed data processing for races data.")
            return transform_pitstops(df_pitStops, df_races)
        except:
            print("Error with data processing for races data.")
            return []

def data_cleaning_helper(df):
    
    df.replace('', np.nan, inplace=True)
    df['season'].fillna(0, inplace=True)
    df['round'].fillna(0, inplace=True)
    df['raceName'].fillna("None", inplace=True)
    df['driverRef'].fillna("None", inplace=True)
    
    df['season'] = df['season'].astype(int)
    df['round'] = df['round'].astype(int)
    df['raceName'] = df['raceName'].astype(str)
    df['driverRef'] = df['driverRef'].astype(str)
    
    if 'constructorRef' in df.columns:
        df['constructorRef'].fillna("None", inplace=True)
        df['constructorRef'] = df['constructorRef'].astype(str)
    
    return df


def helper_laptimes(dictionary, s, r):
    
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
    
    return df_lapTimes, df_races


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
            df_driver = pd.concat([df_driver, driver_row], sort=True)
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


def transform_results(df_results, df_races, df_all):
    
    df_results = pd.merge(df_results, df_races[['raceName', 'season', 'round']], on=['season', 'round'], how='left')
    df_results = pd.concat([df_results, df_all[['grid', 'laps', 'number', 'points', 'position', 'positionText', 'status']].reset_index()], axis=1)
    
    df_results = data_cleaning_helper(df_results)
    df_results['grid'].fillna(0, inplace=True)
    df_results['laps'].fillna(0, inplace=True)
    df_results['position'].fillna(0, inplace=True)
    df_results['points'].fillna(0, inplace=True)
    df_results['status'].fillna("None", inplace=True)
    
    df_results['grid'] = df_results['grid'].astype(int)
    df_results['laps'] = df_results['laps'].astype(int)
    df_results['position'] = df_results['position'].astype(int)
    df_results['points'] = df_results['points'].astype(int)
    df_results['status'] = df_results['status'].astype(str)
    
    df_results = df_results.reset_index(drop=True)
    df_races = df_races.reset_index(drop=True)

    return df_results, df_races

def transform_qualifying(df_qual, df_races, df_all):
    
    df_qual = pd.merge(df_qual, df_races[['raceName', 'season', 'round']], on=['season', 'round'], how='left')
    df_qual = pd.concat([df_qual, df_all[['Q1', 'Q2', 'Q3', 'number', 'position']].reset_index()], axis=1)

    df_qual = data_cleaning_helper(df_qual)
    df_qual['Q1'].fillna("0:00:00", inplace=True)
    df_qual['Q2'].fillna("0:00:00", inplace=True)
    df_qual['Q3'].fillna("0:00:00", inplace=True)
    df_qual['Q1'] = df_qual['Q1'].map(lambda x: get_sec(x))
    df_qual['Q2'] = df_qual['Q2'].map(lambda x: get_sec(x))
    df_qual['Q3'] = df_qual['Q3'].map(lambda x: get_sec(x))
    df_qual['position'].fillna(0, inplace=True)
    df_qual['position'] = df_qual['position'].astype(int)
    
    df_qual = df_qual.reset_index(drop=True)

    return df_qual

def transform_pitstops(df_pitStops, df_races):
    
    df_pitStops = pd.merge(df_pitStops, df_races[['raceName', 'season', 'round']], on=['season', 'round'], how='left')
    df_pitStops.rename(columns={'driverId':'driverRef'}, inplace=True)
    
    df_pitStops = data_cleaning_helper(df_pitStops)
    df_pitStops['duration'].fillna("0:00:00", inplace=True)
    df_pitStops['duration'] = df_pitStops['duration'].map(lambda x: get_sec(x))
    df_pitStops['duration'] = df_pitStops['duration'].astype(float)
    df_pitStops['lap'].fillna(0, inplace=True)
    df_pitStops['lap'] = df_pitStops['lap'].astype(int)
    df_pitStops['stop'].fillna(-1, inplace=True)
    df_pitStops['stop'] = df_pitStops['stop'].astype(int)
    
    df_pitStops = df_pitStops.reset_index(drop=True)
    
    return df_pitStops

def transform_laptimes(df_lapTimes, df_races):

    df_races.rename(columns={"RaceName":"raceName"}, inplace=True)   
    df_races['round'] = df_races['round'].astype(int)
    df_races['season'] = df_races['season'].astype(int)
    
    df_lapTimes = pd.merge(df_lapTimes, df_races[['raceName', 'season', 'round']], on=['season', 'round'], how='left')

    df_lapTimes.rename(columns={"driverId":"driverRef"}, inplace=True)
    
    df_lapTimes = data_cleaning_helper(df_lapTimes)
    df_lapTimes['time'].fillna("0:00:00", inplace=True)
    df_lapTimes['time'] = df_lapTimes['time'].map(lambda x: get_sec(x))
    df_lapTimes['time'] = df_lapTimes['time'].astype(float)
    df_lapTimes['lap'].fillna(0, inplace=True)
    df_lapTimes['lap'] = df_lapTimes['lap'].astype(int)
    df_lapTimes['position'].fillna(0, inplace=True)
    df_lapTimes['position'] = df_lapTimes['position'].astype(int)
    
    df_lapTimes = df_lapTimes.reset_index(drop=True)
    
    return df_lapTimes
