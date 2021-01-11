import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './WorkoutList.styles.scss';

import Button from '../Button/Button.component';
import WorkoutItem from '../WorkoutItem/WorkoutItem.component';
import { setCurrentExercises } from '../../redux/currentExercises/currentExercises.actions';

import {
  setCurrentProgramWorkout,
  updateProgramWorkouts,
  deleteProgramWorkout,
} from '../../redux/programWorkouts/programWorkouts.actions';

const WorkoutList = ({
  programWorkouts: { currentProgramWorkouts },
  updateProgramWorkouts,
  setCurrentProgramWorkout,
  deleteProgramWorkout,
  setCurrentExercises,
}) => {
  const [workouts, setWorkouts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setWorkouts(currentProgramWorkouts);
  }, [currentProgramWorkouts]);

  const handleOnDragEnd = async result => {
    const newWorkoutOrder = [...currentProgramWorkouts];
    const [reorderedWorkout] = newWorkoutOrder.splice(result.source.index, 1);
    newWorkoutOrder.splice(result.destination.index, 0, reorderedWorkout);
    newWorkoutOrder.forEach((workout, i) => (workout.workout_order = i));

    setWorkouts(newWorkoutOrder);
    updateProgramWorkouts(newWorkoutOrder);
  };

  if (!currentProgramWorkouts) return <div>Loading...</div>;

  const editWorkout = workout => {
    setCurrentProgramWorkout(workout);
    setCurrentExercises(workout.workout_id);
    history.push(`/admin/edit-workouts/${workout.workout_id}`);
  };

  const deleteWorkout = workout => {
    deleteProgramWorkout(workout);
  };

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
                              <Button
                                type='secondary'
                                text='Edit'
                                onClick={() => editWorkout(workout)}
                              />
                              <Button
                                type='secondary'
                                text='Remove'
                                className='ml-4'
                                onClick={() => deleteWorkout(workout)}
                              />
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

export default connect(mapStateToProps, {
  updateProgramWorkouts,
  setCurrentProgramWorkout,
  deleteProgramWorkout,
  setCurrentExercises,
})(WorkoutList);
