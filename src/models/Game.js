
import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.models.Game || mongoose.model('Game', GameSchema);
