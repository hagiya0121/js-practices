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
  const db = new MemoDatabase();
  db.createTable(() => {
    db.add(memo);
  });
});

class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("./db.sqlite");
  }

  createTable(callback) {
    this.db.run("CREATE TABLE IF NOT EXISTS memos (content TEXT)", () => {
      callback();
    });
  }

  add(memo) {
    const statement = this.db.prepare("INSERT INTO memos VALUES (?)");
    statement.run(memo).finalize();
  }
}
