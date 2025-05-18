import  Redis  from 'ioredis';

export class RedisClient {
    static instance;
    client;

    constructor() {
        if (RedisClient.instance) {
            throw new Error('Используйте RedisClient.getInstance() для доступа к экземпляру');
        }

        // Создаем клиента Redis
        this.client = new Redis({
            host:process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        });

        this.client.on('connect', () => {
            console.log(`Redis сервер запущен на порту ${process.env.REDIS_PORT}`);
        });

        this.client.on('error', (err) => {
            console.error('Ошибка подключения к Redis:', err);
        });

        RedisClient.instance = this;
    }


    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }


    setData(data, prefix) {
        if (!!data) {
            if( typeof data === "object" && !Array.isArray(data)) {
                Object.keys(data).forEach((key) => {
                    this.client.set(`${prefix}-${key}`, JSON.stringify(data[key]));
                });
            } else {
                this.client.set(prefix, JSON.stringify(data));
            }
        } else {
            console.log(`${prefix} is empty or invalid, see:`, data)
        }
    }

    setUserBalance(balance) {
        if (!!balance) {
                this.client.set(`user-balance`, JSON.stringify(balance));
        } else {
            console.log('balance is empty, see:', balance)
        }
    }


    disconnect() {
        this.client.disconnect();
        console.log('Соединение с Redis закрыто.');
    }
}

