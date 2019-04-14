const mongoose = require('mongoose');
const { Schema } = mongoose;

const PartySchema = new Schema({
  code: String,
  hostID: String,
  queue: Array,
  clients: Array
});

mongoose.model('Parties', PartySchema);
