import React, { Component } from "react";
import Row from "./row";

class Scrabble extends Component {
  state = {
    board: [
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
    ],
    is_loading: false,
    new_word_row_or_col: -1,
    new_word_row_or_col_number: -1,
    new_word_start: -1,
    new_word_end: -1,
    current_turn: 0,
    player_score: [0, 0],
    player_racks: [
      ["-", "-", "-", "-", "-", "-", "-"], 
      ["-", "-", "-", "-", "-", "-", "-"],
    ],
    bag: '',
    is_first_move: true,
  };

  fillRack = () => {
      this.setState(state => {
        const {player_racks, current_turn } = state; 
        let bag = state.bag;
        console.log(current_turn, player_racks)
        player_racks[current_turn] = player_racks[current_turn].map(letter => {
          if(letter === '-') {
            const alphabet_chosen = bag[Math.floor(Math.random() * bag.length)];
            bag = bag.replace(alphabet_chosen, '');
            return alphabet_chosen;
          }
          return letter;
        })
        console.log(current_turn, player_racks)
        return {
          player_racks: player_racks,
          bag: bag
        }
      })
  }

  getTheBestMove = () => {
    fetch("http://localhost:5000/api/generate-move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        board: this.state.board,
        rack: this.state.player_racks[this.state.current_turn],
        is_first_move: this.state.is_first_move
      })
    })
      .catch(res => console.log("Some error", res))
      .then(response => response.json())
      .then(jsonRes => {
        this.setState(state => {
          // console.log(jsonRes);
          const {
            row_or_col,
            row_or_col_number,
            anchor_position,
            existing_word,
            best_score
          } = jsonRes.response;
          let {
            left_word,
            right_word
          } = jsonRes.response;
          const {board, player_racks, current_turn, player_score} = state;
          const left_length = left_word.length;
          const right_length = right_word.length;
          const existing_length = existing_word.length;
          if(row_or_col === 0) {
            for(let i = 0; i < left_length; i++) {
              board[row_or_col_number][anchor_position - left_length + i + 1] = left_word[i];
            }
            for(let i = 0; i < right_length; i++) {
              board[row_or_col_number][anchor_position + 1 + existing_length + i] = right_word[i];
            }
          }
          else {
            for(let i = 0; i < left_length; i++) {
              board[anchor_position - left_length + i + 1][row_or_col_number] = left_word[i];
            }
            for(let i = 0; i < right_length; i++) {
              board[anchor_position + 1 + existing_length + i][row_or_col_number] = right_word[i];
            }
          }
          player_racks[current_turn] = player_racks[current_turn].map(letter => {
            if(left_word.includes(letter)) {
              left_word = left_word.replace(letter, '');
              return '-';
            }
            if(right_word.includes(letter)) {
              right_word= right_word.replace(letter, '');
              return '-';
            }
            return letter;
          });
          player_score[current_turn] += best_score;
          return {
            board: board,
            player_racks: player_racks,
            is_loading: false,
            new_word_row_or_col: row_or_col,
            new_word_row_or_col_number: row_or_col_number,
            new_word_start: anchor_position - left_length + 1,
            new_word_end: anchor_position + existing_length + right_length,
            current_turn: (current_turn + 1) % 2,
            player_score: player_score
          }
        })
      });
    this.setState(state => ({
      is_loading: true,
      is_first_move: state.is_first_move === true ? false : false
    }))
  };

  componentDidMount() {
    fetch("http://localhost:5000/api/generate-move")
    .then(response => response.json())
    .then(jsonRes => {
      this.setState({bag: jsonRes['response']});
    })
  }

  render() {
    const { 
      board, 
      player_racks, 
      is_loading, 
      new_word_row_or_col, 
      new_word_row_or_col_number, 
      new_word_start, 
      new_word_end, 
      current_turn, 
      player_score } = this.state;
    // console.log({...this.state});
    return (
      <div className="app">  
        <div className="container">
          <div className="board">
            {board.map((row, index) => {
              if(new_word_row_or_col === 0 && index === new_word_row_or_col_number)
                return <Row rowContent={row} key={index} startIndex={new_word_start} endIndex={new_word_end}/>;
              if(new_word_row_or_col === 1 && new_word_start <= index && index <= new_word_end)
                return <Row rowContent={row} key={index} startIndex={new_word_row_or_col_number} endIndex={new_word_row_or_col_number}/>;
              return <Row rowContent={row} key={index} />
            })}
            <Row className="rack" rowContent={["Rack:", ...player_racks[current_turn]]} />
          </div>
          <div className="controlButtons">
            <div>
            <button className="moveButton" onClick={this.getTheBestMove}>
              Generate Move
            </button>
            </div>
            <div>
            <button className="moveButton" onClick={this.fillRack}>
              Fill Rack
            </button>
            </div>
          </div>
          {
            is_loading ? <div className="notification"> Waiting for the move </div> : null
          }
        </div>
        <div className="results">
          <div>
            <div> Current Turn: Player {current_turn + 1}</div>
            <div> Player 1 Score: {player_score[0]} </div>
            <div> Player 2 Score: {player_score[1]} </div>
            <div> In the bag: {this.state.bag.length} </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Scrabble;
