const request = require('request');

module.exports = (req, res) => {
  const { fwd } = req.query;
  request.post(
    {
      url: fwd,
      json: { payload: { text: JSON.stringify(req.body) } },
      headers: req.headers,
    },
    (error, response, body) =>
      res.status(response.statusCode).send(error ? error : body)
  );
};
