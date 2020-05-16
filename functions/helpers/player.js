/**
 * Helpers and constants for a Player
 */

const PLAYERS_COLLECTION = 'players';

const createPlayer = (username) =>
    db.collection(PLAYERS_COLLECTION).add({ username });

module.exports = {
    createPlayer
};
