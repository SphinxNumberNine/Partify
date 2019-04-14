const socketIO = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const randomString = require('randomstring');

const { Parties } = require('./utils/Parties');
const { Party } = require('./utils/Party');

const keys = require('./keys');

require('./models/PartyModel');
const PartyModel = mongoose.model('Parties');

mongoose.connect(keys.MONGO_URI, { useNewUrlParser: true });

var party = new Party();
var parties = new Parties();

const port = process.env.PORT || 5000;

const app = express();
const io = socketIO(
  app.listen(port, () => {
    console.log('Connected on port ' + port);
  })
);

io.on('connection', socket => {
  socket.on('host-join', async data => {
    var code = randomString.generate({
      length: 6,
      charset: 'hex'
    });

    var newParty = await new PartyModel({
      code: code,
      hostID: socket.id,
      queue: [],
      clients: []
    })
      .save()
      .catch(err => {
        console.log(err);
      });
    // create room, generate code
    socket.join(code);

    io.to(code).emit('created-party', code); // listen for this client-side
  });

  socket.on('client-join', data => {
    // join existing room based on code
    socket.join(data.code, () => {
      socket['code'] = data.code;
    });

    PartyModel.find({ code: data.code })
      .then(async party => {
        var clients = party[0].clients;
        if (!clients) {
          clients = [];
        }

        clients.push(data.name);

        party[0].clients = clients;
        await party[0].save().catch(err => {
          console.log(err);
        });

        io.to(data.code).emit('user-joined', clients);
      })
      .catch(err => {
        console.log(err);
      });
  });

  socket.on('check-valid-join', data => {
    var code = data.code;

    PartyModel.find({ code: code })
      .then(async party => {
        if (party.length > 0) {
          socket.emit('valid-join', 'VALID');
        } else {
          socket.emit('invalid-join', 'INVALID');
        }
      })
      .catch(err => {
        socket.emit('invalid-join', 'INVALID');
      });
  });

  socket.on('new-song', data => {
    // take new song from data and add it to queue in mongoDB, then emit queue-changed event
    var code = data.code;

    PartyModel.find({ code: code })
      .then(async party => {
        if (!party[0].queue) {
          party[0].queue = [];
        }

        party[0].queue.push(data.playbackURI);
        await party[0].save().catch(err => {
          console.log(err);
        });

        io.emit('queue-changed', {
          queue: party[0].queue,
          code: code
        });
      })
      .catch(err => {
        console.log(err);
      });
  });

  socket.on('host-changed-queue', data => {
    var code = data.code;
    var queue = data.queue;

    PartyModel.find({ code: code })
      .then(async party => {
        party[0].queue = queue;
        await party[0].save().catch(err => {
          console.log(err);
        });

        io.emit('queue-changed', {
          queue: queue,
          currentTrack: data.currentTrack,
          code: code
        });
      })
      .catch(err => {
        console.log(err);
      });
  });

  socket.on('next-button-pressed', data => {
    var code = data.code;
    var queue = data.queue;
    var track = data.track;

    PartyModel.find({ code: code }).then(async party => {
      party[0].queue = queue;
      await party[0].save().catch(err => {
        console.log(err);
      });

      io.emit('retrieve-from-next-pressed', {
        queue: queue,
        code: code,
        track: track
      });
    });
  });
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});
