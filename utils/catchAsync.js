//Asynchronous handler if errors(rejected) happen in asynchronous function
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
