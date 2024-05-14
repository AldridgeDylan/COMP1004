// Would usually be placed in a .env file that is ignored by git for security purposes - it is provided here to allow for ease of marking
const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbHR3cnZyamhjY2p3bHlzeHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MzI2MzIsImV4cCI6MjAzMTIwODYzMn0.OswQr77RtcQ3nmXeWsOYa5dhmwpIVB6of_aYqwQ1yIw";
const SUPABASE_URL = "https://iqltwrvrjhccjwlysxyt.supabase.co";

let currentState = 'add'; 

// Saves the state of the form
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

  // Checks for an empty input field
  if (
    rego.trim() === "" ||
    make.trim() === "" ||
    model.trim() === "" ||
    colour.trim() === "" ||
    owner.trim() === ""
  ) {
    messageElement.style.color = "red";
    messageElement.textContent = "Error: Please complete all input fields";
    return;
  }

  vehicleInformation = {
    rego,
    make,
    model,
    colour,
    owner,
  };

  try {
    const response = await fetchOwner();

    if (response.length === 0) {
      await createAddPersonForm();
      currentState = 'owner'; // Update state to owner
    } else {
      createSelectPersonForm(response);
    }

    // Disable form elements
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

async function fetchOwner() {
  const inputValue = vehicleInformation.owner;
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

function createSelectPersonForm(owners) {
  const form = document.querySelector('.add-car-form');
  const ownerSelectDiv = document.createElement('div');
  const ownerSelectLabel = document.createElement('label');
  ownerSelectLabel.textContent = "Select Owner: ";
  const ownerSelect = document.createElement('select');
  ownerSelect.id = 'ownerSelect';

  owners.forEach(owner => {
    const option = document.createElement('option');
    option.value = owner.PersonID;
    option.textContent = `${owner.Name} - ${owner.LicenseNumber}`;
    ownerSelect.appendChild(option);
  });

  ownerSelectDiv.appendChild(ownerSelectLabel);
  ownerSelectDiv.appendChild(ownerSelect);

  const addOwnerButton = document.createElement('button');
  addOwnerButton.type = 'button';
  addOwnerButton.textContent = 'Select Owner';
  addOwnerButton.addEventListener('click', () => {
    vehicleInformation.ownerID = ownerSelect.value;
    currentState = 'vehicle'; // Update state to vehicle
    createAddVehicleButton();
  });

  form.appendChild(ownerSelectDiv);
  form.appendChild(addOwnerButton);
}

function createAddPersonForm() {
  const form = document.querySelector('.add-car-form');
  form.innerHTML = `
    <h3>Add Owner Information</h3>
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
      <button type="button" id="SubmitOwner" name="SubmitOwner">Add Owner</button>
    </div>
  `;

  document.getElementById('SubmitOwner').addEventListener('click', addOwner);
}

async function addOwner() {
  const personid = document.getElementById("personid").value.trim();
  const ownerName = document.getElementById("ownerName").value.trim();
  const address = document.getElementById("address").value.trim();
  const dob = document.getElementById("dob").value;
  const license = document.getElementById("license").value.trim();
  const expire = document.getElementById("expire").value;
  const messageElement = document.getElementById("message");

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
    currentState = 'vehicle'; // Update state to vehicle
    createAddVehicleButton();
    messageElement.style.color = "green";
    messageElement.textContent = "Owner added successfully. Please add the vehicle now.";
  } catch (error) {
    messageElement.style.color = "red";
    messageElement.textContent = `Error: ${error.message}`;
  }
}

function createAddVehicleButton() {
  const form = document.querySelector('.add-car-form');
  const addVehicleButton = document.createElement('button');
  addVehicleButton.type = 'button';
  addVehicleButton.textContent = 'Add Vehicle';
  addVehicleButton.addEventListener('click', () => addVehicle(vehicleInformation.ownerID));
  form.appendChild(addVehicleButton);
}

async function addVehicle(ownerId) {
  const { rego, make, model, colour } = vehicleInformation;
  const messageElement = document.getElementById("message");

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
        OwnerID: ownerId,
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

  document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (currentState === 'add') {
        add();
      } else if (currentState === 'owner') {
        addOwner();
      } else if (currentState === 'vehicle') {
        addVehicle(vehicleInformation.ownerID);
      }
    }
  });
});
