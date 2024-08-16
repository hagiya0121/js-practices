import sqlite3 from "sqlite3";
import { runPromise, getPromise } from "./db-promise.js";

const db = new sqlite3.Database(":memory:");

// エラーあり
runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => runPromise(db, "INSERT INTO books (title) VALUES (?)", null))
  .catch((err) => {
    console.error(err.message);
    return getPromise(db, "SELECT tittle FROM books WHERE id = ?", 1);
  })
  .catch((err) => {
    console.error(err.message);
    runPromise(db, "DROP TABLE books");
  });
