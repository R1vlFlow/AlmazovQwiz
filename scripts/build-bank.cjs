const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const bank=JSON.parse(fs.readFileSync(path.join(root,'data/bank.json'),'utf8'));
fs.writeFileSync(path.join(root,'data/bank.js'),'// Generated from bank.json by scripts/build-bank.cjs.\nconst AQ_BANK='+JSON.stringify(bank)+';\n');
