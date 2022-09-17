import { Document } from "mongoose";
import { Player } from "src/player/interfaces/player.interface";

export interface Category extends Document {
    readonly category: string
    description: string
    events: Array<Event>
    players: Array<Player>
}

export interface Event {
    name: String
    operation: String
    value: Number
}