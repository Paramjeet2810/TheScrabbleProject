from utility import find_word_above, find_word_below, all_letters, binary_search
from utility import read_dictionary


def cross_checks(board, row, dictionary):
    valid_letters = [[] for _ in range(len(board[row]))]
    for col in range(len(board[row])):
        if board[row][col] != '-':
            continue
        word_below = find_word_below(board, row, col)
        word_above = find_word_above(board, row, col)
        if word_above == '' and word_below == '':
            valid_letters[col] = all_letters()
            continue
        for i in range(ord('a'), ord('z') + 1):
            whole_word = word_above + chr(i) + word_below
            if binary_search(dictionary, whole_word) == -1:
                continue
            valid_letters[col].append(chr(i))
    return valid_letters


if __name__ == '__main__':
    board = [
        ['-', '-', 'a', '-', '-'],
        ['-', '-', 't', '-', '-'],
        ['-', '-', '-', '-', '-'],
        ['-', '-', 'a', 'i', 't'],
        ['-', '-', 'r', 'm', '-'],
        ['-', '-', 't', '-', '-']
    ]
    print cross_checks(board, len(board) - 1, read_dictionary())