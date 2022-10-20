const request = require("request");
const Mustache = require("mustache");
const { stringify, flatten } = require("./utils.js");

module.exports = (req, res) => {
  const { fwd, text, body, keep_headers = false, ...props } = req.query;

  const ignore = Object.entries(props)
    .filter(([key]) => key.includes("_ncontains"))
    .some(([key1, value1]) =>
      Object.entries(flatten(req.body)).some(
        ([key2, value2]) =>
          String(key1).split("_ncontains")[0] === key2 && value2.includes(value1)
      )
    );


  if (ignore) {
    res.send({ ignore: true });
    res.status(200);
    return;
  }

  const headers = keep_headers ? req.headers : Object.fromEntries(
    Object.entries(req.headers).filter(([k]) => k.includes("x-forwarded") || k.includes("stellate-token"))
  );

  request.post(
    {
      url: fwd,
      body: body ? body : JSON.stringify({
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
