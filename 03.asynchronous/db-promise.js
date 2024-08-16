import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

export function runPromise(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      }
      resolve(this);
    });
  });
}

export function getPromise(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, function (err, row) {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
}
