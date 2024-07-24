#!/usr/bin/env node

import readline from "readline";
import sqlite3 from "sqlite3";
import minimist from "minimist";
import { promisify } from "util";
import { select } from "@inquirer/prompts";

class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("./db.sqlite");
    this.run = promisify(this.db.run.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
    this.prepare = promisify(this.db.prepare.bind(this.db));
  }

  async createTable() {
    await this.run("CREATE TABLE IF NOT EXISTS memos (content TEXT)");
  }

  async add(memo) {
    const statement = this.db.prepare("INSERT INTO memos VALUES (?)");
    await statement.run(memo).finalize();
  }

  async list() {
    return await this.all("SELECT content FROM memos");
  }

  async references() {
    const memos = await this.list();
    let choices = [];
    memos.forEach((memo) => {
      choices.push({
        name: memo.content.split("\n")[0],
        value: memo.content,
        description: memo.content,
      });
    });
    return choices;
  }
}

class MemoApp {
  constructor(args) {
    this.args = args;
  }

  async main() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const db = new MemoDatabase();
    await db.createTable();

    if (this.args.l) {
      const memos = await db.list();
      memos.map((memo) => console.log(memo.content.split("\n")[0]));
      process.exit(0);
    } else if (this.args.r) {
      const choices = await db.references();
      const answer = await select({
        message: "Choose a note you want to see:",
        choices,
      });
      console.log(answer);
    } else {
      let lines = [];
      rl.on("line", (input) => {
        lines.push(input);
      });

      rl.on("close", async () => {
        const memo = lines.join("\n");
        db.add(memo);
      });
    }
  }
}
const options = {
  boolean: ["l", "r"],
};
const args = minimist(process.argv.slice(2), options);
const memoApp = new MemoApp(args);
memoApp.main();
