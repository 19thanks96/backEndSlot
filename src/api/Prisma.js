import { neon } from "@neondatabase/serverless";
import http from "http";
import { PrismaClient } from "@prisma/client";


export class Prisma {
    instance = null; // Экземпляр Prisma
    client = null;
    seed = null;

     constructor() {
        if (Prisma.instance) {
            throw new Error('Используйте Prisma.getInstance() для доступа к экземпляру');
        }

        this.client = new PrismaClient();
        console.log('Новое подключение to prisma');
        const sql = neon(process.env.DATABASE_URL);

        const requestHandler = async (req, res) => {
            const result = await sql`SELECT version()`;
            const {version} = result[0];
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end(version);
        };

        if (!this.serverRunning) {
                const server = http.createServer(requestHandler);

                // Запуск сервера с переключением на доступный порт
                server.listen(process.env.PRISMA_PORT, () => {
                    console.log(`Prisma сервер запущен на порту ${process.env.PRISMA_PORT}`);
                    this.serverRunning = true;
                });

                server.on('error', (error) => {
                    if (error.code === 'EADDRINUSE') {
                        console.error(
                            `Порт ${process.env.PRISMA_PORT} уже используется.`
                        );
                        process.env.PRISMA_PORT = parseInt(process.env.PRISMA_PORT, 10) + 1; // Переход на следующий порт
                        server.listen(process.env.PRISMA_PORT, () => {
                            console.log(`Prisma сервер запущен на новом порту ${process.env.PRISMA_PORT}`);
                        });

                    } else {
                        console.error('Ошибка сервера:', error);
                    }
                });
        }

    }


      static getInstance() {
        if (!Prisma.instance) {
            Prisma.instance = new Prisma();
        }
        return Prisma.instance;
    }

    getSeed = async () => {
        if (!this.seed) {
            this.seed = this.client.Seed.findFirst();
            if(!this.seed) {
                return this.createFirstSeed()
            }
            return this.seed;
        } else {
            return this.seed;
        }
    }

    setNewSeed = async (id, newClientSeed) => {
        const currentSeed = await this.client.seed.findUnique({
            where: { userId: id },
        });

        if (!currentSeed) {
            throw new Error(`Seed с ID ${id} не найден`);
        }

        if (!id) {
           console.error("ID пользователя отсутствует при создании Seed");
           return
        }


        const updatedPreviousSeed = currentSeed.previousSeed
            ? `${currentSeed.previousSeed}, ${newClientSeed}`
            : newClientSeed;

        // Обновляем запись в базе данных
        return await this.client.seed.update({
            where: { id: id },
            data: {
                clientSeed: newClientSeed,
                previousSeeds: updatedPreviousSeed,
                user: {
                    connect: { id }, // Связываем с ID пользователя
                },
            },
        });

    }

    createFirstSeed = async (id) => {
        const newSeed = '123456'
        if(!id) {
            console.error('createFirstSeed isEmpty id ')
            return
        }

        return await this.client.Seed.create({
            data: {
                clientSeed: newSeed,
                previousSeeds: newSeed,
                user: {
                    connect: { id }, // Связываем с ID пользователя
                },
            },
        })
    }


     createNewUser = async () => {
         return this.client.user.create({
            data: {
                balance: 1000,
                isAdmin: false,
                createdAt : new Date(),
                isVerified: false,
            },
        });
    }

    getUserById = async (id) => {
        await this.getSeed(id)
        return  await this.client.user.findFirst(
            {
                where:
                    {id: id}
            },
        )
    }

    setBalance = async (id, balance) => {
        return  await this.client.user.update(
            {where: {id: id}, data: {balance: balance}},
        )
    }

    getReelsById = async (id) => {
        return  await this.client.CurrentReels.findFirst(
            {where: {id: id}},
        )
    }

    walletChangeHandler = async (id, balance) => {
        const user = await this.client.user.update({
            where: {id: id},        // Specify the user by ID
            data: {
                balance: balance,
                updatedAt: new Date(),
            } // Update the balance
        });
    }

     handleCreateNewUser = async () => {
        const user = this.createNewUser()
            .catch(e => {
                console.log(e);
                throw e;
            })
            .finally(async () => {
               console.log('handleCreateNewUser finally');
            })

         return user;
    }

    async findReels(id) {
        return await this.client.CurrentReels.findUnique({
            where: { userId: id },
        });
    }

    async updateReels(id, reels, nonce = 1, newClientSeed = '000000') {
        // await this.setNewSeed(id, newClientSeed);
        return await this.client.CurrentReels.update({
            where: { userId: id },
            data: {
                allReels: JSON.stringify(reels),
                line: 'default',
                nonce: nonce
            },
        });
    }

     async createReels(id, reels, bet) {
         return await this.client.CurrentReels.create({
             data: {
                 user: {
                     connect: { id }, // Связываем с ID пользователя
                 },
                 allReels: JSON.stringify(reels),
                 line: 'default',
             },
         });
     }

    async disconnect() {
        if (this.prisma) {
            console.log('Отключение Prisma...');
            await this.prisma.$disconnect();
            this.prisma = null; // Убираем ссылку после отключения
            this.serverRunning = false; // Сбрасываем серверный флаг
        }
    }

}
