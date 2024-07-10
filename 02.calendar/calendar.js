#!/usr/bin/env node

import dayjs from "dayjs";
import "dayjs/locale/ja.js";

dayjs.locale("ja");
const today = dayjs();
let date = dayjs("2024-07-01");

console.log(today.format("MMMM YYYY").padStart(13));
console.log("日 月 火 水 木 金 土");

process.stdout.write(" ".repeat(date.day() * 3));
while (date.month() === 6) {
  let day = date.format("D").padStart(2);
  process.stdout.write(day + " ");
  date.day() === 6 && console.log();
  date = date.add(1, "day");
}
console.log("\n");
