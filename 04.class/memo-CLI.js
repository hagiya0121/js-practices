import readline from "readline/promises";
import { select } from "@inquirer/prompts";

export default class MemoCLI {
  static async readStdin() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    let lines = [];
    for await (const line of rl) {
      lines.push(line);
    }

    await rl.close();
    return lines.join("\n");
  }

  static printTitles(memos) {
    memos.forEach((memo) => console.log(memo.content.split("\n")[0]));
  }

  static async selectMemo(memos) {
    let memoChoices = [];
    memos.forEach((memo) => {
      memoChoices.push({
        name: memo.content.split("\n")[0],
        value: memo.content,
        description: memo.content,
      });
    });

    const answer = await select({
      message: "Choose a note you want to see:",
      choices: memoChoices,
    });
    console.log(answer);
  }
}
