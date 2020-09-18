const catchAsync = (fn, msg) => {
  return (req, res, next) => fn(req, res, next).catch(err => next);
};

module.exports = catchAsync;
