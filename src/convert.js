const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// ★ Excel格納フォルダ
const DIR = "/home/shirahaze/Documents/levtech_auto/excelFile";

// .xlsxファイルを探す
const files = fs.readdirSync(DIR).filter(f => f.endsWith(".xlsx"));

if (files.length === 0) {
  console.error("❌ Excelファイルが見つかりません");
  process.exit(1);
}

if (files.length > 1) {
  console.warn("⚠️ 複数のExcelがあります。先頭を使用:", files[0]);
}

const FILE_PATH = path.join(DIR, files[0]);

console.log("📄 使用ファイル:", FILE_PATH);

// ===== ここから元の処理 =====
const wb = XLSX.readFile(FILE_PATH);
const sheet = wb.Sheets[wb.SheetNames[0]];

const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

function pad(n) {
  return String(n).padStart(2, "0");
}

function isNumber(v) {
  return typeof v === "number" && !isNaN(v);
}

function toTime(h, m) {
  if (!isNumber(h) || !isNumber(m)) return null;
  return `${pad(h)}:${pad(m)}`;
}

function toBreak(h, m) {
  if (!isNumber(h) || !isNumber(m)) return "0:00";
  return `${pad(h)}:${pad(m)}`;
}

const result = {};

rows.forEach(row => {
  if (!row || row.length < 7) return;

  const day = row[1];
  const startH = row[3];
  const startM = row[4];
  const endH = row[5];
  const endM = row[6];
  const restH = row[9];
  const restM = row[10];

  if (!isNumber(day) || !isNumber(startH) || !isNumber(endH)) return;

  const date = new Date((day - 25569) * 86400 * 1000);
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());

  const key = `${mm}/${dd}`;

  result[key] = {
    start: toTime(startH, startM),
    end: toTime(endH, endM),
    break: toBreak(restH, restM)
  };
});

fs.writeFileSync("output.js", "const data = " + JSON.stringify(result, null, 2));

console.log("✅ 完了 件数:", Object.keys(result).length);