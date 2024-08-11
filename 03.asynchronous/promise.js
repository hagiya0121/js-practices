import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run_promise = function (query, params = []) {
  return new Promise((resolve) => {
    db.run(query, params, function () {
      resolve(this);
    });
  });
};

db.get_promise = function (query, params = []) {
  return new Promise((resolve) => {
    db.get(query, params, function (_, row) {
      resolve(row);
    });
  });
};

db.run_promise(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    return db.run_promise("INSERT INTO books (title) VALUES (?)", "New Record");
  })
  .then((result) => {
    console.log(result.lastID);
    return result;
  })
  .then((result) => {
    return db.get_promise(
      "SELECT title FROM books WHERE id = ?",
      result.lastID,
    );
  })
  .then((row) => {
    console.log(row.title);
    db.run("DROP TABLE books");
  });
