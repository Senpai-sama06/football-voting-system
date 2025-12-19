
import dbConnect from '@/lib/db';
import Player from '@/models/Player';
import Vote from '@/models/Vote';
import Game from '@/models/Game';

// Ensure DB connection is established for any operation
async function init() {
    await dbConnect();
}

export async function getPlayers() {
    await init();
    try {
        let players = await Player.find({});
        if (players.length === 0) {
            // Seed default players if not exists
            const defaultPlayers = [
                { id: '1', name: 'Alex' },
                { id: '2', name: 'Ben' }
            ];
            await Player.insertMany(defaultPlayers);
            return defaultPlayers;
        }
        // Return plain objects to avoid serialization issues in Next.js props
        return players.map(p => ({
            id: p.id,
            name: p.name,
            active: p.active
        }));
    } catch (error) {
        console.error("Error getting players:", error);
        return [];
    }
}

export async function getVotes() {
    await init();
    try {
        const votes = await Vote.find({});
        return votes.map(v => ({
            sessionId: v.sessionId,
            voterId: v.voterId,
            ratings: v.ratings,
            timestamp: v.timestamp.toISOString()
        }));
    } catch (error) {
        console.error("Error getting votes:", error);
        return [];
    }
}

export async function saveVote(vote) {
    await init();
    try {
        await Vote.create({
            ...vote,
            // timestamp is auto-created by Mongoose default
        });
        return true;
    } catch (error) {
        console.error("Error saving vote:", error);
        return false;
    }
}

export async function getSessionVotes(sessionId) {
    await init();
    try {
        const votes = await Vote.find({ sessionId });
        return votes.map(v => ({
            sessionId: v.sessionId,
            voterId: v.voterId,
            ratings: Object.fromEntries(v.ratings), // Convert Map to Object for simple JSON usage if needed
            timestamp: v.timestamp.toISOString()
        }));
    } catch (error) {
        console.error("Error getting session votes:", error);
        return [];
    }
}

// GAME MANAGEMENT

export async function getGames() {
    await init();
    try {
        const games = await Game.find({});
        return games.map(g => ({
            id: g.id,
            name: g.name,
            date: g.date.toISOString(),
            active: g.active
        }));
    } catch (error) {
        console.error("Error getting games:", error);
        return [];
    }
}

export async function getActiveGame() {
    await init();
    try {
        const game = await Game.findOne({ active: true });
        if (!game) return null;
        return {
            id: game.id,
            name: game.name,
            date: game.date.toISOString(),
            active: game.active
        };
    } catch (error) {
        console.error("Error getting active game:", error);
        return null;
    }
}

export async function createGame(name) {
    await init();
    try {
        // Deactivate others
        await Game.updateMany({}, { active: false });

        // Count for default name
        const count = await Game.countDocuments();

        // Create new
        const newGame = await Game.create({
            id: 'game_' + Date.now(),
            name: name || `Game ${count + 1}`,
            active: true
        });

        // Reset all players to INACTIVE so admin can select who played
        await Player.updateMany({}, { active: false });

        return {
            id: newGame.id,
            name: newGame.name,
            date: newGame.date.toISOString(),
            active: newGame.active
        };
    } catch (error) {
        console.error("Error creating game:", error);
        throw error;
    }
}

export async function updatePlayerStatus(playerId, active) {
    await init();
    try {
        await Player.updateOne({ id: playerId }, { active });
        return true;
    } catch (error) {
        console.error("Error updating player:", error);
        return false;
    }
}
