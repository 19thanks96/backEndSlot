const Redis = require('ioredis');

class RedisClient {
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


    disconnect() {
        this.client.disconnect();
        console.log('Соединение с Redis закрыто.');
    }
}

module.exports = RedisClient;