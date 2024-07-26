#!/usr/bin/env node

import minimist from "minimist";
import MemoDatabase from "./memo-database.js";
import MemoCLI from "./memo-CLI.js";

class MemoApp {
  constructor(args) {
    this.args = args;
  }

  async main() {
    const db = new MemoDatabase("./db.sqlite");
    await db.createTable();

    const memos = await db.list();
    if (this.args.l) {
      MemoCLI.printTitles(memos);
    } else if (this.args.r) {
      MemoCLI.refer(memos);
    } else if (this.args.d) {
      const answer = await MemoCLI.delete(memos);
      await db.delete(answer);
    } else {
      const memo = await MemoCLI.readStdin();
      db.add(memo);
    }
  }
}
const args = minimist(process.argv.slice(2));
const memoApp = new MemoApp(args);
memoApp.main();
