from flask_restful import Resource, reqparse
from move_generation import generate_all_moves
from utility import read_dictionary
import numpy as np
dictionary = read_dictionary()

class GameController(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('board', type=list, action='append')
        parser.add_argument('rack', type=str, action='append')
        body = parser.parse_args()
        board = body['board']; rack = body['rack']
        # print board, rack
        board = np.array(board)
        all_moves = generate_all_moves(board, rack, dictionary)
        return {"response": all_moves}