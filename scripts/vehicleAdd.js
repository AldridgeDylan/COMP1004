// Would usually be placed in a .env file that is ignored by git for security purposes - it is provided here to allow for ease of marking
const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbHR3cnZyamhjY2p3bHlzeHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MzI2MzIsImV4cCI6MjAzMTIwODYzMn0.OswQr77RtcQ3nmXeWsOYa5dhmwpIVB6of_aYqwQ1yIw";
const SUPABASE_URL = "https://iqltwrvrjhccjwlysxyt.supabase.co";

// Keeps track of state for the enter key event listener
let currentState = "add";

// Save the state of the form
let vehicleInformation = {
  rego: "",
  make: "",
  model: "",
  colour: "",
  owner: "",
  ownerID: null,
};

async function add() {
  const rego = document.getElementById("rego").value;
  const make = document.getElementById("make").value;
  const model = document.getElementById("model").value;
  const colour = document.getElementById("colour").value;
  const owner = document.getElementById("owner").value;
  const messageElement = document.getElementById("message");

  // Check for an empty input field
  if (!rego || !make || !model || !colour || !owner) {
    messageElement.style.color = "red";
    messageElement.textContent = "Error: Please complete all input fields";
    return;
  }

  // Update vehicle information with the entered values
  vehicleInformation = {
    rego,
    make,
    model,
    colour,
    owner,
  };

  try {
    // See if the entered owner exists
    const response = await fetchOwner();

    if (response.length === 0) {
      // If the entered owner doesn't exist, a form to create a new owner is created
      await createAddPersonForm();
    } else {
      // If the entered owner does exist, a form to select the correct owner is created
      createSelectPersonForm(response);
    }

    // Disables form elements after new form has been created
    document.getElementById("rego").disabled = true;
    document.getElementById("make").disabled = true;
    document.getElementById("model").disabled = true;
    document.getElementById("colour").disabled = true;
    document.getElementById("owner").disabled = true;
  } catch (e) {
    messageElement.style.color = "red";
    messageElement.textContent = "Error: " + e;
  }
}

