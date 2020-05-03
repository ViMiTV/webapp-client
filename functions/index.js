const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://vimi-tv.firebaseio.com',
});

const db = admin.firestore();

const PLAYERS_COLLECTION = 'players';
const ROOMS_COLLECTION = 'rooms';
const MAX_CAPACITY = 6;

exports.helloBobo = functions.https.onRequest((request, response) =>
    response.send('hello bobo :)')
);

const createPlayer = (username) =>
    db.collection(PLAYERS_COLLECTION).add({ username });

const addPlayerToRoom = (player, roomId) => {
    // TODO: check if room is full?
    createPlayer(player)
        .then((ref) => {
            const playerId = ref.id;
            return db
                .collection(ROOMS_COLLECTION)
                .doc(roomId)
                .update({
                    players: admin.firestore.FieldValue.arrayUnion(playerId),
                });
        })
        .then((ref) => console.log(`added ${player} to room ${roomId}`))
        .catch();
};

const createRoom = (maxCapacity, initialPlayerId) =>
    db.collection(ROOMS_COLLECTION).add({
        maxCapacity,
        players: admin.firestore.FieldValue.arrayUnion(initialPlayerId),
    });

exports.createRoom = functions.https.onRequest((request, response) => {
    try {
        const username = request.query.username;
        console.log(request.query.username);
        if (!username) {
            response.send('Missing username!');
        }
        console.log(username);
        return createPlayer(username)
            .then((playerRef) => createRoom(MAX_CAPACITY, playerRef.id))
            .then((roomRef) => response.send(`created room ${roomRef.id}`))
            .catch((e) => console.log(`create player and room ${e}`));
    } catch (e) {
        console.log(`create room error: ${e}`);
    }
});
