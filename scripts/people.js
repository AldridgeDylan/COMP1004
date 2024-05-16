// Would usually be placed in a .env file that is ignored by git for security purposes - it is provided here to allow for ease of marking
const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbHR3cnZyamhjY2p3bHlzeHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MzI2MzIsImV4cCI6MjAzMTIwODYzMn0.OswQr77RtcQ3nmXeWsOYa5dhmwpIVB6of_aYqwQ1yIw";
const SUPABASE_URL = "https://iqltwrvrjhccjwlysxyt.supabase.co";

// Maps the HTML IDs to the database column names
const columnMapping = {
  name: "Name",
  license: "LicenseNumber",
  address: "Address",
  dob: "DOB",
  expiry: "ExpiryDate",
};

async function search() {
  const input = document.getElementById("dynamicInput");
  const messageElement = document.getElementById("message");

  // Checks for an empty input field
  if (input.value.trim() === "") {
    messageElement.style.color = "red";
    messageElement.textContent =
      "Error: Please enter something into the input field";
    return;
  }

  try {
    const response = await fetchData();

    if (response.length === 0) {
      throw new Error("No matching entry found");
    }

    // Puts the returned data into a table which is displayed
    const tableHTML = createTable(response);
    document.getElementById("results-table").innerHTML = tableHTML;

    messageElement.style.color = "green";
    messageElement.textContent = "Search successful";
  } catch (e) {
    messageElement.style.color = "red";
    messageElement.textContent = "Error: Can't find matching entry in Database";
  }
}

// Gets all matching entries from the database
async function fetchData() {
  const input = document.getElementById("dynamicInput");
  const columnName = input.getAttribute("data-column-name");
  const inputValue = input.value;
  
  // ilike makes it so that works with partial names and is case insensitive
  const url = `${SUPABASE_URL}/rest/v1/People?${encodeURIComponent(
    columnName
  )}=ilike.${encodeURIComponent("%" + inputValue + "%")}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: SUPABASE_PUBLIC_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLIC_KEY}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}

function createTable(data) {
  let tableHTML = "<table><thead><tr>";

  // Create table header
  for (const key in data[0]) {
    tableHTML += `<th>${key}</th>`;
  }
  tableHTML += "</tr></thead><tbody>";

  // Create table body
  data.forEach(item => {
    tableHTML += "<tr>";
    for (const key in item) {
      tableHTML += `<td>${item[key]}</td>`;
    }
    tableHTML += "</tr>";
  });

  tableHTML += "</tbody></table>";
  return tableHTML;
}

function toggleInput() {
  const searchTypeSelect = document.getElementById("searchType");
  const selectedOptionValue = searchTypeSelect.value;
  const label = document.getElementById("dynamicLabel");
  const input = document.getElementById("dynamicInput");
  const messageElement = document.getElementById("message");

  // Changes which ID the input is associated with
  label.textContent = `${searchTypeSelect.options[searchTypeSelect.selectedIndex].text.toLowerCase()}:`;
  input.setAttribute("data-column-name", columnMapping[selectedOptionValue]);

  // Clears the input when a different option is selected
  input.value = "";
  messageElement.textContent = "";
}

// Adds all required event listeners on page load
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("Submit").addEventListener("click", search);
  document.getElementById("searchType").addEventListener("change", toggleInput);
  document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      search();
    }
  });
  toggleInput();
});
