import sqlite3 from "sqlite3";
import { runPromise, getPromise } from "./db-promise.js";

const db = new sqlite3.Database(":memory:");

// エラーなし
runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    runPromise(db, "INSERT INTO books (title) VALUES (?)", "New Record"),
  )
  .then((result) => {
    console.log(result.lastID);
    return getPromise(
      db,
      "SELECT title FROM books WHERE id = ?",
      result.lastID,
    );
  })
  .then((row) => {
    console.log(row.title);
    return runPromise(db, "DROP TABLE books");
  });
