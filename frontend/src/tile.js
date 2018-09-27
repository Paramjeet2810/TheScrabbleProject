import React, { PureComponent } from "react";

class Tile extends PureComponent {
  render() {
    const { tileContent, className } = this.props;
    return (
      <div className={className || "tile"}>
        <span> {tileContent} </span>
      </div>
    );
  }
}

export default Tile;
