// API Endpoints
const eventsAPI = 'http://localhost:3000/api/events';
const signupAPI = 'http://localhost:3000/api/users/register';
const loginAPI = 'http://localhost:3000/api/users/login';

// DOM Elements
const eventList = document.querySelector('.event-list');
const eventModal = document.querySelector('#eventModal');
const createEventBtn = document.querySelector('#createEventBtn');
const signupForm = document.querySelector('#signupForm');
const loginForm = document.querySelector('#loginForm');
const editEventForm = document.querySelector('#editEventForm');
const eventTitleInput = document.querySelector('#eventTitle');
const eventDescriptionInput = document.querySelector('#eventDescription');
const eventIdInput = document.querySelector('#eventId');

// Function to fetch and display events
function fetchEvents() {
    fetch(eventsAPI)
        .then(response => response.json())
        .then(events => {
            eventList.innerHTML = '';
            events.forEach(event => {
                const eventCard = createEventCard(event);
                eventList.appendChild(eventCard);
            });
        });
}

// Function to create an event card
function createEventCard(event) {
    const card = document.createElement('div');
    card.classList.add('card');
    
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = event.title;
    
    const description = document.createElement('p');
    description.classList.add('card-text');
    description.textContent = event.description;
    
    const editBtn = document.createElement('button');
    editBtn.classList.add('btn', 'btn-primary', 'edit-event');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => openEventModal('edit', event));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-danger', 'delete-event');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteEvent(event._id));
    
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(editBtn);
    cardBody.appendChild(deleteBtn);
    card.appendChild(cardBody);
    
    return card;
}

// Function to open the event modal for create or edit
function openEventModal(action, event = null) {
    if (action === 'create') {
        // Clear form fields for creating a new event
        eventTitleInput.value = '';
        eventDescriptionInput.value = '';
        eventIdInput.value = '';
    } else if (action === 'edit' && event) {
        // Fill the form fields for editing an existing event
        eventTitleInput.value = event.title;
        eventDescriptionInput.value = event.description;
        eventIdInput.value = event._id;
    }
    
    eventModal.classList.add('show');
}

// Function to close the event modal
function closeEventModal() {
    eventModal.classList.remove('show');
}

// Event Listeners
createEventBtn.addEventListener('click', () => openEventModal('create'));
eventModal.querySelector('.close').addEventListener('click', closeEventModal);
signupForm.addEventListener('submit', signup);
loginForm.addEventListener('submit', login);
editEventForm.addEventListener('submit', editEvent);

// Function to handle event creation
function createEvent(title, description) {
    const eventData = { title, description };
    fetch(eventsAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
    })
    .then(response => response.json())
    .then(() => {
        fetchEvents();
        closeEventModal();
    });
}

// Function to handle event editing
function editEvent(eventId, title, description) {
    const eventData = { title, description };
    fetch(`${eventsAPI}/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
    })
    .then(response => response.json())
    .then(() => {
        fetchEvents();
        closeEventModal();
    });
}

// Function to handle event deletion
function deleteEvent(eventId) {
    fetch(`${eventsAPI}/${eventId}`, {
        method: 'DELETE'
    })
    .then(() => {
        fetchEvents();
    });
}

// Function to handle user sign-up
function signup(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const userData = { username, email, password };
    fetch(signupAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => response)
    .then(data => {
        // Handle successful sign-up or display errors
        if (data.error) {
            // Handle sign-up error
        } else {
            // Handle successful sign-up
        }
    });
}

// Function to handle user login
function login(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const userData = { email, password };
    fetch(loginAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        // Handle successful login or display errors
        if (data.error) {
            // Handle login error
        } else {
            // Handle successful login
        }
    });
}

// Initialize by fetching and displaying events
fetchEvents();
