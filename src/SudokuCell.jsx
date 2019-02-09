import React, {Component} from 'react';
import { DropTarget } from 'react-dnd';
import { Types } from './SharedDefinitions.jsx';

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const sudokuSquareTarget = {
  canDrop(props, monitor) {
    // You can disallow drop based on props or item
    const item = monitor.getItem();
    return item.pa === props.cellAnswer;
  },

  hover(props, monitor, component) {
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // here—if you need them, put monitor.isOver() into collect() so you
    // can just use componentWillReceiveProps() to handle enter/leave.

    // You will receive hover() even for items for which canDrop() is false
    const canDrop = monitor.canDrop();
  },

  drop(props, monitor, component) {
    // Obtain the dragged item
    const item = monitor.getItem();
	if (item.pa === props.cellAnswer){
		component.setState({editing: false, revealNumber: true});
	}
    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { dropped: true };
  }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    canDrop: monitor.canDrop(),
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    itemType: monitor.getItemType()
  };
}

class SudokuCell extends Component{
  constructor(props) {
	super(props);
	if ((this.props.reveal) && (this.props.reveal === "show")){
		this.state = {editing: false, revealNumber: true};
	} else {
		this.state = {editing: false, revealNumber: false};
	}
	// I need to reference BOTH the "this" variable and 
	// the event parameter in the following handlers.
	// I need to ensure fully that the "this" variable is properly bound!
	this.boundHandleOnKeyDown = this.handleOnKeyDown.bind(this);
	this.boundHandleOnFocus = this.handleOnFocus.bind(this);
	this.boundHandleOnBlur = this.handleOnBlur.bind(this);
	this.boundHandleOnInput = this.handleOnInput.bind(this);
	this.wasEditing = false;
	this.inputWasFocused = false;
	this.inputRef = React.createRef();
  }

  handleClick = () => {
	this.setState({editing: true, revealNumber: false});
  }


  handleOnKeyDown(e){
	if ((this.state.editing) && ((e.nativeEvent.key === "Esc") || (e.nativeEvent.key === "Escape"))){
		this.setState({editing: false, revealNumber: false});
	}
  }

  handleOnInput(e){
	if (this.state.editing){
		// eslint-disable-next-line no-console
		console.log("on Input called");
		// eslint-disable-next-line no-console
		console.log("value = " + e.currentTarget.value);
		if (parseInt(String(e.currentTarget.value).trim()) === parseInt(String(this.props.cellAnswer).trim())){
			this.setState({editing: false, revealNumber: true});
		} else { 
			e.currentTarget.value = "";
		}
	}
  }

  handleOnBlur(e) {
  	// Some browsers are stupid enough to call this event on 
	// the input element before even giving it focus.
	// Really?
		  
	// eslint-disable-next-line no-console
	console.log("on blur called");
	if (this.inputWasFocused){
		this.setState({editing: false, revealNumber: false});
	}
  }

  handleOnFocus(e){
	  // eslint-disable-next-line no-console
	  console.log("on focus called");
	  if (e.currentTarget.tagName === "INPUT"){
		  this.inputWasFocused = true;
	  }
  }

  componentWillReceiveProps(nextProps) {
	// eslint-disable-next-line no-console
	console.log("inside componentWillReceiveProps");
    if (!this.props.isOver && nextProps.isOver) {
      // You can use this as enter handler
    }

    if (this.props.isOver && !nextProps.isOver) {
      // You can use this as leave handler
    }

    if (this.props.isOverCurrent && !nextProps.isOverCurrent) {
      // You can be more specific and track enter/leave
      // shallowly, not including nested targets
    }
  }

  render() {
	// Your component receives its own props as usual
	const { reveal, cellAnswer } = this.props;
	// These props are injected by React DnD,
	// as defined by your `collect` function above:
	const { isOver, canDrop, connectDropTarget } = this.props;
	//var classNames = require('classnames');
	//var cellClasses = isOver({ shallow: true }) ? (canDrop() ? classNames("Cell","green") : classNames("Cell","red")) : (canDrop() ? classNames("Cell","yellow") : classNames("Cell"));

	if (this.state.editing){
		var inputElement1 = (<input type="number" length="1" value="" onKeyDown={this.boundHandleOnKeyDown} onBlur={this.boundHandleOnBlur} onFocus={this.boundHandleOnFocus} onInput={this.boundHandleOnInput} ref={this.inputRef}/>); 
		var inputElement2 = (<input type="text" length="1" value="" onKeyDown={this.boundHandleOnKeyDown} onBlur={this.boundHandleOnBlur} onFocus={this.boundHandleOnFocus} onInput={this.boundHandleOnInput} ref={this.inputRef}/>); 
		// eslint-disable-next-line no-console
		console.log("entering edit mode");
		this.inputWasFocused = false;
		this.wasEditing = true;
		var platform = require('platform');
		// eslint-disable-next-line no-console
		console.log("reading platform information");
	
		var browserName = platform.name ? platform.name.toLowerCase() : platform.layout.toLowerCase();

		// Is the end-user using IE on a Desktop or not on a mobile/Mobile device?
		var blnIEDesktop = (browserName.includes("ie") || browserName.includes("trident")) && !browserName.includes("obile");

		return (blnIEDesktop ? inputElement2 : inputElement1);
	} 

	if (this.state.revealNumber) {
		return (<div>{cellAnswer}</div>);
	}
	if (this.wasEditing){
		this.wasEditing = false;
		// eslint-disable-next-line no-console
		console.log("exiting edit mode");
	}
	return connectDropTarget(<button onClick={this.handleClick}>?</button>);
  }
  componentDidUpdate(){
	// eslint-disable-next-line no-console
	console.log("Inside componentDidMount");
	if ((this.state.editing) && (this.inputRef) && (this.inputRef.current)){
		// eslint-disable-next-line no-console
		console.log("about to give input field focus");
		this.inputRef.current.focus();
	}
  }
}

export default DropTarget(Types.DRAGITEM, sudokuSquareTarget, collect)(SudokuCell);
