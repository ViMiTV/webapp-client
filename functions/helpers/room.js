/**
 * Helper functions and constants for a Room
 */

const ROOMS_COLLECTION = 'rooms';
const MAX_CAPACITY = 6;

// from http://guid.us/GUID/JavaScript
const generateRoomCode = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1).toUpperCase();

const createRoom = (db, maxCapacity, initialPlayerId) =>
    db.collection(ROOMS_COLLECTION).add({
        maxCapacity,
        players: admin.firestore.FieldValue.arrayUnion(initialPlayerId),
        roomCode: generateRoomCode()
    });

module.exports = {
    createRoom,
    MAX_CAPACITY,
    ROOMS_COLLECTION
};