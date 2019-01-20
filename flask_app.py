from flask import Flask, render_template
from app.extensions import db, migrate
from app.views import *
from app.api.list_of_apis import *
from app.lib.log import *
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('./app/config.py', silent=True)
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

    register_blueprint(app)
    register_extension(app)

    with app.app_context():
        db.create_all()
        db.session.commit()
    return app


def register_blueprint(app):
    app.register_blueprint(view_blueprint)
    app.register_blueprint(race_blueprint)
    app.register_blueprint(results_blueprint)
    app.register_blueprint(qualifying_blueprint)
    app.register_blueprint(laptimes_blueprint)
    app.register_blueprint(pitstops_blueprint)
    app.register_blueprint(tyre_blueprint)

def register_extension(app):
    db.init_app(app)
    migrate.init_app(app)

app = create_app()

# To run the following custom flask functions: 
# 1) export FLASK_APP=flask_app.py
# 2) flask get_results
@app.cli.command()
def get_results():
    get_results_archive()

@app.cli.command()
def get_qual():
    get_qual_archive()

# It takes about 5 minutes to process and save laptimes of one race to database
# An alternative would be to batch import csv containing laptimes data of all races from 2016 to present (import_csv_from_aws.py), but time difference to save a race is not much different from saving direction from Ergast API
@app.cli.command()
def get_laptimes():
    get_laptimes_archive()    

@app.cli.command()
def get_pitstops():
    get_pitstops_archive()    
 
@app.cli.command()
def get_races():
    get_races_archive()

@app.cli.command()
def get_tyres():
    get_tyres_archive()  


@app.cli.command()
def recreate_db():
    db.drop_all()
    db.create_all()

#print(app.config);

if __name__ == '__main__':
    app.run(host=app.config["API_SERVER_HOST"], port=app.config["API_SERVER_PORT"], debug=True)
