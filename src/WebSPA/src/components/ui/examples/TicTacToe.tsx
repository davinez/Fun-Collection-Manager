import type { FunctionComponent } from "shared/types/global.types";
import { useState } from "react";

type TSquareProps = {
	value: string | null;
	onSquareClick: () => void;
};

type TBoardProps = {
	xIsNext: boolean;
	squares: string | null;
	onPlay: (nextSquares: Array<string | null>) => void;
};

const calculateWinner = (squares: string | null): string | null => {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (const [a, b, c] of lines) {
		if (
			squares &&
			a &&
			b &&
			c &&
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			return squares[a] as string;
		}
	}
	return null;
};

const Square = ({ value, onSquareClick }: TSquareProps): FunctionComponent => {
	return (
		<button className="square" onClick={onSquareClick}>
			{value === null ? "" : value}
		</button>
	);
};

const Board = ({
	xIsNext,
	squares,
	onPlay,
}: TBoardProps): FunctionComponent => {
	const handleClick = (index: number): void => {
		if (calculateWinner(squares) || squares !== null && squares[index]) {
			return;
		}

		const nextSquares = [...squares as string] as Array<string | null>;
		nextSquares[index] = xIsNext ? "X" : "O";
		onPlay(nextSquares);
	};

	if (squares === null) {
		squares = "";
	}

	const winner = calculateWinner(squares);
	let status = "";
	status = winner
		? "Winner: " + winner
		: "Next player: " + (xIsNext ? "X" : "O");

	return (
		<>
			<div className="status">{status}</div>
			<div className="board-row">
				<Square
					value={squares[0] as string | null}
					onSquareClick={(): void => {
						handleClick(0);
					}}
				/>
				<Square
					value={squares[1] as string | null}
					onSquareClick={(): void => {
						handleClick(1);
					}}
				/>
				<Square
					value={squares[2] as string | null}
					onSquareClick={(): void => {
						handleClick(2);
					}}
				/>
			</div>
			<div className="board-row">
				<Square
					value={squares[3] as string | null}
					onSquareClick={(): void => {
						handleClick(3);
					}}
				/>
				<Square
					value={squares[4] as string | null}
					onSquareClick={(): void => {
						handleClick(4);
					}}
				/>
				<Square
					value={squares[5] as string | null}
					onSquareClick={(): void => {
						handleClick(5);
					}}
				/>
			</div>
			<div className="board-row">
				<Square
					value={squares[6] as string | null}
					onSquareClick={(): void => {
						handleClick(6);
					}}
				/>
				<Square
					value={squares[7] as string | null}
					onSquareClick={(): void => {
						handleClick(7);
					}}
				/>
				<Square
					value={squares[8] as string | null}
					onSquareClick={(): void => {
						handleClick(8);
					}}
				/>
			</div>
		</>
	);
};

export const TicTacToe = (): FunctionComponent => {
	const arrayHistory = [null];

	const [history, setHistory] = useState<Array<string | null>>(arrayHistory);
	const [currentMove, setCurrentMove] = useState(0);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove] as string | null;

	const handlePlay = (nextSquares: Array<string | null>): void => {
		const nextHistory = [
			...history.slice(0, currentMove + 1),
			nextSquares,
		] as Array<string | null>;

		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	};

	const jumpTo = (nextMove: number): void => {
		setCurrentMove(nextMove);
	};

	const moves = history.map((squares, move) => {
		let description: string = "";

		description = move > 0 ? "Go to move #" + move : "Go to game start";
		return (
			<li key={move}>
				<button
					onClick={(): void => {
						jumpTo(move);
					}}
				>
					{description}
				</button>
			</li>
		);
	});

	return (
		<div className="game">
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
			<div className="game-info">
				<ol>{moves}</ol>
			</div>
		</div>
	);
};
