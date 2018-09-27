from constants import DICTIONARY_FILE_NAME, SCORE


def common_letters(above_letters, below_letters):
    common = []
    for i in above_letters:
        if i in below_letters:
            common.append(i)
    return common


def read_dictionary():
    dictionary_file = open(DICTIONARY_FILE_NAME, 'r')
    dictionary = dictionary_file.readlines()
    for i in range(len(dictionary)):
        dictionary[i] = dictionary[i].split('\n')[0]
    dictionary_file.close()
    return dictionary


def find_word_below(board, row, col):
    word_below = ''
    for i in range(row + 1, len(board)):
        if board[i][col] == '-':
            return word_below
        word_below += board[i][col]
    return word_below


def find_word_above(board, row, col):
    word_above = ''
    for i in range(row - 1, -1, -1):
        if board[i][col] == '-':
            return word_above
        word_above = board[i][col] + word_above
    return word_above


def all_letters():
    return [chr(c) for c in range(ord('a'), ord('z') + 1)]


def calculate_score(word):
    score = 0
    for letter in word:
        score += SCORE[letter]
    return score


def word_after_anchor(board, row, anchor):
    word = ''
    for i in range(anchor + 1, len(board[row])):
        if board[row][i] == '-':
            break
        word = word + board[row][i]
    return word


def binary_search(dictionary, word):
    low = 0
    high = len(dictionary) - 1
    while low <= high:
        mid = (low + high) / 2
        if dictionary[mid] == word:
            return 0
        if dictionary[mid] > word:
            high = mid - 1
        elif dictionary[mid] < word:
            low = mid + 1
    return -1

def is_whole_permutation_valid(
    left_word, existing_word, 
    right_word, allowed_letters, 
    anchor, dictionary):
    left_length = len(left_word)
    existing_word_length = len(existing_word)
    right_length = len(right_word)
    whole_word = left_word + existing_word + right_word
    if binary_search(dictionary, whole_word) == -1:
        return False
    for i in range(len(left_word) - 1, -1, -1):
        if left_word[i] not in allowed_letters[anchor - left_length + i + 1]:
            return False
    for i in range(0, right_length):
        if right_word[i] not in allowed_letters[anchor + existing_word_length + i + 1]:
            return False
    return True

if __name__ == '__main__':
    print read_dictionary()
