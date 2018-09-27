from flask import Flask
from flask_restful import Api
from flask_cors import CORS
import game_controller

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
api = Api(app)
app.config['SECRET_KEY'] = 'scrabblers'

api.add_resource(game_controller.GameController, '/api/generate-move')

if __name__ == '__main__':
    app.run(debug=True)
