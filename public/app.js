// Function to fetch and display transactions
function loadTransactions() {
  fetch("/transactions")
    .then((response) => response.json())
    .then((transactions) => {
      const tableBody = document.querySelector("#transaction-table tbody");
      tableBody.innerHTML = ""; // Clear the table

      transactions.forEach((transaction) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${transaction.description}</td>
          <td>${transaction.amount.toFixed(2)}</td>
          <td>${transaction.type}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error loading transactions:", error);
    });
}

// Handle form submission to add a new transaction
document.getElementById("transaction-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form reload

  const formData = new FormData(e.target);
  const data = {
    description: formData.get("description"),
    amount: parseFloat(formData.get("amount")),
    type: formData.get("type"),
  };

  fetch("/add-transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((message) => {
      alert(message.message); // Show success message
      loadTransactions(); // Reload the table
    })
    .catch((error) => {
      console.error("Error adding transaction:", error);
    });
});

// Load transactions when the page loads
loadTransactions();

