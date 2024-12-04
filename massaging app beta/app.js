let currentUser = null;

// Show Login Form
function showLogin() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('signup-section').style.display = 'none';
}

// Show Sign Up Form
function showSignUp() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('signup-section').style.display = 'block';
}

// Login Function
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user.username;
        localStorage.setItem('currentUser', currentUser);
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-main').style.display = 'block';
        loadFriends();
    } else {
        alert('Invalid username or password');
    }
}

// Sign Up Function
function signUp() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.username === username)) {
        alert('Username already taken!');
    } else {
        users.push({ username, password, friends: [], messages: {} });
        localStorage.setItem('users', JSON.stringify(users));
        login();
    }
}

// Load Friends from Local Storage
function loadFriends() {
    const user = getCurrentUser();
    const userList = document.getElementById('friend-list');
    userList.innerHTML = ''; // Clear existing list

    user.friends.forEach(friend => {
        const li = document.createElement('li');
        li.textContent = friend;
        li.onclick = () => openDM(friend);
        userList.appendChild(li);
    });
}

// Get Current User Data
function getCurrentUser() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.username === currentUser);
}

// Open Direct Message with a Friend
function openDM(friend) {
    const chatWindow = document.getElementById('chat-window');
    const user = getCurrentUser();
    
    if (!user.messages[friend]) {
        user.messages[friend] = [];
    }

    chatWindow.innerHTML = user.messages[friend].map(msg => `<p><strong>${msg.sender}:</strong> ${msg.text}</p>`).join('');
}

// Send Message
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    const chatWindow = document.getElementById('chat-window');

    if (message) {
        const user = getCurrentUser();
        const friend = document.querySelector('#friend-list li.active').textContent;

        if (!user.messages[friend]) {
            user.messages[friend] = [];
        }

        user.messages[friend].push({ sender: user.username, text: message });
        localStorage.setItem('users', JSON.stringify(JSON.parse(localStorage.getItem('users'))));

        chatWindow.innerHTML += `<p><strong>${user.username}:</strong> ${message}</p>`;
        messageInput.value = ''; // Clear input
    }
}

// Block User (Placeholder for now)
function blockUser() {
    alert('User has been blocked!');
}

// Log Out
function logOut() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    document.getElementById('app-main').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

// Add Friend Function
function addFriend() {
    const friendUsername = document.getElementById('friend-username').value.trim();
    
    if (!friendUsername) {
        alert('Please enter a username');
        return;
    }

    const user = getCurrentUser();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the friend exists in the user list
    const friend = users.find(u => u.username === friendUsername);
    if (!friend) {
        alert('Friend not found!');
        return;
    }

    // Check if the user is trying to add themselves as a friend
    if (friend.username === user.username) {
        alert("You can't add yourself as a friend!");
        return;
    }

    // Check if the user is already friends with this person
    if (user.friends.includes(friendUsername)) {
        alert('You are already friends with this user!');
        return;
    }

    // Add the friend to the user's friend list
    user.friends.push(friendUsername);
    localStorage.setItem('users', JSON.stringify(users));

    // Update the friends list in the sidebar
    loadFriends();

    // Clear the input field
    document.getElementById('friend-username').value = '';
}

// Open Settings Panel
function openSettings() {
    document.getElementById('settings').style.display = 'block';
    document.getElementById('app-main').style.display = 'none';
}

// Close Settings Panel
function closeSettings() {
    document.getElementById('settings').style.display = 'none';
    document.getElementById('app-main').style.display = 'block';
}
