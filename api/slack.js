const request = require("request");

function simpleStringify(object) {
  var simpleObject = {};
  for (var prop in object) {
    if (!object.hasOwnProperty(prop)) {
      continue;
    }
    if (typeof object[prop] == "object") {
      continue;
    }
    if (typeof object[prop] == "function") {
      continue;
    }
    simpleObject[prop] = object[prop];
  }
  return JSON.stringify(simpleObject); // returns cleaned up JSON
}

module.exports = (req, res) => {
  const { fwd } = req.query;
  request.post(
    {
      url: fwd,
      json: { payload: { text: JSON.stringify(req.body) } },
      headers: req.headers,
    },
    (error, response, body) => {
      if (response) res.status(response.statusCode);
      res.send({...req.headers, ...simpleStringify(error ? error : body)});
    }
  );
};
