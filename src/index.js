import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button style={{ backgroundColor: props.winLine ? 'Chartreuse' : '' }} className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, winLine = false) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winLine={winLine}
      />
    );
  }
  render() {
    let boardSize = 3;
    let squares = [];
    let locationOfSquares = [];
    for (let i = 0; i < boardSize; i++) {
      let row = [];
      for (let j = 0; j < boardSize; j++) {
        locationOfSquares.push({ col: j + 1, row: i + 1 });
        if (this.props.winLine) {
          let winLine = this.props.winLine;
          let squareNumber = i * boardSize + j;
          row.push(this.renderSquare(squareNumber,
            squareNumber === winLine[0] || squareNumber === winLine[1] || squareNumber === winLine[2] ? true : false))
        } else {
          row.push(this.renderSquare(i * boardSize + j));
        }
      }
      squares.push(<div key={i} className="board-row">{row}</div>);
    }
    this.props.location(locationOfSquares);
    return (
      <div>{squares}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          moveLocation: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }
 
  toggleList() {
    this.setState({
      ascending: !this.state.ascending,
    });
  }

  getLocation(locationOfSquares) {
    this.locationOfSquares = locationOfSquares;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          moveLocation: this.locationOfSquares[i],
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = this.state.ascending
      ? history.map((step, move) => {
        const desc = move
          ? 'Go to move #' + move + ` (col: ${step.moveLocation.col}, row: ${step.moveLocation.row})`
          : 'Go to game start'
        return (
          <li key={move}>
            <button
              style={{ color: this.state.stepNumber === move ? 'blue' : '' }}
              onClick={() => this.jumpTo(move)}
            >
              {this.state.stepNumber === move ? <b>{desc}</b> : desc}
            </button>
          </li>
        );
      })
      : history.map((step, move) => {
        const desc = (history.length - 1 - move)
          ? 'Go to move #' + (history.length - 1 - move) + ` (col: ${history[history.length - 1 - move].moveLocation.col}, row: ${history[history.length - 1 - move].moveLocation.row})`
          : 'Go to game start';
        return (
          <li key={move}>
            <button
              style={{ color: this.state.stepNumber === (history.length - 1 - move) ? 'orange' : '' }}
              onClick={() => this.jumpTo(history.length - 1 - move)}
            >
              {this.state.stepNumber === (history.length - 1 - move) ? <b>{desc}</b> : desc}
            </button>
          </li>
        );
      })

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    let count = 0;
    for (let i = 0; i < current.squares.length; i++) {
      if (current.squares[i] !== null) {
        count += 1
      }
    }
    if (count === 9 && !winner) {
      status = 'Draw';
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            location={(locationsOfSquares) => this.getLocation(locationsOfSquares)}
            winLine={winner ? winner.winLine : null}
          />
        </div>
        <div className="game-info">
          <div><b>{status}</b></div>
          <div>
            <ol>{moves}</ol>
          </div>
        </div>
        <div>
          <button onClick={() => { this.toggleList() }}>Toggle List</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winLine: lines[i]
      }
    }
  }
  return null;
}
