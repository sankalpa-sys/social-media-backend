const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    participants: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ], // Array of two user IDs
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);
