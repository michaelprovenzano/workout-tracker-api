import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './WorkoutList.styles.scss';

import { updateCurrentWorkouts } from '../../redux/currentWorkouts/currentWorkouts.actions';

import Button from '../Button/Button.component';

const WorkoutList = ({ currentWorkouts, updateCurrentWorkouts }) => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    setWorkouts(currentWorkouts);
  }, [currentWorkouts]);

  const handleOnDragEnd = async result => {
    const newWorkoutOrder = [...currentWorkouts];
    const [reorderedWorkout] = newWorkoutOrder.splice(result.source.index, 1);
    newWorkoutOrder.splice(result.destination.index, 0, reorderedWorkout);
    newWorkoutOrder.forEach((workout, i) => (workout.workout_order = i));

    setWorkouts(newWorkoutOrder);
    updateCurrentWorkouts(newWorkoutOrder);
  };

  if (!currentWorkouts) return <div>Loading...</div>;

  return (
    <div className='workout-list d-flex'>
      <ul className='workout-list-numbers'>
        {workouts ? workouts.map((workout, i) => <li>{i + 1}</li>) : null}
      </ul>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='workout'>
          {provided => (
            <ul
              className='d-flex flex-column flex-grow-1'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
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
                            className='d-flex justify-content-between'
                          >
                            <span>{workout.workout_name}</span>
                            <span className='d-flex'>
                              <Button type='secondary' text='Edit' />
                              <Button type='secondary' text='Delete' className='ml-4 mr-4' />
                            </span>
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

export default connect(mapStateToProps, { updateCurrentWorkouts })(WorkoutList);
