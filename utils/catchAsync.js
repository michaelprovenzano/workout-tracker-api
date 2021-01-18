const catchAsync = (fn, msg) => {
  return (req, res, next) =>
    fn(req, res, next).catch(err => {
      console.log(err);
      res.json({
        status: 'fail',
        data: err,
      });
    });
};

module.exports = catchAsync;
