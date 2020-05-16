// import {createPlayer} from './helpers/player';
// import {ROOMS_COLLECTION, createRoom} from '.helpers/room';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {createRoom, MAX_CAPACITY, ROOMS_COLLECTION} = require('./helpers/room');
const {createPlayer} = require('./helpers/player');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://vimi-tv.firebaseio.com',
});

// const db = admin.firestore();

const addPlayerToRoom = (player, roomId) => {
    // TODO: check if room is full?
    createPlayer(player)
        .then((ref) => {
            const playerId = ref.id;
            return admin.firestore()
                .collection(ROOMS_COLLECTION)
                .doc(roomId)
                .update({
                    players: admin.firestore.FieldValue.arrayUnion(playerId),
                });
        })
        .then((ref) => console.log(`added ${player} to room ${roomId}`))
        .catch();
};

exports.createRoom = functions.https.onRequest((request, response) => {
    try {
        const username = request.query.username;
        if (!username) {
            response.send('Missing username!');
        }
        console.log(username);
        return createPlayer(username)
            .then((playerRef) => createRoom(MAX_CAPACITY, playerRef.id))
            .then((roomRef) => response.send(`created room ${roomRef.id}`))
            .catch((e) => console.log(`create player and room error: ${e}`));
    } catch (e) {
        console.log(`create room error: ${e}`);
    }
});
