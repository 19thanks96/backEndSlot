import {ReelsService} from "../../core/services/reels.services.js";
import { BaseApiController } from '../../api/BaseApi.js';

export class ReelsController extends BaseApiController {
    static async getReelsById(id) {
        return await this.wrapResponse(async () => {
            const reel = await ReelsService.getReelsById(id);
            return reel;
        });
    }

    static async createReels(id, initialReelsSymbols, bet) {
        return await this.wrapResponse(async () => {
            const newReel = await ReelsService.createNewReel(id, initialReelsSymbols, bet);
            return newReel; // Возврат созданного объекта
        });
    }

    static async updateReels(id, newReelsSymbols, bet) {
        return await this.wrapResponse(async () => {
            const updatedReel = await ReelsService.setReels(id, newReelsSymbols, bet);

            return updatedReel;
        });
    }


}

