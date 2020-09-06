const db = require('../controllers/databaseController');

async function getExercises() {
  let workouts = await db('workouts');
  let data = [];

  for (let i = 0; i < workouts.length; i++) {
    let workout = workouts[i];
    for (let j = 0; j < workout.exercises.length; j++) {
      let exerciseId = workout.exercises[j];

      data.push({
        exercise_id: exerciseId,
        workout_id: workout.workout_id,
        exercise_order: j,
      });
    }
  }

  return data;
}

getExercises().then(response => {
  console.log(response);
  addDataToTable(response, 'workouts_exercises');
});

function addDataToTable(data, table) {
  db(table)
    .insert(data)
    .then(() => console.log('success'))
    .catch(err => console.log('ERROR', err));
}
