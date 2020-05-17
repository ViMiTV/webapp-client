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
    db.collection(PLAYERS_COLLECTION).add({
        username,
        timestamp: new Date().toTimeString()
    });

const getRoomIdByCode = async roomCode => {
    const snapshot = await db
        .collection(ROOMS_COLLECTION)
        .where('roomCode', '==', roomCode)
        .get();

    if (snapshot.empty) {
        console.log('Code is invalid or room does not exist');
    } else {
        return snapshot.docs[0].id;
    }
};

const addPlayerToRoom = (player, roomId) => {
    // TODO: check if room is full (for player-limited games)
    return createPlayer(player).then((ref) => {
        const playerId = ref.id;
        return db
            .collection(ROOMS_COLLECTION)
            .doc(roomId)
            .update({
                players: admin.firestore.FieldValue.arrayUnion(playerId),
            });
    });
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
                .then((roomRef) => response.send({roomId: roomRef.id}))
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
            return getRoomCodeById(roomId)
                .then(doc => {
                    if (!doc.exists) {
                        console.log(`room ${roomId} does not exist`);
                    } else {
                        console.log(`entrycode: ${doc.data().roomCode}`);
                        response.send({roomCode: doc.data().roomCode});
                    }
                    return;
                })
                .catch((e) => console.log(`Get room code by id error: ${e}`));
        }
    } catch (e) {
        response.send(`getRoomCode error: ${e}`);
    }
})

exports.joinRoom = functions.https.onRequest((request, response) => {
    try {
        response.set('Access-Control-Allow-Origin', '*');

        const roomCode = request.query.roomCode;
        const username = request.query.username;
        console.log(roomCode);
        console.log(username);
        

        if (!roomCode || !username) {
            response.send('Missing room code or username');
        } else {
            // const roomId = getRoomIdByCode(roomCode);
            return getRoomIdByCode(roomCode)
                .then((roomId) => addPlayerToRoom(username, roomId))
                .then(() =>
                    response.send(
                        `added user ${username} with room code ${roomCode}`
                    ))
                .catch((e) =>
                    response.send(
                        `add player ${username} to room ${roomId} error: ${e}`
                    )
                );
            // addPlayerToRoom(username, roomId)
            //     .then(() =>
            //         response.send(
            //             `added ${username} with room code ${roomCode}`
            //         )
            //     )
            //     .catch((e) =>
            //         response.send(
            //             `add player ${username} to room ${roomId} error: ${e}`
            //         )
            //     );
        }
    } catch (e) {
        response.send(`unexpected join room error: ${e}`);
    }
})