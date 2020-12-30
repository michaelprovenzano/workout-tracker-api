import React, { useState } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './WorkoutList.styles.scss';

const WorkoutList = ({ currentWorkouts }) => {
  const [workouts, setWorkouts] = useState(currentWorkouts);

  const handleOnDragEnd = result => {
    const newWorkoutOrder = [...workouts];
    const [reorderedWorkout] = newWorkoutOrder.splice(result.source.index, 1);
    newWorkoutOrder.splice(result.destination.index, 0, reorderedWorkout);

    setWorkouts(newWorkoutOrder);

    // TODO: Update Redux instead
  };

  return (
    <div className='workout-list d-flex'>
      <ul className='workout-list-numbers'>
        {workouts ? workouts.map((workout, i) => <li>{i + 1}</li>) : null}
      </ul>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='workout'>
          {provided => (
            <ul className='d-flex flex-column' {...provided.droppableProps} ref={provided.innerRef}>
              {workouts
                ? workouts.map((workout, i) => {
                    const id = `${i}-workout-${workout.workout_id}`;
                    return (
                      <Draggable key={id} draggableId={id} index={i}>
                        {provided => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {workout.name}
                          </li>
                        )}
                      </Draggable>
                    );
                  })
                : null}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, null)(WorkoutList);
