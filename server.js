const fs = require('fs');
const pg = require('pg');
const url = require('url');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const WebSocket = require('ws');
const port = 8081
// Создаем WebSocket-сервер
const wss = new WebSocket.Server({ port: port });

async function createNewUser() {
    // Create a new user
    const newUser = await prisma.user.create({
        data: {
            // balance: 1000,
            // isAdmin: false,
            // createdAt : new Date(),
            // isVerified: false,
        },
    });
    console.log('Created new user:', newUser);

    // Fetch all users
    const users = await prisma.user.findMany();
    console.log('All users:', users);
}

function handleIdetify(data) {

    if (data?.message.isNewUser) {
        console.log('data?.isNewUser')
        createNewUser()
            .catch(e => {
                throw e;
            })
            .finally(async () => {
                await prisma.$disconnect();
            });
    } else {
        console.log('is not new user')
    }
}



const config = {
    user: "avnadmin",
    password: "AVNS__EZW3xb-Fc-jVYHhN47",
    host: "pg-2c634ed3-thanks96-f8f6.c.aivencloud.com",
    port: 22005,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./ca.pem').toString(),
    },
};

const client = new pg.Client(config);
client.connect(function (err) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err, result) {
        if (err)
            throw err;

        console.log(result.rows[0].version);
        client.end(function (err) {
            if (err)
                throw err;
        });
    });
});



wss.on('connection', function connection(ws) {
    console.log('Новое подключение');

    // Отправляем сообщение клиенту при подключении
    ws.send(JSON.stringify({data:'Привет, клиент!'}));

    ws.on('identify', function incoming(message) {
        const parsedMessage = message.toString();

        // Если сообщение в формате JSON, можно его распарсить


        // Отправляем сообщение обратно клиенту
        ws.send(JSON.stringify({data: `Вы сказали: ${message}`}));
    });

    // Обрабатываем сообщения от клиента
    ws.on('message', function incoming(message) {
        const parsedMessage = message.toString();

        // Если сообщение в формате JSON, можно его распарсить
        try {
            const data = JSON.parse(parsedMessage);

            if (data.type === 'identify') {
                handleIdetify(data)
            }
            console.log('Получено сообщение:', data);
        } catch (e) {
            console.log('Получено сообщение (не JSON):', parsedMessage);
        }

        // Отправляем сообщение обратно клиенту
        ws.send(JSON.stringify({data: `Вы сказали: ${message}`}));
    });



    // Обрабатываем отключение клиента
    ws.on('close', function() {
        console.log('Клиент отключился');
    });
});

console.log(`WebSocket сервер запущен на порту ${port}`);
