function clean(obj) {
  // Remove all null, undefined, empty string, and empty array values from an object
  for (let propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      (Array.isArray(obj[propName]) && obj[propName].length === 0) ||
      (typeof obj[propName] === "string" && obj[propName].trim() === "") ||
      (typeof obj[propName] === "object" &&
        Object.keys(obj[propName]).length === 0)
    ) {
      delete obj[propName];
    } else if (typeof obj[propName] === "object") {
      clean(obj[propName]);
    }
  }
  return obj;
}

module.exports.clean = clean;
