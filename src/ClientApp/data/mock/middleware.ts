// suppresses all errors that originate on the following line
// @ts-ignore
module.exports = (req, res, next) => {
  if (req.method === 'POST') {
    req.method = 'GET';
  }
  next();
}
