const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const customers = [
  'samarth', 'raj', 'amit', 'sagar', 'aditya', 
  'prathmesh', 'sarthak', 'jagjeevan', 'pranav', 'yashraj'
];

db.serialize(() => {
  const stmt = db.prepare(`
    INSERT INTO customers (name, phone, email, address, total_purchases)
    VALUES (?, ?, ?, ?, ?)
  `);

  customers.forEach((name, index) => {
    const phone = `98765432${index.toString().padStart(2, '0')}`;
    const email = `${name}@example.com`;
    const address = 'Unity City, India';
    stmt.run(name.charAt(0).toUpperCase() + name.slice(1), phone, email, address, 0);
  });

  stmt.finalize();
  console.log("Custom specific customers added.");
});

db.close();
