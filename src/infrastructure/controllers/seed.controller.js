import {SeedService} from "../../core/services/seed.services.js";
import { BaseApiController } from '../../api/BaseApi.js';


export class SeedController extends BaseApiController {


    static async postSeed() {
        return await this.wrapResponse(async () => {
            const seed = await SeedService.createNewSeed()
            return seed;
        })
    }
}
