import sqlite3 from "sqlite3";
import { promisify } from "util";

export default class MemoDatabase {
  constructor(file_path) {
    this.db = new sqlite3.Database(file_path);
    this.run = promisify(this.db.run.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
    this.prepare = promisify(this.db.prepare.bind(this.db));
  }

  async createTable() {
    await this.run("CREATE TABLE IF NOT EXISTS memos (content TEXT)");
  }

  async add(memo) {
    const statement = await this.db.prepare("INSERT INTO memos VALUES (?)");
    await statement.run(memo).finalize();
  }

  async list() {
    return await this.all("SELECT content FROM memos");
  }
}
