import { runPromise, getPromise } from "./promisifyDB.js";

// エラーなし
async function main() {
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
  await runPromise("DROP TABLE books");

  // エラーあり
  try {
    await runPromise(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
    await runPromise("INSERT INTO books (title) VALUES (?)", null);
  } catch (err) {
    if (err?.code === "SQLITE_CONSTRAINT") {
      console.error(err.message);
    } else {
      throw err;
    }
  }
  try {
    await getPromise("SELECT tittle FROM books WHERE id = ?", 1);
  } catch (err) {
    if (err?.code === "SQLITE_ERROR") {
      console.error(err.message);
    } else {
      throw err;
    }
  }
  await runPromise("DROP TABLE books");
}
main();
