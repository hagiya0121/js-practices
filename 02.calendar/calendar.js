#!/usr/bin/env node

import dayjs from "dayjs";
import "dayjs/locale/ja.js";
import minimist from "minimist";

dayjs.locale("ja");
const today = dayjs();

const args = minimist(process.argv.slice(2), {
  alias: { y: "year", m: "month" },
  default: { y: today.year(), m: today.month() + 1 },
});

let date = dayjs(`${args.year}-${args.month}-01`);

console.log(date.format("MMMM YYYY").padEnd(8).padStart(14));
console.log("日 月 火 水 木 金 土");

process.stdout.write(" ".repeat(date.day() * 3));
while (date.month() === args.month - 1) {
  let day = date.format("D").padStart(2);
  process.stdout.write(day + " ");
  date.day() === 6 && console.log();
  date = date.add(1, "day");
}
console.log("\n");
