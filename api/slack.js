module.exports = (req, res) => {
  const { webhook_fwd } = req.query;
  req.post(
    {
      url: webhook_fwd,
      json: { payload: { text: JSON.stringify(req.body) } },
      headers: req.headers,
    },
    (error, response, body) =>
      res.status(response.statusCode).send(error ? error : body)
  );
};
