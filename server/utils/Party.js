class Party {
  constructor() {
    this.users = [];
  }

  addUser(hostID, userID, name, data) {
    var user = { hostID, userID, name, data };
    this.users.push(user);
    return user;
  }

  removeUser(userID) {
    var user = this.getUser(userID);

    if (user) {
      this.users = this.users.filter(user => user.userID !== userID);
    }

    return user;
  }

  getUser(userID) {
    return this.users.filter(user => user.userID === userID)[0];
  }

  getUsers(hostID) {
    return this.users.filter(user => user.hostID === hostID);
  }
}

module.exports = { Party };
