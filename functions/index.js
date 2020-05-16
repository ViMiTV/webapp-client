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

// from http://guid.us/GUID/JavaScript
const generateRoomCode = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1).toUpperCase();

const createRoom = (maxCapacity, initialPlayerId) =>
    db.collection(ROOMS_COLLECTION).add({
        maxCapacity,
        players: admin.firestore.FieldValue.arrayUnion(initialPlayerId),
        roomCode: generateRoomCode()
    });

const createPlayer = username =>
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

const getRoomCodeById = roomId =>
    db.collection(ROOMS_COLLECTION)
    .doc(roomId)
    .get();

exports.createRoom = functions.https.onRequest((request, response) => {
    try {
        response.set('Access-Control-Allow-Origin', '*');

        const username = request.query.username;
        if (!username) {
            response.send('Missing username!');
        } else {
            return createPlayer(username)
                .then((playerRef) => createRoom(MAX_CAPACITY, playerRef.id))
                .then((roomRef) => {
                    response.send(`created room ${roomRef.id}`);
                    return roomRef.id;
                })
                .catch((e) =>
                    console.log(`create player and room error: ${e}`)
                );
        }
    } catch (e) {
        console.log(`create room error: ${e}`);
    }
});

exports.getRoomCode = functions.https.onRequest((request, response) => {
    try {
        response.set('Access-Control-Allow-Origin', '*');

        const roomId = request.query.roomId;
        if (!roomId) {
            response.send('Missing room id');
        } else {
            return getRoomCodeById(roomId).then(doc => {
                if (!doc.exists) {
                    console.log(`room ${roomId} does not exist`);
                } else {
                    console.log(`entrycode: ${doc.data().entryCode}`);
                    return doc.data().entryCode;
                }
            })
            .catch((e) => console.log(`Get room code by id error: ${e}`));
        }
    } catch (e) {
        response.send(`getRoomCode error: ${e}`);
    }
})
