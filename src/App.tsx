import React, { Component } from "react";
import { DragDropContext } from 'react-dnd';
//import { DragDropContextProvider } from 'react-dnd'
import MultiBackend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/lib/HTML5toTouch"; // or any other pipeline
import {Col, Container, Row} from "react-grid-system";
import "./App.css";
import SudokuCell from "./SudokuCell.jsx";
import MakeSudokuPuzzle from "./SudokuMaker.js";
import PossibleAnswer from "./PossibleAnswer.jsx";

/* tslint:disable */
const TsCol: any = Col;
const TsRow: any = Row;
const TsContainer: any = Container;
const TsSudokuCell: any = SudokuCell;
const TsPossibleAnswer: any = PossibleAnswer;
/* tslint:enable */

class App extends Component {
  private puzzleMaker: any;
  private puzzleBoardCopy: Array<Array<number>>;
  private boardRenderer: any;
  private possibleAnswersRenderer: any;
  private classNames: any;
  private requestedFrame: number | undefined;
  private boundScheduleUpdate: any;
  private lastFrameRefresh: number;
  private requestFuncAvailable: boolean;
  private performanceAvailable: boolean;



  constructor(props : any){
    	super(props);
	this.boundScheduleUpdate = this.scheduleUpdate.bind(this);
        this.puzzleMaker = new MakeSudokuPuzzle();
        this.puzzleBoardCopy = this.puzzleMaker.getBoard();
	let counter = 0;
        this.requestFuncAvailable = (typeof window.requestAnimationFrame !== "undefined") ? true : false;
        this.performanceAvailable = (typeof window.performance !== "undefined") ? true : false;
        this.lastFrameRefresh = (this.performanceAvailable) ? performance.now() : 0;
	let revealProp = "hide";
	this.classNames = require('classnames');
	this.boardRenderer =  this.puzzleBoardCopy.map((boardRow, rowIndex) => {
		const boardRowRenderer = boardRow.map((boardValue, colIndex) => {
			let colClasses = null;
			switch (colIndex) {
				case 2:
				case 5:
					colClasses = this.classNames('boardColCSSClass','doubleRightCellBorder');
					break;
				case 3:
				case 6:
					colClasses = this.classNames('boardColCSSClass','noLeftCellBorder');
					break;
				default:
					colClasses = this.classNames('boardColCSSClass');
			}
			const keyStr = "boardCellKey_" + Number(rowIndex).toString() + Number(colIndex).toString();
			revealProp = ((counter++ % 2) === 0) ? "show" : "hide";
			return (<TsCol key={keyStr} className={colClasses}><TsSudokuCell reveal={revealProp} cellAnswer={boardValue} /></TsCol>);
		});
		let rowClasses = null;
		switch (rowIndex) {
			case 2:
			case 5:
				rowClasses = this.classNames('boardRowCSSClass','doubleBottomRowBorder');
				break;
			default:
				rowClasses = this.classNames('boardRowCSSClass');
		}
		const rowKeyStr = Number(rowIndex).toString();
		return (<TsRow key={rowKeyStr} className={rowClasses}>{boardRowRenderer}</TsRow>);
	});
	const _ = require('underscore');
	const paClass = this.classNames('possibleAnswerCSSClass');
	this.possibleAnswersRenderer = _.range(1,10).map((possibleAnswer: number) => {
		const paKey = "paKey_" + Number(String(possibleAnswer));
		return (<TsPossibleAnswer className={paClass} key={paKey} id={paKey} possibleAnswer={possibleAnswer} scheduleUpdate={this.boundScheduleUpdate} />);
	});
  }

  public render() {
	return (
      <div className="App">
	<h3>Want to play Sudoku?</h3>
	<p className="firstParagraphCSSClass">Click on the cells with hidden values and type the correct value to solve for that cell.</p>
	<p className="secondHeaderParagraphCSSClass">You can also drag and drop possible cell answers from the panel below on to the game board.</p>
	<TsContainer>{this.boardRenderer}</TsContainer>
	<p>&nbsp;</p>
	<p className="firstParagraphCSSClass">Possible cell answers:</p>
	<p className="secondParagraphCSSClass">(Drag and drop one of the answers on the correct grid cell to solve for that cell.)</p>
	<div className="possibleAnswersPanelCSSClass">{this.possibleAnswersRenderer}</div>
      </div>
    );
  }
  // tslint:disable-next-line ban-types
  private scheduleUpdate(updateFn: any) {
        // My experience with Visual Basic 5/6 tells me to make these hover callbacks as efficient as possible.
        // Hence the use of private boolean variables here!

        if ((this.requestFuncAvailable) && (this.performanceAvailable)){
                // See https://github.com/react-dnd/react-dnd/issues/869
                this.requestedFrame = requestAnimationFrame(this.drawFrame);
        }
  }

  private drawFrame = (timestamp: number) => {
	// Refresh at a minimum at 60 Hz or 60 fps
	// See https://physics.stackexchange.com/questions/227633/how-many-frames-can-human-eye-see 
	// for my reasoning for setting this rate.
	if ((timestamp - this.lastFrameRefresh) > 17){ 
		this.lastFrameRefresh = performance.now();
		this.setState((state) => {return {...state};});
	}
  };
}
export default DragDropContext(MultiBackend(HTML5toTouch))(App);
