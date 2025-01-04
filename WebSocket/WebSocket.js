const WebSocket = require('ws');
const {handleIdentify, handleBuySpin, handleGetReel} = require('../utils/helper.js');
const {Prisma: PrismaInstance} = require('../Prisma/Prisma.js');

// const wss = new WebSocket.Server({port: port});

class WebBroker {
    port;
    wss;
    prisma

    constructor() {
    }

    static getInstance = () => {
        if (!WebBroker.instance) {
            WebBroker.instance = new WebBroker();
        }
        return WebBroker.instance;
    }

    connect = async (port) => {
        this.port = port;
        this.wss = new WebSocket.Server({port: this.port});
        this.prisma = PrismaInstance.getInstance();

        this.wss.on('connection', async function connection(ws) {
            console.log('Новое подключение');

            // Отправляем сообщение клиенту при подключении
            ws.send(JSON.stringify({data: 'handShake'}));

            // ws.on('identify', function incoming(message) {
            //     const parsedMessage = message.toString();
            //
            //     // Если сообщение в формате JSON, можно его распарсить
            //
            //
            //     // Отправляем сообщение обратно клиенту
            //     ws.send(JSON.stringify({data: `Вы сказали: ${message}`}));
            // });

            // Обрабатываем сообщения от клиента
            ws.on('message', async function incoming(message) {
                const parsedMessage = message.toString();
                // checkWin([[0, 1, 2, 3, 0, 1],
                //     [0, 1, 2, 3, 0, 2],
                //     [0, 1, 2, 3, 0, 3],
                //     [0, 1, 2, 3, 0, 0],
                //     [0, 1, 2, 3, 0, 1]], 5, 3)

                // Если сообщение в формате JSON, можно его распарсить
                try {
                    const data = JSON.parse(parsedMessage);

                    if (data.type === 'identify') {
                        const handleUserLogin = await handleIdentify(data)
                            console.log('handleUserLogin', handleUserLogin);
                        if (handleUserLogin) {
                            ws.send(JSON.stringify({data: handleUserLogin, type: 'identify'}));
                        }
                    }
                    if (data.type === 'buySpin') {
                        const handler = await handleBuySpin(data)
                        ws.send(JSON.stringify({data: handler.balance, type: 'buySpin'}));
                        const generatedArray = createNewReelsSymbols(3, 5, 4)
                    }
                    if (data.type === 'getReel') {
                        const handler = await handleGetReel(data)

                    }
                    console.log('Получено сообщение:', data);
                } catch (e) {
                    console.log('Получено сообщение (не JSON):', parsedMessage, message, e);
                }

                // Отправляем сообщение обратно клиенту
                ws.send(JSON.stringify({data: `Вы сказали: ${message}`}));
            });


            // Обрабатываем отключение клиента
            ws.on('close', function () {
                console.log('Клиент отключился');
            });
        });
        console.log(`WebSocket сервер запущен на порту ${this.port}`);
    }
}

module.exports = {WebBroker};