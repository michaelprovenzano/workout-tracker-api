import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './ExerciseList.styles.scss';

import {
  updateCurrentWorkoutExercises,
  setCurrentWorkoutExercise,
  deleteWorkoutExercise,
} from '../../redux/workoutExercises/workoutExercises.actions';

import Button from '../Button/Button.component';

const ExerciseList = ({
  workoutExercises: { currentWorkoutExercises },
  updateCurrentWorkoutExercises,
  setCurrentWorkoutExercise,
  deleteWorkoutExercise,
}) => {
  const [exercises, setExercises] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setExercises(currentWorkoutExercises);
  }, [currentWorkoutExercises]);

  const handleOnDragEnd = async result => {
    const newExerciseOrder = [...currentWorkoutExercises];
    const [reorderedExercise] = newExerciseOrder.splice(result.source.index, 1);
    newExerciseOrder.splice(result.destination.index, 0, reorderedExercise);
    newExerciseOrder.forEach((exercise, i) => (exercise.exercise_order = i));

    setExercises(newExerciseOrder);
    updateCurrentWorkoutExercises(newExerciseOrder);
  };

  if (!currentWorkoutExercises) return <div>Loading...</div>;

  const editExercise = exercise => {
    setCurrentWorkoutExercise(exercise);
    history.push(`/admin/edit-exercises/${exercise.exercise_id}`);
  };

  const removeExercise = exercise => {
    console.log('removing');
    deleteWorkoutExercise(exercise);
  };

  return (
    <div className='workout-list d-flex'>
      <ul className='workout-list-numbers'>
        {exercises ? exercises.map((workout, i) => <li>{i + 1}</li>) : null}
      </ul>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='workout'>
          {provided => (
            <ul
              className='d-flex flex-column flex-grow-1'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {exercises
                ? exercises.map((exercise, i) => {
                    const id = `${i}-exercise-${exercise.exercise_id}`;
                    return (
                      <Draggable key={id} draggableId={id} index={i}>
                        {provided => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className='d-flex justify-content-between'
                          >
                            <span>{exercise.exercise_name}</span>
                            <span className='d-flex'>
                              <Button
                                type='secondary'
                                text='Edit'
                                onClick={() => editExercise(exercise)}
                              />
                              <Button
                                type='secondary'
                                text='Remove'
                                className='ml-4'
                                onClick={() => removeExercise(exercise)}
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
  updateCurrentWorkoutExercises,
  setCurrentWorkoutExercise,
  deleteWorkoutExercise,
})(ExerciseList);
