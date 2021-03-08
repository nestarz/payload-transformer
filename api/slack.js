const request = require("request");
const Mustache = require("mustache");
const { stringify, flatten } = require("./utils.js");

module.exports = (req, res) => {
  const { fwd, text } = req.query;
  const headers = Object.fromEntries(
    Object.entries(req.headers).filter(([k]) => k.includes("x-forwarded"))
  );

  request.post(
    {
      url: fwd,
      body: JSON.stringify({
        text: text
          ? Mustache.render(
              text.replace(/\\{/g, "{").replace(/\\}/g, "}"),
              flatten(req.body)
            )
          : JSON.stringify(req.body),
      })
        .replace(/\\\\n/g, "\n")
        .replace(/\\\\r/g, "\r")
        .replace(/\\\\t/g, "\t")
        .replace(/\\\\b/g, "\b"),
      headers,
    },
    (error, response, body) => {
      if (response) res.status(response.statusCode);
      if (error) res.status(500);
      res.send({
        headers,
        res: error ? JSON.parse(stringify(error)) : body,
      });
    }
  );
};
