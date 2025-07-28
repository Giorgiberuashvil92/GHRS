import xlsx from 'xlsx';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Excel ფაილის წაკითხვა
const workbook = xlsx.readFile('video links - orthopedics-com (1).xlsx');

// პირველი worksheet-ის აღება
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// worksheet-ის JSON-ად გადაყვანა
const jsonData = xlsx.utils.sheet_to_json(worksheet);

// JSON ფაილის შექმნა
writeFileSync(
  join(process.cwd(), 'scripts', 'video-links.json'),
  JSON.stringify(jsonData, null, 2)
);

console.log('Excel ფაილი წარმატებით გადაყვანილია JSON ფორმატში'); 