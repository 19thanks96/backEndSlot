import {Prisma}  from '../../api/Prisma.js'


export class UserRepository {
    static client = Prisma.getInstance().client;

    static async createUser() {
        if (!this.client) {
            console.log(this.client)
            throw new Error("Prisma client не проинициализирован. Пожалуйста, вызовите UserRepository.init()");
        }


        return await this.client.User.create({
            data: {
                balance: 1000,
                isAdmin: false,
                createdAt: new Date(),
                isVerified: false,
            },
        });
    }

    static async getUserById(id) {
        return await this.client.User.findFirst({ where: { id } });
    }

    static async getBalance(id) {
        return await this.client.User.findFirst({ where: { id } });

    }
    static async setBalance(id, balance) {
        return await this.client.User.update({
            where: { id },
            data: { balance, updatedAt: new Date() },
        });
    }
}

