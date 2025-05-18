import { UserRepository } from "../repositories/user.repository.js";
import {RedisClient} from "../../api/Redis.js";



export class UserService {
    static redis = RedisClient.getInstance();

    static async createNewUser() {
        const user = await UserRepository.createUser();
        this.redis.setData(user, 'user')
        return user;
    }

    static async findUserById(id) {
        const user = await UserRepository.getUserById(id);
        this.redis.setData(user, 'user')
        return user;
    }

    static async findWalletById(id) {
        const balance = await UserRepository.getBalance(id)
        this.redis.setData(user, 'balance')
        return balance;
    }

    static async setWalletMoneyById(id, newBalance) {
        const balance = await UserRepository.setBalance(id, newBalance)
        this.redis.setData(user, 'balance')
        return balance;
    }
}
