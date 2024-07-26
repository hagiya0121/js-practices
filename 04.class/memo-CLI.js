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

  static async #generateSelect(memos) {
    let choices = [];
    memos.forEach((memo) => {
      choices.push({
        name: memo.content.split("\n")[0],
        value: memo,
        description: memo.content,
      });
    });
    return choices;
  }

  static async selectMemoToRefer(memos) {
    const choices = await this.#generateSelect(memos);

    const answer = await select({
      message: "Choose a memo you want to see:",
      choices: choices,
    });
    console.log(answer.content);
  }

  static async selectMemoToDelete(memos) {
    const choices = await this.#generateSelect(memos);

    const answer = await select({
      message: "Choose a memo you want to delete:",
      choices: choices,
    });
    return answer.id;
  }
}
