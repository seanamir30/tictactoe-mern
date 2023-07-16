import express, { Request, Response } from "express";
import { Match } from '../models/match.model';

const router = express.Router()

router.get('/matches', async (req: Request, res: Response) => {
    const matches = await Match.find({})
    return res.status(200).send(matches)
})

router.post('/matches', async (req: Request, res: Response) => {
    const { playerOne, playerTwo, draw } = req.body
    const match = Match.build({playerOne, playerTwo, draw})
    await match.save()
    return res.status(201).send(match)
})

export { router as matchController }