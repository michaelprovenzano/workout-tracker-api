const catchAsync = (fn, msg) => {
  return (req, res, next) => fn(req, res, next).catch(err => res.json(err));
};

module.exports = catchAsync;
