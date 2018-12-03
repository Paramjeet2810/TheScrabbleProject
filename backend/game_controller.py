from flask_restful import Resource, reqparse
from move_generation import generate_all_moves
from utility import read_dictionary
import numpy as np
from constants import shuffled_bag
dictionary = read_dictionary()


class GameController(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('board', type=list, action='append')
        parser.add_argument('rack', type=str, action='append')
        parser.add_argument('is_first_move', type=bool, action='append')
        body = parser.parse_args()
        board = body['board']; rack = body['rack']; is_first_move = body['is_first_move']
        # print board, rack
        board = np.array(board)
        all_moves = generate_all_moves(board, rack, is_first_move, dictionary)
        return {"response": all_moves}
    
    def get(self):
        return {"response": shuffled_bag}