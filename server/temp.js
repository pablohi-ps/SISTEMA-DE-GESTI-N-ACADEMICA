import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('server/novaedu.db');
db.all('SELECT * FROM modules', [], (err, rows) => {
  if (err) console.error(err);
  console.log("Modules:", rows);
});
db.all('SELECT * FROM users', [], (err, rows) => {
  console.log("Users:", rows);
});
