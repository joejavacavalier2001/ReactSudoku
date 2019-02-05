var _ = require('underscore');

function MakeSudukoPuzzle(){
	var board = [
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0]
	];
	var possibilities = [1,2,3,4,5,6,7,8,9];

	var getCol = function(i){
		var output = [];
		board.forEach(function(boardRow){
			if (boardRow[i] > 0){
				output.push(boardRow[i]);
			}
		});
		return output;
	};
	var getSubSquare = function(row,col){
		var output = [];
		var vertical = Math.floor(row/3); 
		var horizontal = Math.floor(col/3);
		var start = vertical * 3;
		var hstart = horizontal * 3;
		board.slice(start,start+3).filter((currentRow,index) => (index + start !== row)).forEach(function(boardRow){
			boardRow.slice(hstart,hstart+3).filter(value => value > 0).forEach(function(boardValue){
				output.push(boardValue);
			});
		});

		return output;
	};
	// I don't trust any code outside this module with a reference to the board.
	// This function will always create and return a COPY of the board.
	this.getBoard = function(){
		var output = [];
		board.forEach(function(boardRow){
			output.push(boardRow.slice(0,9));
		});
		return output;
	};
	this.toString = function(){
		var strBoard = "";
		board.forEach(function(boardRow){
			boardRow.forEach(function(value){
				strBoard += value + " ";
			});
			strBoard += "\n";
		});
		return strBoard;
	};
	var recursivelyBuildBoard = function(curRowIndex,curColIndex){
		if (curRowIndex === 9){
			return true;
		}
		if (curColIndex === 9){
			return recursivelyBuildBoard(curRowIndex+1,0);
		}

		var currentRow = board[curRowIndex].filter(value => value > 0);
		var currentCol = getCol(curColIndex);
		var currentSubSquare = getSubSquare(curRowIndex,curColIndex);
		var usedPossibilities = _.uniq(currentRow.concat(currentCol).concat(currentSubSquare).sort((a,b)=>{return b-a;}),true);
		var allowedPossibilities = _.difference(possibilities,usedPossibilities);
		var newNumberIndex = 0;
		while(allowedPossibilities.length){
			newNumberIndex = _.random(allowedPossibilities.length - 1);
			board[curRowIndex][curColIndex] = allowedPossibilities[newNumberIndex];
			if (recursivelyBuildBoard(curRowIndex,curColIndex+1)){
				return true;
			}else{
				allowedPossibilities = _.without(allowedPossibilities,board[curRowIndex][curColIndex]);
			}
		}
		board[curRowIndex][curColIndex] = 0;
		return false;
	};
	recursivelyBuildBoard(0,0);
}

export {MakeSudukoPuzzle as default};

