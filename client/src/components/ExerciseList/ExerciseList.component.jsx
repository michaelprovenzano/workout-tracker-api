import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './ExerciseList.styles.scss';

import { updateCurrentExercises } from '../../redux/currentExercises/currentExercises.actions';

import Button from '../Button/Button.component';
import { setCurrentExercise } from '../../redux/currentExercise/currentExercise.actions';

const ExerciseList = ({ currentExercises, updateCurrentExercises, setCurrentExercise }) => {
  const [exercises, setExercises] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setExercises(currentExercises);
  }, [currentExercises]);

  const handleOnDragEnd = async result => {
    const newExerciseOrder = [...currentExercises];
    const [reorderedWorkout] = newExerciseOrder.splice(result.source.index, 1);
    newExerciseOrder.splice(result.destination.index, 0, reorderedWorkout);
    newExerciseOrder.forEach((exercise, i) => (exercise.exercise_order = i));

    setExercises(newExerciseOrder);
    updateCurrentExercises(newExerciseOrder);
  };

  if (!currentExercises) return <div>Loading...</div>;

  const editExercise = exercise => {
    setCurrentExercise(exercise);
    history.push(`/admin/edit-exercises/${exercise.exercise_id}`);
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
                              <Button type='secondary' text='Remove' className='ml-4' />
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

export default connect(mapStateToProps, { updateCurrentExercises, setCurrentExercise })(
  ExerciseList
);
