import { runPromise, getPromise } from "./promisifyDB.js";

// エラーなし
async function run() {
  await runPromise(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  const result = await runPromise(
    "INSERT INTO books (title) VALUES (?)",
    "New Record",
  );
  console.log(result.lastID);
  const row = await getPromise(
    "SELECT title FROM books WHERE id = ?",
    result.lastID,
  );
  console.log(row.title);
  runPromise("DROP TABLE books");
}
run();

// エラーあり
async function run2() {
  try {
    await runPromise(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
    await runPromise("INSERT INTO books (title) VALUES (?)", null);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT") {
      console.error(err.message);
    }
  }
  try {
    await getPromise("SELECT tittle FROM books WHERE id = ?", 1);
  } catch (err) {
    if (err.code === "SQLITE_ERROR") {
      console.error(err.message);
    }
  }
  runPromise("DROP TABLE books");
}
run2();
