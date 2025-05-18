import { SeedRepository } from "../repositories/seed.repository.js";

export class SeedService {
    static async createNewUser() {
        const seed = await SeedRepository.createSeed();
        console.log(seed, "user");
        return seed;
    }

}