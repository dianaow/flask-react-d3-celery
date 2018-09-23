from flask import Flask, render_template
from app.extensions import db, migrate
from app.views import view_blueprint
from app.api.races import race_blueprint
from app.lib.log import historical_records
import warnings
warnings.filterwarnings("ignore", message="numpy.dtype size changed")
warnings.filterwarnings("ignore", message="numpy.ufunc size changed")

def create_app():
    app = Flask(__name__, static_folder="./static", template_folder="./static")
    app.config.from_pyfile('./app/config.py', silent=True)

    register_blueprint(app)
    register_extension(app)

    with app.app_context():
        print(db)
        db.create_all()
        db.session.commit()
    return app


def register_blueprint(app):
    app.register_blueprint(view_blueprint)
    app.register_blueprint(race_blueprint)


def register_extension(app):
    db.init_app(app)
    migrate.init_app(app)


app = create_app()

@app.cli.command()
def historical():
    historical_records()

@app.cli.command()
def recreate_db():
    db.drop_all()
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)