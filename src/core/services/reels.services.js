import { ReelsRepository } from "../repositories/reels.repository.js";
import {RedisClient} from "../../api/Redis.js";

export class ReelsService {
    static redis = RedisClient.getInstance();

    static async createNewReel(id, initialReelsSymbols, bet) {
        const reelsSymbols = JSON.stringify(initialReelsSymbols);
        const reel = await ReelsRepository.createReels(id, reelsSymbols, bet);
        this.redis.setData(reel, 'reel')
        return reel;
    }

    static async getReelsById(id) {
        console.log(id, "getReelsById id");
        const reel = await ReelsRepository.getReelsById(id)
        this.redis.setData(reel, 'reel')

        return reel;
    }

    static async setReels(id, reelsSymbols, bet) {
        const newReelsSymbols = JSON.stringify(reelsSymbols);
        const reel = await ReelsRepository.updateReels(id, newReelsSymbols, bet);
        this.redis.setData(reel, 'reel')
        return reel;
    }


}