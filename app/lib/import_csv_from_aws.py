import boto3
from app.models import *
from app.config import *
from app.lib.log import save_races_to_db, save_laptimes_to_db
from app.utils.utils import get_sec
import pandas as pd

def import_csv_from_aws():

	client = boto3.client(
		's3',
		aws_access_key_id=AWS_ACCESS_KEY_ID,
		aws_secret_access_key=AWS_SECRET_ACCESS_KEY
	)

	client.download_file('ergast-csv','filtered_laptimes.csv','filtered_laptimes.csv')
	client.download_file('ergast-csv','filtered_races.csv','filtered_races.csv')

	df_lapTimes = pd.read_csv('filtered_laptimes.csv')
	df_races = pd.read_csv('filtered_races.csv')

	df_races['round'] = df_races['round'].astype(int)
	df_races['season'] = df_races['season'].astype(int)

	df_lapTimes.rename(columns={"driverId":"driverRef"}, inplace=True)
	df_lapTimes = pd.merge(df_lapTimes, df_races[['raceId', 'raceName', 'season', 'round']], on=['raceId'], how='left')

	df_lapTimes.fillna("0:00:00", inplace=True)
	df_lapTimes['time'] = df_lapTimes['time'].map(lambda x: get_sec(x))

	df_lapTimes = df_lapTimes[["driverRef", "season", "raceId", "raceName", "round", "lap", "time", "position"]]
	df_lapTimes.rename(columns={"round":"roundId"}, inplace=True)

	save_races_to_db(df_races, db.session)

	for i, group in df_lapTimes.groupby("raceId"):

		g = group.drop(["raceId"], axis=1)
		b.session.bulk_insert_mappings(LapTimes, g.to_dict("records"))
		db.session.commit()


