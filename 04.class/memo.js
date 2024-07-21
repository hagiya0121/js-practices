#!/usr/bin/env node

import readline from "readline";
import sqlite3 from "sqlite3";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let lines = [];
rl.on("line", (input) => {
  lines.push(input);
});

rl.on("close", () => {
  const memo = lines.join("\n");
  const storage = new MemosStorage();
  storage.add(memo);
});

class MemosStorage {
  constructor() {
    this.db = new sqlite3.Database("./db.sqlite");
    this.db.run("CREATE TABLE IF NOT EXISTS memos (content TEXT)");
  }

  add(memo) {
    this.db.serialize(() => {
      const statement = this.db.prepare("INSERT INTO memos VALUES (?)");
      statement.run(memo).finalize();
    });
  }
}
