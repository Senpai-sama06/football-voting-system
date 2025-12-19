
import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
    },
    voterId: {
        type: String,
        required: true,
    },
    ratings: {
        type: Map,
        of: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Vote || mongoose.model('Vote', VoteSchema);
