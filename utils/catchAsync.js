//Asynchronous handler if errors(rejected) happen in asynchronous function
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
