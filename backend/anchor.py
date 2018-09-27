def get_anchor_positions(board, row):
    # print "Anchor For:", board[row]
    anchor_positions = []
    i = 0
    while i < len(board[row]):
        if board[row][i] != '-':
            # Need to append (i - 1)
            if i != 0:
                anchor_positions.append(i - 1)
            for j in range(i + 1, len(board[row])):
                if board[row][i] == '-':
                    i = j - 1
                    break
                else:
                    i = j
        i = i + 1
    return anchor_positions

if __name__ == '__main__':
    board = [
        ['-', '-', 'a', '-', '-'],
        ['-', '-', 't', '-', '-'],
        ['-', '-', '-', '-', '-'],
        ['-', '-', '-', 'a', 'b', 'c', '-', 't', 'u'],
        ['-', '-', 'r', 'z', '-'],
        ['-', '-', 't', '-', '-']
    ]
    print get_anchor_positions(board, 3)
