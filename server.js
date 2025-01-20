const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database setup
const db = new sqlite3.Database("./db/budget.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create transactions table
db.run(`CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT,
  amount REAL,
  type TEXT
)`);

// Routes
app.post("/add-transaction", (req, res) => {
    const { description, amount, type } = req.body;
    const query = `INSERT INTO transactions (description, amount, type) VALUES (?, ?, ?)`;
  
    db.run(query, [description, amount, type], function (err) {
      if (err) {
        console.error("Error adding transaction:", err.message);
        res.status(500).send("Error adding transaction");
      } else {
        console.log("Transaction added:", { description, amount, type });
        res.redirect("/"); // Redirect to the main page
      }
    });
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
