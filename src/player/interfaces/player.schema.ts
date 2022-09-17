import mongoose from 'mongoose'

export const PlayerSchema = new mongoose.Schema({
    phoneNumber: { type: String },
    email: { type: String, unique: true },
    name: { type: String },
    ranking: { type: String },
    rankingPosition: { type: Number },
    photoUrl: { type: String },
}, { timestamps: true, collection: 'player' })