// Gets all matching entries from the database
async function fetchOwner() {
  const inputValue = vehicleInformation.owner;
  // ilike makes it so that works with partial names and is case insensitive
  const url = `${SUPABASE_URL}/rest/v1/People?Name=ilike.${encodeURIComponent(
    "%" + inputValue + "%"
  )}`;

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

// Creates the form if there are matching entries in the database
function createSelectPersonForm(owners) {
  const form = document.querySelector(".add-car-form");
  const messageContainer = document.getElementById("message-container");
  const messageElement = document.getElementById("message");

  const ownerSelectDiv = document.createElement("div");
  const ownerSelectLabel = document.createElement("label");

  // Creates a select dropdown for the returned owners
  ownerSelectLabel.textContent = "Select Owner: ";
  const ownerSelect = document.createElement("select");
  owners.forEach((owner) => {
    const option = document.createElement("option");
    option.value = owner.PersonID;
    option.textContent = `${owner.Name}`;
    ownerSelect.appendChild(option);
  });

  if (messageContainer && messageElement) {
    messageContainer.removeChild(messageElement);
    form.removeChild(messageContainer);
  }

  ownerSelectDiv.appendChild(ownerSelectLabel);
  ownerSelectDiv.appendChild(ownerSelect);

  // Creates a button to submit the new form and adds appropriate event listeners
  const addOwnerButton = document.createElement("button");
  addOwnerButton.type = "submit";
  addOwnerButton.textContent = "Select Owner";
  addOwnerButton.addEventListener("click", () => {
    vehicleInformation.ownerID = owner.PersonID;
    createAddVehicleButton();
  });
  currentState = "selectOwner";

  addOwnerButton.style.marginTop = "10px";
  addOwnerButton.style.marginBottom = "10px";

  form.appendChild(ownerSelectDiv);
  form.appendChild(addOwnerButton);
}

// Directly implements the new HTML for the form to add a new person to the database
function createAddPersonForm() {
  const form = document.querySelector(".add-car-form");
  form.innerHTML = `
		<h3>Add a new person</h3>
    <div>
      <label for="personid">Owner ID: </label>
      <input type="text" id="personid" required maxlength="50" />
    </div>
    <div>
      <label for="ownerName">Owner Name: </label>
      <input type="text" id="ownerName" required maxlength="50" />
    </div>
    <div>
      <label for="address">Owner Address: </label>
      <input type="text" id="address" required maxlength="100" />
    </div>
    <div>
      <label for="dob">Date of Birth: </label>
      <input type="date" id="dob" required />
    </div>
    <div>
      <label for="license">License Number: </label>
      <input type="text" id="license" required maxlength="50" />
    </div>
    <div>
      <label for="expire">License Expiry Date: </label>
      <input type="date" id="expire" required />
    </div>
    <div>
      <button type="submit" id="addOwner" name="addOwner">Add Owner</button>
    </div>
  `;

  document.getElementById("addOwner").addEventListener("click", addOwner);
  currentState = "owner";
}

// Creates a new entry in the People database
async function addOwner() {
  const personid = document.getElementById("personid").value.trim();
  const ownerName = document.getElementById("ownerName").value.trim();
  const address = document.getElementById("address").value.trim();
  const dob = document.getElementById("dob").value;
  const license = document.getElementById("license").value.trim();
  const expire = document.getElementById("expire").value;
  const messageElement = document.getElementById("message");

  // Check for an empty input field
  if (!personid || !ownerName || !address || !dob || !license || !expire) {
    messageElement.style.color = "red";
    messageElement.textContent = "Error: All fields are required.";
    return;
  }

  try {
    const { data, error } = await fetch(`${SUPABASE_URL}/rest/v1/People`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLIC_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLIC_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        PersonID: personid,
        Name: ownerName,
        Address: address,
        DOB: dob,
        LicenseNumber: license,
        ExpiryDate: expire,
      }),
    });

    if (error) {
      throw error;
    }

    vehicleInformation.ownerID = personid;
    await createAddVehicleButton();
    messageElement.style.color = "green";
    messageElement.textContent =
      "Owner added successfully. Please add the vehicle now.";
  } catch (error) {
    messageElement.style.color = "red";
    messageElement.textContent = `Error: ${error.message}`;
  }
}

// Creates a new HTML Buttonn element for form submission and adds appropriate event listeners
function createAddVehicleButton() {
  const form = document.querySelector(".add-car-form");
  const addVehicleButton = document.createElement("button");
  addVehicleButton.type = "submit";
  addVehicleButton.textContent = "Add vehicle";
  addVehicleButton.addEventListener("click", () => addVehicle());
  currentState = "vehicle";
  form.appendChild(addVehicleButton);
}

// Creates a new entry in the Vehicle database
async function addVehicle() {
  const { rego, make, model, colour } = vehicleInformation;
  const form = document.querySelector(".add-car-form");
  const messageContainer = document.createElement("div");
  const messageElement = document.createElement("p");
  messageContainer.appendChild(messageElement);
  form.appendChild(messageContainer);

  try {
    const { data, error } = await fetch(`${SUPABASE_URL}/rest/v1/Vehicles`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLIC_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLIC_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        VehicleID: rego,
        Make: make,
        Model: model,
        Colour: colour,
        OwnerID: vehicleInformation.ownerID,
      }),
    });

    if (error) {
      throw error;
    }

    messageElement.style.color = "green";
    messageElement.textContent = "Vehicle added successfully.";
  } catch (error) {
    messageElement.style.color = "red";
    messageElement.textContent = `Error: ${error.message}`;
  }
}

// Adds all required event listeners on page load
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("Submit").addEventListener("click", add);

	// The enter keypress changes which function it executes
	// This is determined by currentState which changes as a user progresses through the form
  document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (currentState === "add") {
        add();
      } else if (currentState === "owner") {
        addOwner();
      } else if (currentState === "selectOwner") {
        createAddVehicleButton();
      } else if (currentState === "vehicle") {
        addVehicle();
      }
    }
  });
});
