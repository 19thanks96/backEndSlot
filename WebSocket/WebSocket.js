const WebSocket = require('ws');
const {handleIdentify, handleBuySpin, handleGetReel} = require('../utils/helper.js');
const {Prisma: PrismaInstance} = require('../api/Prisma.js');
const {betLevel} = require("../utils/helper");


class WebBroker {
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

    connect = async () => {

        this.wss = new WebSocket.Server({port: process.env.WEBSOCKET_PORT});
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


                // Если сообщение в формате JSON, можно его распарсить
                try {
                    const data = JSON.parse(parsedMessage);

                    if (data.type === 'identify') {
                        const handleUserLogin = await handleIdentify(data)
                            console.log('handleUserLogin', '');
                        if (handleUserLogin) {
                            ws.send(JSON.stringify({data: handleUserLogin, type: 'identify'}));
                        }
                    }
                    if (data.type === 'buySpin') {
                        console.log('buySpin', data)
                        const id = data.message.id
                        if (!data?.message?.betLevel) {
                            console.error(
                                'getReels bet is empty', data?.message)
                            return
                        }
                        const bet = betLevel[data?.message?.betLevel];
                        const  newSpin = await handleBuySpin(id, bet)
                        ws.send(JSON.stringify({data: newSpin, type: 'boughtSpin'}));
                    }
                    if (data.type === 'getReels') {
                        console.log('getReels message', data.message)
                        const id = data.message.id
                        // if (!data?.message?.bet || !data?.message?.betLevel) {
                        //     console.error(
                        //         'getReels bet is empty', data?.message)
                        //     return
                        // }
                        const bet = data?.message?.bet;
                        const handler = await handleGetReel(id, bet)
                        // console.log('getReels bet !!!!!', {data: handler, type: 'reels'})
                        ws.send(JSON.stringify({data: handler, type: 'reels'}));
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
        console.log(`WebSocket сервер запущен на порту ${process.env.WEBSOCKET_PORT}`);
    }
}

module.exports = {WebBroker};