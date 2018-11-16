# These functions serve to do data transfomations/munging for more complex data visualization
import pandas as pd
import numpy as np

def filter_pitlaps(df_lapTimes, df_pitStops, df_qual):
    
    df_pitStops.drop('id', axis=1, inplace=True)
    df_qual.drop('id', axis=1, inplace=True)
    data = pd.merge(df_lapTimes, df_qual[['constructorRef','driverRef', 'season', 'roundId', 'raceName']], on=['driverRef', 'season', 'roundId', 'raceName'], how='left')
    data = pd.merge(data, df_pitStops, on=['driverRef', 'season', 'roundId', 'raceName', 'lap'], how='left')
    wo_ps = data[data['stop'].isnull()]

    return wo_ps

def groupBySeconds(df_laptimes, df_qual):

    df_laptimes['time(rounded)'] = df_laptimes['time'].round()
    df_laptimes = pd.DataFrame(df_laptimes.groupby(['season', 'raceName', 'driverRef', 'time(rounded)'])['lap'].agg('count')).rename(columns={'lap':'count'}).reset_index()
    table = pd.pivot_table(df_laptimes, values='count', index=['season', 'raceName', 'driverRef'], columns=['time(rounded)'], aggfunc=np.sum)\
            .fillna(0).reset_index()

    table = pd.merge(table, df_qual[['constructorRef','driverRef', 'season', 'raceName']], on=['driverRef', 'season', 'raceName'], how='left')

    return table