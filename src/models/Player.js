
import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.models.Player || mongoose.model('Player', PlayerSchema);
