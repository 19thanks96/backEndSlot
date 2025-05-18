import {Prisma}  from '../../api/Prisma.js'

export class SeedRepository {
    static client = Prisma.getInstance().client;


    async createFirstSeed(id) {
        const newSeed = '123456';
        if (!id) {
            throw new Error('Не указан пользователь для Seed.');
        }

        return await this.client.Seed.create({
            data: {
                clientSeed: newSeed,
                previousSeeds: newSeed,
                user: { connect: { id } },
            },
        });
    }
}

