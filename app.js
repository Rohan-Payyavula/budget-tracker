document.getElementById("transaction-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
  
    // Add to transaction table
    const tableBody = document.querySelector("#transaction-table tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${description}</td>
      <td>${amount.toFixed(2)}</td>
      <td>${type}</td>
    `;
    tableBody.appendChild(row);
  
    // Clear the form
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
  });
  