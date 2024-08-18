import sqlite3 from "sqlite3";
import { runPromise, getPromise } from "./db-promise.js";

const db = new sqlite3.Database(":memory:");

// エラーなし
await runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
const result = await runPromise(
  db,
  "INSERT INTO books (title) VALUES (?)",
  "New Record",
);
console.log(result.lastID);
const row = await getPromise(
  db,
  "SELECT title FROM books WHERE id = ?",
  result.lastID,
);
console.log(row.title);
await runPromise(db, "DROP TABLE books");

// エラーあり
await runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
try {
  await runPromise(db, "INSERT INTO books (title) VALUES (?)", null);
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
    console.error(err.message);
  } else {
    throw err;
  }
}
try {
  await getPromise(db, "SELECT tittle FROM books WHERE id = ?", 1);
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}
await runPromise(db, "DROP TABLE books");
