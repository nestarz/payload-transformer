const request = require("request");

module.exports = (req, res) => {
  const { fwd, key = "payload" } = req.query;
  request.post(
    {
      url: fwd,
      json: { payload: { text: JSON.stringify(req.body[key]) } },
      headers: req.headers,
    },
    (error, response, body) => {
      if (response) res.status(response.statusCode);
      res.send(error);
    }
  );
};
