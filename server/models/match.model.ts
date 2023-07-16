import mongoose from "mongoose";

interface PlayerDataInterface {
    name: string,
    score: number
}

export interface IMatch {
    playerOne: PlayerDataInterface
    playerTwo: PlayerDataInterface
    draw: number
}

export interface MatchInterface {
    playerOne: PlayerDataInterface
    playerTwo: PlayerDataInterface
    draw: number
    createdAt: Date
    updatedAt: Date
}

interface MatchModelInterface extends mongoose.Model<MatchDoc> {
    build(attr: IMatch): MatchDoc
}

interface MatchDoc extends mongoose.Document{
    playerOne: {
        name: string,
        score: number
    }
    playerTwo: {
        name: string,
        score: number
    },
    draw: number
}

const matchSchema = new mongoose.Schema({
    playerOne: {
        type: Object,
        required: true
    },
    playerTwo: {
        type: Object,
        required: true
    },
    draw: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
})

matchSchema.statics.build = (attr: IMatch) => {
    return new Match(attr)
}

const Match = mongoose.model<MatchDoc, MatchModelInterface>('Match', matchSchema)

export { Match }