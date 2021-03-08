const request = require("request");
const Mustache = require("mustache");

const stringify = (object) => {
  const simpleObject = {};
  for (const prop in object) {
    if (!object.hasOwnProperty(prop)) continue;
    if (typeof object[prop] == "object") continue;
    if (typeof object[prop] == "function") continue;
    simpleObject[prop] = object[prop];
  }
  return JSON.stringify(simpleObject);
};

const flatten = (obj, roots = [], sep = "_") =>
  Object.keys(obj).reduce(
    (memo, prop) =>
      Object.assign(
        {},
        memo,
        Object.prototype.toString.call(obj[prop]) === "[object Object]"
          ? flatten(obj[prop], roots.concat([prop]))
          : { [roots.concat([prop]).join(sep)]: obj[prop] }
      ),
    {}
  );

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
      res.send({
        headers,
        res: error ? JSON.parse(stringify(error)) : body,
      });
    }
  );
};
