export function runPromise(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      }
      resolve(this);
    });
  });
}

export function getPromise(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, function (err, row) {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
}
