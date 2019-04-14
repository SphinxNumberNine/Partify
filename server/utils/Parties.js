class Parties {
  constructor() {
    this.parties = [];
  }

  addParty(pin, hostID, live, data) {
    var party = { pin, hostID, live, data };
    this.parties.push(parties);
    return party;
  }

  removeParty(hostID) {
    var party = this.getRoom(hostID);

    if (party) {
      this.parties.filter(party => party.hostID !== hostID);
    }
  }

  getParty(hostID) {
    return this.parties.filter(party => party.hostID === hostID)[0];
  }
}

module.exports = { Parties };
