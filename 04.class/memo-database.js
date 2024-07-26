import sqlite3 from "sqlite3";
import { promisify } from "util";

export default class MemoDatabase {
  constructor(filePath) {
    this.db = new sqlite3.Database(filePath);
    this.run = promisify(this.db.run.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
  }

  async createTable() {
    await this.run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)",
    );
  }

  async add(memo) {
    this.run("INSERT INTO memos (content) VALUES (?)", memo);
  }

  async list() {
    return await this.all("SELECT id, content FROM memos");
  }

  async delete(id) {
    this.run("DELETE FROM memos WHERE id = ?;", id);
  }
}
