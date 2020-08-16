const db = require('../controllers/databaseController');

const day = [
  {
    name: 'Eccentric Lower',
    exercises: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    program: 'P90X3',
  },
];

const data = [
  {
    exercise: 'Squat',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Lunge',
    has_reps: true,
    has_weight: true,
    is_isometric: true,
  },
  {
    exercise: 'Sumo',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Weighted Pistol',
    has_reps: true,
    has_weight: true,
    is_isometric: true,
  },
  {
    exercise: 'Side Kick',
    has_reps: true,
    has_weight: false,
    is_isometric: true,
  },
  {
    exercise: 'Front Kick',
    has_reps: true,
    has_weight: true,
    is_isometric: true,
  },
  {
    exercise: 'Albanian Squat',
    has_reps: true,
    has_weight: true,
    is_isometric: true,
  },
  {
    exercise: 'Adductor Lunge',
    has_reps: true,
    has_weight: true,
    is_isometric: true,
  },
  {
    exercise: 'Cross Reach',
    has_reps: true,
    has_weight: true,
    is_isometric: true,
  },
  {
    exercise: 'TT Plus',
    has_reps: true,
    has_weight: false,
    is_isometric: true,
  },
  {
    exercise: 'Bridge Kicks',
    has_reps: true,
    has_weight: true,
    is_isometric: true,
  },
  {
    exercise: 'Hip Flexor Splits',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Calf Dog',
    has_reps: true,
    has_weight: false,
    is_isometric: true,
  },
  {
    exercise: 'Standard Push-Ups',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Standard Pull-Ups',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Military Press',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Military Push-Ups',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Chin-Ups',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: "Deep Swimmer's Press",
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Fly Push-Ups',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'V Pull-Ups',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Upright Hammer Pull',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Staggered Push-Ups',
    has_reps: true,
    has_weight: false,
    is_isometric: true,
  },
  {
    exercise: 'Rocket Launcher Row',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Lateral/Anterior Raise',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Plyo Push-Ups',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Vaulter Pull-Ups',
    has_reps: true,
    has_weight: false,
    is_isometric: true,
  },
  {
    exercise: 'Pterodactyl Flys',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Rocket Launcher Kickback',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Flip Flop Combo',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Tricep Skyfers',
    has_reps: true,
    has_weight: false,
    is_isometric: true,
  },
  {
    exercise: 'Kneeling Preacher Curl',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Renegade Row',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Floor Flys',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'A-Press',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Monkey Pump',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Pike Press',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Flipper',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Popeye Hammer Curls',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Hail to the Chief',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Skyfers',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Arm and Hammer',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Push-Up/Side Arm Balance',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Crescent Chair',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Pull Knee Pull',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Flip Flop Crunch',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Crawly Plyo Push-Ups',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Releve-Plie, Weighted',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Chin-Up Circle Crunch',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Boat Plow',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Balance Arch Press',
    has_reps: true,
    has_weight: true,
    is_isometric: true,
  },
  {
    exercise: '3 Hop Press',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Glamour Hammer',
    has_reps: true,
    has_weight: true,
    is_isometric: true,
  },
  {
    exercise: 'Branon Boat',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Flying Warrior',
    has_reps: true,
    has_weight: true,
    is_isometric: true,
  },
  {
    exercise: 'Squat Rockers',
    has_reps: true,
    has_weight: true,
    is_isometric: false,
  },
  {
    exercise: 'Side Rise Punch',
    has_reps: true,
    has_weight: true,
    is_isometric: true,
  },
  {
    exercise: 'Warrior Squat Moon',
    has_reps: true,
    has_weight: false,
    is_isometric: true,
  },
  {
    exercise: 'Wide Pull-Up',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Close Grip Pull-Up',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Wide Push-Up',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Vaulter Pull-Up | Left Hand Forward',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Vaulter Pull-Up | Right Hand Forward',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Staggered Push-Up | Left Hand Forward',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
  {
    exercise: 'Staggered Push-Up | Right Hand Forward',
    has_reps: true,
    has_weight: false,
    is_isometric: false,
  },
];

addDataToTable(data, 'exercises');

function addDataToTable(data, table) {
  db(table)
    .insert(data)
    .then(() => console.log('success'))
    .catch(err => console.log('ERROR', err));
}
