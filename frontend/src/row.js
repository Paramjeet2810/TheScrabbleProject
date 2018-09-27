import React, {Component} from "react";
import Tile from "./tile";

class Row extends Component {
  render() {
    const {rowContent, startIndex, endIndex } = this.props;
    console.log(startIndex, endIndex)
    return (
      <div className={`row ${this.props.className}`}>
        {
          rowContent.map((tile, index) => <Tile tileContent = {tile} key = {index} className={startIndex <= index && index <= endIndex ? 'highlight' : ''} />)
        }
      </div>);
  }
}
export default Row;
