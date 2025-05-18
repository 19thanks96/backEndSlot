import {Prisma}  from '../../api/Prisma.js'

export class ReelsRepository {
    static client = Prisma.getInstance().client;


    static async getReelsById(id) {
        return await this.client.CurrentReels.findFirst({ where: { userId: id } });
    }

    static async createReels(id, initialReelsSymbols, bet) {
        console.warn('createReels', initialReelsSymbols)
        return await this.client.CurrentReels.create({
            data: {
                allReels: initialReelsSymbols,
                createdAt: new Date(),
                line: 'default',
                bet: bet,
                nonce: 0,
                user: {
                    connect: { id: id }, // Связь с существующим пользователем
                },
            },
        });
    }

    static async updateReels(id, newReelsSymbols, bet, nonce = 0, line = 'default', count = 0, bill = 0) {
        return await this.client.CurrentReels.update({
            where: { userId: id },
            data: {
                allReels: newReelsSymbols,
                line,
                bet,
                nonce,
                count,
                bill,
            },
        });

    }
}
