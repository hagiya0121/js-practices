#!/usr/bin/env node

import minimist from "minimist";
import MemoDatabase from "./memo-database.js";
import MemoCLI from "./memo-CLI.js";

class MemoApp {
  constructor(args) {
    this.args = args;
  }

  async run() {
    const db = new MemoDatabase("./db.sqlite");
    await db.createTable();

    const allMemos = await db.list();
    if (this.args.list) {
      MemoCLI.printTitles(allMemos);
    } else if (this.args.refer) {
      MemoCLI.selectMemoToRefer(allMemos);
    } else if (this.args.delete) {
      const memoID = await MemoCLI.selectMemoToDelete(allMemos);
      await db.delete(memoID);
    } else {
      const newMemo = await MemoCLI.readStdin();
      db.add(newMemo);
    }
  }
}

const args = minimist(process.argv.slice(2), {
  alias: {
    l: "list",
    r: "refer",
    d: "delete",
  },
});
const memoApp = new MemoApp(args);
memoApp.run();
