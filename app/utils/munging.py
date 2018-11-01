# These functions serve to do data transfomations/munging for more complex data visualization
import pandas as pd
import numpy as np

def filter_outliers_percentile(data, time_field='time', id_field='driverRef'):
    """Returns a logical vector corresponding to the outliers (based on percentiles) for each driver. True values are the outliers"""

    time75, time25 = np.percentile(data[time_field], [75 ,0])
    iqrtime = time75 - time25        
    timemin = time25-(iqrtime*1.5)   
    timemax = time75+(iqrtime*1.5) 

    outliers = lambda x: (
        (x < timemin) |
        (x > timemax)
    )
    
    df_outlier = data.groupby(id_field)[[time_field]].apply(outliers).rename(columns = {"time":"outlier"})
    data = pd.merge(data, df_outlier, left_index = True, right_index = True)
    data = data[data['outlier'] == False]

    return data


def filter_pitlaps(df_lapTimes, df_pitStops, df_qual):
    
    df_pitStops.drop('id', axis=1, inplace=True)
    df_qual.drop('id', axis=1, inplace=True)
    data = pd.merge(df_lapTimes, df_qual[['constructorRef','driverRef', 'season', 'roundId', 'raceName']], on=['driverRef', 'season', 'roundId', 'raceName'], how='left')
    data = pd.merge(data, df_pitStops, on=['driverRef', 'season', 'roundId', 'raceName', 'lap'], how='left')
    wo_ps = data[data['stop'].isnull()]

    return wo_ps