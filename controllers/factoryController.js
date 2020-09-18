const db = require('./databaseController');
const url = require('url');
const catchAsync = require('../utils/catchAsync');

exports.addOne = table => async (req, res) => {
  req.body.user_id = req.user.id;
  const data = await db.returning('*').insert(req.body).into(table);
  return res.status(200).json(data[0]);
};

exports.deleteById = (table, idLabel) =>
  catchAsync(async (req, res) => {
    const { id } = req.params;

    await db(table).where(idLabel, '=', id).del();
    res.status(200).json(null);
  });

exports.getAll = (table, restrictToUser, joins) =>
  catchAsync(async (req, res) => {
    let whereOptions = {};
    if (restrictToUser) whereOptions.user_id = req.user.id;
    let query = db.select('*').from(table).where(whereOptions);

    if (joins) {
      joins.forEach(joinObject => {
        query = query.join(
          joinObject.targetTable,
          `${table}.${joinObject.column}`,
          '=',
          `${joinObject.targetTable}.${joinObject.targetColumn}`
        );
      });
    }

    const queryParams = url.parse(req.url, true).query;
    query = parseQuery(query, queryParams);

    const data = await query;
    res.status(200).json(data);
  });

exports.getById = (table, idLabel, restrictToUser, joins) =>
  catchAsync(async (req, res) => {
    const { id } = req.params;
    let whereOptions = {};
    whereOptions[idLabel] = id;
    if (restrictToUser) whereOptions.user_id = req.user.id;

    let query = db.select('*').from(table).where(whereOptions);

    if (joins) {
      joins.forEach(joinObject => {
        query = query.join(
          joinObject.targetTable,
          `${table}.${joinObject.column}`,
          '=',
          `${joinObject.targetTable}.${joinObject.targetColumn}`
        );
      });
    }

    const data = await query;
    res.status(200).json(data);
  });

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

    // Handle query WHERE
    if (key !== 'orderBy') {
      let operator = '=';
      if (value[0] === '[') {
        operator = value.split(']');
        value = operator[1];
        operator = operator[0].split('[')[1];
        operator = queryOperators[operator];
      }
      query = query.where(key, operator, value);
    }

    // Handle query ORDER BY
    if (key === 'orderBy') {
      let order = 'asc';
      if (value[0] === '[') {
        order = value.split(']');
        value = order[1];
        order = order[0].split('[')[1];
      }
      query = query.orderBy(value, order);
    }
  }
  return query;
};

exports.updateOne = (table, idLabel) =>
  catchAsync(async (req, res) => {
    const { id } = req.params;
    let whereOptions = {};
    whereOptions[idLabel] = id;
    whereOptions.user_id = req.user.id;

    const data = await db
      .returning('*')
      .select('*')
      .from(table)
      .update(req.body)
      .where(whereOptions);

    res.status(200).json(data[0]);
  });

// Admin Functions
exports.adminGetAll = table =>
  catchAsync(async (req, res) => {
    const data = await db.select('*').from(table);
    res.status(200).json(data);
  });

exports.adminUpdateOne = (table, idLabel) =>
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const data = await db
      .returning('*')
      .select('*')
      .from(table)
      .update(req.body)
      .where(idLabel, '=', id);

    res.status(200).json(data[0]);
  });
