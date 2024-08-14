import timers from "timers/promises";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

// エラーなし
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title) VALUES (?)", "New Record", function () {
      console.log(this.lastID);
      db.get("SELECT title FROM books WHERE id = ?", this.lastID, (_, row) => {
        console.log(row.title);
        db.run("DROP TABLE books");
      });
    });
  },
);

await timers.setTimeout(100);

// エラーあり
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title) VALUES (?)", null, function (err) {
      console.error(err.message);
      db.get("SELECT content FROM books WHERE id = ?", 2, (err) => {
        console.error(err.message);
        db.run("DROP TABLE books");
      });
    });
  },
);
