const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// Middleware
// Parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the public folder
app.use(express.static("public"));

// Database setup
const db = new sqlite3.Database("./db/budget.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    // Create the transactions table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      amount REAL,
      type TEXT
    )`, (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Transactions table is ready.");
      }
    });
  }
});

// Route for adding transactions
app.post("/add-transaction", (req, res) => {
  console.log("Received Data:", req.body);

  const { description, amount, type } = req.body;

  // Convert amount to a float
  const numericAmount = parseFloat(amount);

  // Check for missing or invalid fields
  if (!description || isNaN(numericAmount) || !type) {
    return res.status(400).json({ message: "All fields are required and amount must be a valid number!" });
  }

  const query = `INSERT INTO transactions (description, amount, type) VALUES (?, ?, ?)`;
  db.run(query, [description, numericAmount, type], function (err) {
    if (err) {
      console.error("Error adding transaction:", err.message);
      res.status(500).send("Error adding transaction.");
    } else {
      console.log("Transaction added successfully!");
      res.json({ message: "Transaction added successfully!" });
    }
  });
});



app.get("/transactions", (req, res) => {
  db.all(`SELECT * FROM transactions`, [], (err, rows) => {
    if (err) {
      console.error("Error retrieving transactions:", err.message);
      res.status(500).send("Error retrieving transactions.");
    } else {
      res.json(rows); // Send the transactions as JSON
    }
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
