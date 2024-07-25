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

    if (this.args.l) {
      const memos = await db.list();
      MemoCLI.printTitles(memos);
    } else if (this.args.r) {
      const memos = await db.list();
      MemoCLI.selectMemo(memos);
    } else {
      const memo = await MemoCLI.readStdin();
      db.add(memo);
    }
  }
}
const args = minimist(process.argv.slice(2));
const memoApp = new MemoApp(args);
memoApp.main();
