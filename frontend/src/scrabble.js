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
      ["-", "-", "-", "-", "-", "-", "-", "c", "a", "r", "t", "s", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "r", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "i", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "e", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "s", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
    ],
    rack: ["w", "e", "l", "l", "n", "s", "s"],
    isLoading: false,
    new_word_row_or_col: -1,
    new_word_row_or_col_number: -1,
    new_word_start: -1,
    new_word_end: -1
  };

  fillRack = () => {
      const alphabets = "abcdefghijklmnopqrstuvwxyz";
      this.setState(state => {
        const {rack} = state;
          return {
            rack: rack.map(letter => {
              if(letter === '-')
                return alphabets[Math.floor(Math.random() * alphabets.length)];
              else
                return letter;
            })
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
        rack: this.state.rack
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
            left_word,
            existing_word,
            right_word
          } = jsonRes.response;
          const {board, rack} = state;
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
          let new_rack = rack.map(letter => {
            if(left_word.includes(letter) || right_word.includes(letter))
              return '-';
            return letter;
          });
          return {
            board: board,
            rack: new_rack,
            isLoading: false,
            new_word_row_or_col: row_or_col,
            new_word_row_or_col_number: row_or_col_number,
            new_word_start: anchor_position - left_length + 1,
            new_word_end: anchor_position + existing_length + right_length
          }
        })
      });
    this.setState({
      isLoading: true
    })
  };

  render() {
    const { board, rack, isLoading, new_word_row_or_col, new_word_row_or_col_number, new_word_start, new_word_end } = this.state;
    console.log({...this.state});
    return (
      <div className="container">
        <div className="board">
          {board.map((row, index) => {
            if(new_word_row_or_col === 0 && index === new_word_row_or_col_number)
              return <Row rowContent={row} key={index} startIndex={new_word_start} endIndex={new_word_end}/>;
            if(new_word_row_or_col === 1 && new_word_start <= index && index <= new_word_end)
              return <Row rowContent={row} key={index} startIndex={new_word_row_or_col_number} endIndex={new_word_row_or_col_number}/>;
            return <Row rowContent={row} key={index} />
           })}
          <Row className="rack" rowContent={["Rack:", ...rack]} />
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
          isLoading ? <div className="notification"> Waiting for the move </div> : null
        }
      </div>
    );
  }
}
export default Scrabble;
