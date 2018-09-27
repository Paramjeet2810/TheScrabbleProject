import {SCORE} from "./constants";

function find_word_below(board, row, col) {
    let word_below = "";
    for (let i = row + 1; i < board.length; i++) {
        if (board[i][col] === "-") {
            return word_below;
        }
        word_below = word_below + board[i][col];
    }
    return word_below;
}

function find_word_above(board, row, col) {
    let word_above = "";
    for (let i = row - 1; i >= 0; i--) {
        if (board[i][col] === "-") {
            return word_above;
        }
        word_above = board[i][col] + word_above;
    }
    return word_above;
}

function calculate_score(word) {
    let total_score = 0;
    for (let i = 0; i < word.length; i++) {
        total_score += SCORE[word[i]];
    }
}

function binary_search(dictionary, word) {
    let low = 0;
    let high = dictionary.length;
    while (low <= high) {
        const mid = parseInt((low + high) / 2);
        if (dictionary[mid] === word) return mid;
        if (dictionary[mid] > word) high = mid - 1;
        else if (dictionary[mid] < word) low = mid + 1;
    }
    return -1;
}

export {find_word_above, find_word_below, binary_search, calculate_score};
