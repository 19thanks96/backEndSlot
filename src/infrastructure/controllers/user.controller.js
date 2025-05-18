import {UserService} from "../../core/services/user.services.js";
import { BaseApiController } from '../../api/BaseApi.js';


export class UserController extends BaseApiController {


    static async postUser() {
        return await this.wrapResponse(async () => {
            const user = await UserService.createNewUser()
            return user;
        })
    }

    static async getUser(id) {
        return await this.wrapResponse(async () => {
            const user = await UserService.findUserById(id)
            //getUserById(data?.message.isNewUser.id)
            return user;
        })
    }

    static async getBalance(id) {
        return await this.wrapResponse(async () => {
            const balance = await UserService.findWalletById(id)
            return balance;
        })
    }

    static async setBalance(id, newBalance) {
        return await this.wrapResponse(async () => {
            const balance = await UserService.setWalletMoneyById(id, newBalance)

            return balance;
        })
    }


}

