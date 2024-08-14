import { runPromise, getPromise } from "./promisifyDB.js";

// エラーなし
runPromise(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => runPromise("INSERT INTO books (title) VALUES (?)", "New Record"))
  .then((result) => {
    console.log(result.lastID);
    return getPromise("SELECT title FROM books WHERE id = ?", result.lastID);
  })
  .then((row) => {
    console.log(row.title);
    return runPromise("DROP TABLE books");
  })
  // エラーあり
  .then(() =>
    runPromise(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    ),
  )
  .then(() => runPromise("INSERT INTO books (title) VALUES (?)", null))
  .catch((err) => {
    console.error(err.message);
    return getPromise("SELECT tittle FROM books WHERE id = ?", 1);
  })
  .catch((err) => {
    console.error(err.message);
    runPromise("DROP TABLE books");
  });
