import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

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
