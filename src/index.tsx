import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface square {
  squares: string[];
}

interface SProps {
  value: string;
  onClick: (i: number) => void;
}

interface IProps extends square, SProps {}

interface IState {
  value: string;
}

interface BState extends square {
  xIsNext: boolean;
}

interface GState {
  history: square[];
  step: number;
  xIsNext: boolean;
}

function checkWinner(squares: string[]) {
  const lines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [x, y, z] = lines[i];
    if (squares[x] && squares[x] === squares[y] && squares[x] === squares[z]) {
      return squares[x]
    }
  }
  return null
}

class Square extends React.Component<SProps, {}> {
  render() {
    return (
      <button className="square" onClick={() => {this.props.onClick(0)}}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component<IProps, BState> {
  // handleClick(i: number) {
  //   const squares = this.state.squares.slice();
  //   if (checkWinner(this.state.squares) || squares[i].length > 0) {
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'x' : 'o';
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  renderSquare(i: number) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    // const winner = checkWinner(this.props.squares);
    // let status: string = '';
    // if (winner) {
    //   status = 'Winner: ' + winner;
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'x' : 'o');
    // }
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component<{}, GState> {
  constructor(props: any) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(''),
      }],
      step: 0,
      xIsNext: true,
    }
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.step + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (checkWinner(squares) || squares[i].length > 0) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'x' : 'o';
    this.setState({
      history: history.concat(([{
        squares: squares,
      }])),
      step: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step: number) {
    this.setState({
      step: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.step];
    const winner = checkWinner(current.squares);

    const move = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })
    let status: string = '';
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'x' : 'o');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            value=""
            onClick={(i: number) => {this.handleClick(i)}}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{move}</ol>
        </div>
      </div>
    );
  }
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

