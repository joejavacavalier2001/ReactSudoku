import React, {Component} from 'react';
import { DragSource } from 'react-dnd';
import { Types } from './SharedDefinitions.jsx';

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
const possibleAnswerSource = {
  canDrag(props) {
    // You can disallow drag based on props
    return true;
  },

  isDragging(props, monitor) {
    // If your component gets unmounted while dragged
    // (like a card in Kanban board dragged between lists)
    // you can implement something like this to keep its
    // appearance dragged: 
    var tempObject = {};
    props.scheduleUpdate(tempObject);
    return monitor.getInitialClientOffset() !== null;
    //return true;
  },

  beginDrag(props, monitor, component) {
    // eslint-disable-next-line no-console
    console.log("inside begindrag");

    // Return the data describing the dragged item
    const item = { pa: props.possibleAnswer };
    return item;
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }
  }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging()
  };
}

class PossibleAnswer extends Component {
  render() {
    // Your component receives its own props as usual
    const { id,possibleAnswer } = this.props;

    // These props are injected by React DnD,
    // as defined by your `collect` function above:
    const { isDragging, connectDragSource } = this.props;

    return connectDragSource(
      <div className="possibleAnswerCSSClass">{possibleAnswer}</div>
    );
  }
}

export default DragSource(Types.DRAGITEM, possibleAnswerSource, collect)(PossibleAnswer);

