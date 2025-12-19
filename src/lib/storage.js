import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');
const VOTES_FILE = path.join(DATA_DIR, 'votes.json');
const GAMES_FILE = path.join(DATA_DIR, 'games.json');

// Ensure data directory exists
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        console.log('Creating data directory...');
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

export function getPlayers() {
    ensureDataDir();
    if (!fs.existsSync(PLAYERS_FILE)) {
        // Seed default players if not exists
        const defaultPlayers = [
            { id: '1', name: 'Alex' },
            { id: '2', name: 'Ben' }
        ];
        fs.writeFileSync(PLAYERS_FILE, JSON.stringify(defaultPlayers, null, 2));
        return defaultPlayers;
    }
    const data = fs.readFileSync(PLAYERS_FILE, 'utf8');
    return JSON.parse(data);
}

export function getVotes() {
    ensureDataDir();
    if (!fs.existsSync(VOTES_FILE)) {
        return [];
    }
    const data = fs.readFileSync(VOTES_FILE, 'utf8');
    return JSON.parse(data);
}

export function saveVote(vote) {
    ensureDataDir();
    const votes = getVotes();

    votes.push({
        ...vote,
        timestamp: new Date().toISOString()
    });
    fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2));
    return true;
}

export function getSessionVotes(sessionId) {
    const votes = getVotes();
    return votes.filter(v => v.sessionId === sessionId);
}

// GAME MANAGEMENT

export function getGames() {
    ensureDataDir();
    if (!fs.existsSync(GAMES_FILE)) {
        return [];
    }
    const data = fs.readFileSync(GAMES_FILE, 'utf8');
    return JSON.parse(data);
}

export function getActiveGame() {
    const games = getGames();
    return games.find(g => g.active) || null;
}

export function createGame(name) {
    ensureDataDir();
    const games = getGames();

    // Deactivate others
    const updatedGames = games.map(g => ({ ...g, active: false }));

    // Create new
    const newGame = {
        id: 'game_' + Date.now(),
        name: name || `Game ${updatedGames.length + 1}`,
        date: new Date().toISOString(),
        active: true
    };

    updatedGames.push(newGame);
    fs.writeFileSync(GAMES_FILE, JSON.stringify(updatedGames, null, 2));

    // Reset all players to INACTIVE so admin can select who played
    const players = getPlayers();
    const resetPlayers = players.map(p => ({ ...p, active: false }));
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(resetPlayers, null, 2));

    return newGame;
}
