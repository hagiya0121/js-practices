import sqlite3 from "sqlite3";
import timers from "timers/promises";

const db = new sqlite3.Database(":memory:");

// エラーなし
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

async function run() {
  await db.run_promise(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  const result = await db.run_promise(
    "INSERT INTO books (title) VALUES (?)",
    "New Record",
  );
  console.log(result.lastID);
  const row = await db.get_promise(
    "SELECT title FROM books WHERE id = ?",
    result.lastID,
  );
  console.log(row.title);
  db.run("DROP TABLE books");
}
run();

await timers.setTimeout(100);

// エラーあり
db.run_promise = function (query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      err && reject(err);
      resolve(this);
    });
  });
};

db.get_promise = function (query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, function (err, row) {
      err && reject(err);
      resolve(row);
    });
  });
};

async function run2() {
  try {
    await db.run_promise(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
    await db.run_promise("INSERT INTO books (title) VALUES (?)", null);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT") {
      console.log(err);
    }
  }
  try {
    await db.get_promise("SELECT tittle FROM books WHERE id = ?", 1);
  } catch (err) {
    if (err.code === "SQLITE_ERROR") {
      console.log(err);
    }
  }
  db.run("DROP TABLE books");
}
run2();
