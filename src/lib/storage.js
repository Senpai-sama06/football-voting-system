
const API_URL = 'https://script.google.com/macros/s/AKfycbzZb1zU_w3xaAJhU3jr0kC4tgod3k8nA-6A6kwjEX3ub2GJLgjtkKs64X1h2l-gGfh_aw/exec';

// Helper for Fetch
async function apiCall(action, data = null) {
    try {
        let url = `${API_URL}?action=${action}`;
        let options = {
            method: 'GET',
        };

        if (data) {
            // Google Apps Script `doPost` requires special handling sometimes (cors)
            // But standard fetch POST works if the script is set to "Anyone"
            options = {
                method: 'POST',
                body: JSON.stringify(data)
            };
            // For doPost, action is still query param in our script logic, or body? 
            // My script checks query param for GET, but usually for POST we just send payload?
            // Actually my script checks e.parameter.action in doPost too.
            // So URL param is fine.
        }

        const res = await fetch(url, options);
        if (!res.ok) throw new Error('Network response was not ok');
        return await res.json();
    } catch (error) {
        console.error(`API Error (${action}):`, error);
        return []; // Return empty array/obj on fail to prevent crash
    }
}

// NOTE: All functions are async now (they were before too for MongoDB, but now they are REAL fetch calls)

export async function getPlayers() {
    return await apiCall('getPlayers');
}

export async function getVotes() {
    return await apiCall('getVotes');
}

export async function getSessionVotes(sessionId) {
    // Optimization: filtering happens on server (Apps Script) if we implemented it, 
    // or we fetch all and filter here. My script implements 'getVotes' with sessionId param.
    // Let's pass it as param.
    // But my generic apiCall only puts action in URL. 
    // Let's update apiCall to handle extra params for GET.

    // Quick fix for specific getVotes with param:
    const url = `${API_URL}?action=getVotes&sessionId=${sessionId}`;
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (e) { return []; }
}

export async function saveVote(vote) {
    // vote = { sessionId, voterId, ratings }
    return await apiCall('saveVote', vote);
}

// GAME MANAGEMENT

export async function getGames() {
    return await apiCall('getGames');
}

export async function getActiveGame() {
    const res = await apiCall('getActiveGame');
    // API returns null or object. Empty list handling in apiCall returns [] which might break "null" check?
    // apiCall returns [] on error. 
    if (Array.isArray(res) && res.length === 0) return null;
    return res;
}

export async function createGame(name) {
    return await apiCall('createGame', { name });
}

export async function updatePlayerStatus(playerId, active) {
    return await apiCall('updatePlayerStatus', { playerId, active });
}
