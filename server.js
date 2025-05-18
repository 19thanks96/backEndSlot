import { WebBroker as WebBrokerInstance} from './src/api/WebBroker.js';
import { Prisma as PrismaInstance} from './src/api/Prisma.js';
import { RedisClient} from './src/api/Redis.js';

let redisClient;
let prismaInstance;
let webBroker;

try{
    redisClient = RedisClient.getInstance();
    prismaInstance = PrismaInstance.getInstance();
    webBroker = WebBrokerInstance.getInstance();
} catch (error) {
    console.error(error);
    await cleanupAndExit()
}


process.on('SIGINT', async () => {
    console.log('Событие SIGINT: Завершение работы приложения...');
    await cleanupAndExit(0);
});

process.on('SIGTERM', async () => {
    console.log('Событие SIGTERM: Завершение работы приложения...');
    await cleanupAndExit(0);
});

process.on('uncaughtException', async (error) => {
    console.error('Необработанная ошибка:', error);
    await cleanupAndExit(1);
});

// Функция для очистки ресурсов и завершения
async function cleanupAndExit(exitCode) {
    console.log('Завершение работы... Отключение ресурсов.');

    if (redisClient) {
        redisClient.disconnect();
    }

    if (prismaInstance) {
        await prismaInstance.disconnect();
    }

    if (webBroker ) {
        await webBroker.disconnect();
    }

    console.log('Приложение завершено. Выход.');
    process.exit(exitCode);
}
