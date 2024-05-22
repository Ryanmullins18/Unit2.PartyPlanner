//cohort
const COHORT = "2403-ftb-wt-web-pt";
// API URL
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2403-ftb-wt-web-pt/events`;

/**
 * 👉 STEP 1: Create an object called state that holds an array for recipe objects
 */
const state = {
  events: [],
};

/**
 * 👉 STEP 2: Complete the function so that it:
 *    - uses `fetch` to make a GET request to the API
 *    - turns the response into json
 *    - stores the json of recipes into state
 *    - calls `renderAllRecipes`
 */
const fetchAllEvents = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    state.events = data.data;

    renderAllEvents();
  } catch (error) {
    console.log(error);
  }
};

/**
 * 👉 STEP 3: Complete the function so that it:
 *    - uses `fetch` to make a POST request to the API sending the data passed in the body of the request
 *    - turns the response into json
 *    - calls `fetchAllRecipes`
 *
 * Note: date isn't used in this API but you will need to know how to work with it in the workshop
 */

/**
 * 
 * JS  {
        name, 
        imageUrl: image_url,
        description,
 } -----

 JSON.STRINGIFY 

  --> JSON {
        "name": "whatever name", 
        "imageUrl": "image_url/path",
        "description": "Some good description",
 }
 */
const createNewEvents = async (name, description, location, date) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name, //shorthand when variable is same name as key of object
        description,
        location,
        date
        // date: new Date(date).toISOString()
      }),
    });
    await fetchAllEvents();
  } catch (error) {
    console.log(error);
  }
};

/**
 * 👉 STEP 4: Complete the function so that it:
 *    - uses `fetch` to make a DELETE request to the API to delete a recipe with the id passed to the function
 *    - calls `fetchAllRecipes`
 */
const removeEvent = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    await fetchAllEvents();
  } catch (error) {
    console.log(error);
  }
};
// {
//     id: 1,
//     name: "Event Name",
//     description: "This is a description of the event.",
//     date: "2021-09-30T00:00:00.000Z", // Date ISO string
//     location: "123 Street"
//   }

// render all recipes on the page
const renderAllEvents = () => {
  const eventContainer = document.getElementById("events-container");
  const eventList = state.events;

  if (!eventList || eventList.length === 0) {
    eventContainer.innerHTML = "<h3>No Events found</h3>";
    return;
  }

  //resets html of all recipes
  eventContainer.innerHTML = "";

  //creates a card for each recipe
  eventList.forEach((myEvent) => {
    const eventElement = document.createElement("div");
    eventElement.classList.add("event-card");
    eventElement.innerHTML = `
            <h4>${myEvent.name}</h4>
            <p>${myEvent.description}</p>
            <p>${myEvent.date}</p>
            <p>${myEvent.location}</p>
            <button class="delete-button" data-id="${myEvent.id}">Remove</button>
        `;
    eventContainer.appendChild(eventElement);

    const deleteButton = eventElement.querySelector(".delete-button");
    //add event listener to the delete button so we can delete a recipe
    deleteButton.addEventListener("click", (event) => {
      try {
        event.preventDefault();
        removeEvent(myEvent.id);
      } catch (error) {
        console.log(error);
      }
    });
  });
};

//  adds a listener to our form so when we submit the form we create a new recipe
const addListenerToForm = () => {
  const form = document.querySelector("#new-event-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await createNewEvents(
      form.name.value,
      form.description.value,
      form.date.value,
      form.location.value
      
    );

    //clears the form after we create the new recipe
    form.name.value = "";
    form.description.value = "";
    form.date.value = "";
    form.location.value = "";
  });
};

//initial function when the page loads
const init = async () => {
  //gets all the recipes from the API
  await fetchAllEvents();
  //adds a listener to the form so we can add a recipe when the user submits the form
  addListenerToForm();
};

init();