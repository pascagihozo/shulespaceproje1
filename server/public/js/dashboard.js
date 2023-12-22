$(document).ready(function () {
    fetchUsers();
    fetchEvents();
});

function fetchUsers() {
    // Fetch users from the API
    fetch('http://localhost:3000/api/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(users => {
            displayUsers(users);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
}

function displayUsers(users) {
    const userList = $('#userList');
    userList.empty();

    users.forEach(function (user) {
        const userItem = $('<li>');
        userItem.html(
            '<span class="user-username">' + user.username + '</span>' +
            '<span class="user-email">' + user.email + '</span>'
        );
        userList.append(userItem);
    });
}

function fetchEvents() {
    // Fetch events from the API
    fetch('http://localhost:3000/api/events')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(events => {
            displayEvents(events);
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
}

function displayEvents(events) {
    const eventList = $('#eventList');
    eventList.empty();

    events.forEach(function (event) {
        const eventItem = $('<div class="event-card">');
        eventItem.html(
            '<h3>' + event.title + '</h3>' +
            '<p><strong>Date:</strong> ' + event.date + '</p>' +
            '<p><strong>Location:</strong> ' + event.location + '</p>' +
            '<p><strong>Category:</strong> ' + event.category + '</p>'
        );
        eventList.append(eventItem);
    });
}
