const db = require('./databaseController');
const url = require('url');

exports.addOne = table => async (req, res) => {
  const data = await db.returning('*').insert(req.body).into(table);
  return res.status(200).json(data);
};

exports.deleteById = table => async (req, res) => {
  const { id } = req.params;

  await db(table).where('id', '=', id).del();
  res.status(200).json(null);
};

exports.getAll = table => async (req, res) => {
  let query = db.select('*').from(table).where('user_id', '=', req.user.id);

  const queryParams = url.parse(req.url, true).query;
  query = parseQuery(query, queryParams);

  const data = await query;
  res.status(200).json(data);
};

exports.getById = (table, restrictToUser) => async (req, res) => {
  const { id } = req.params;
  let whereOptions = {
    id: id,
  };
  if (restrictToUser) whereOptions.user_id = req.user.id;

  const data = await db.select('*').from(table).where(whereOptions);
  res.status(200).json(data);
};

const parseQuery = (query, queryObject) => {
  let queryKeys = Object.keys(queryObject);
  const queryOperators = {
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
  };

  for (let key of queryKeys) {
    let value = queryObject[key];
    let operator = '=';
    if (value[0] === '[') {
      operator = value.split(']');
      value = operator[1];
      operator = operator[0].split('[')[1];
      operator = queryOperators[operator];
    }
    query = query.where(key, operator, value);
  }
  return query;
};

exports.updateOne = table => async (req, res) => {
  const { id } = req.params;

  const data = await db
    .returning('*')
    .select('*')
    .from(table)
    .update(req.body)
    .where({ id: id, user_id: req.user.id });

  res.status(200).json(data[0]);
};

// Admin Functions
exports.adminGetAll = table => async (req, res) => {
  const data = await db.select('*').from(table);
  res.status(200).json(data);
};

exports.adminUpdateOne = table => async (req, res) => {
  const { id } = req.params;

  const data = await db
    .returning('*')
    .select('*')
    .from(table)
    .update(req.body)
    .where('id', '=', id);

  res.status(200).json(data[0]);
};
