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

module.exports = { stringify, flatten };
