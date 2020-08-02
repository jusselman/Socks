const users = [];

// connect user to chat, add user to array and return it //
function joinUser(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// function gets current user //
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat //
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users //
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    joinUser,
    getCurrentUser,
    userLeave,
    getRoomUsers
};

