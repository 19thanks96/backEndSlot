import WebSocket, { WebSocketServer } from 'ws';

import {handleBuySpin, handleGetReel} from '../utils/helper.js';
// const {Prisma: PrismaInstance} = require('../src/api/Prisma.js');
// const {betLevel} = require("../src/utils/helper");
import  {UserController}  from "../infrastructure/controllers/user.controller.js";
import  {ReelsController}  from "../infrastructure/controllers/reels.controller.js";
import  {SeedController}  from "../infrastructure/controllers/seed.controller.js";


export class WebBroker {
    wss;
    prisma

    constructor() {
        if (WebBroker.instance) {
            throw new Error('use WebBroker.getInstance() for connection');
        }
        this.connect()
    }

    static getInstance = () => {
        if (!WebBroker.instance) {
            WebBroker.instance = new WebBroker();
        }
        return WebBroker.instance;
    }

    connect = async () => {

        this.wss = new WebSocketServer({ port: process.env.WEBSOCKET_PORT });

        // this.prisma = PrismaInstance.getInstance();

        this.wss.on('connection', async function connection(ws) {
            console.log('new connection');

            ws.send(JSON.stringify({data: 'handShake'}));

            // Обрабатываем сообщения от клиента
            ws.on('message', async function incoming(message) {
                const parsedMessage = message.toString();

                // Если сообщение в формате JSON, можно его распарсить
                    const data = JSON.parse(parsedMessage);
                    console.log('Получено сообщение:', data);
                    if (data.type === 'identify') {
                        let user;
                        if (data?.message.isNewUser.id) {
                            user = await UserController.getUser(data?.message.isNewUser.id)
                        } else {
                            user = await UserController.postUser()
                        }
                        console.log('identify', user)
                        ws.send(JSON.stringify({ ...user, type: 'identify'}));

                    }
                    if (data.type === 'getReels') {
                        if ( !data?.message?.betLevel) {
                            console.error(
                                'getReels bet is empty', data?.message)
                            return
                        }
                        const handler = await handleGetReel(data)
                        // const handler = await handleGetReel(id, bet)
                        console.log('getReels bet !!!!!', { handler, type: 'reels'})
                        ws.send(JSON.stringify({ ...handler, type: 'reels'}));
                    }
                    if (data.type === 'buySpin') {
                        const  newSpin = await handleBuySpin(data)
                        console.log('buySpin', data, newSpin)
                        ws.send(JSON.stringify({ ...newSpin, type: 'boughtSpin'}));
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

    disconnect = async () => {
        if (this.wss) {
            this.wss.clients.forEach((client) => client.terminate());

            this.wss.close((err) => {
                if (err) {
                    console.error('Ошибка при закрытии WebSocket сервера:', err);
                } else {
                    console.log('WebSocket сервер успешно закрыт.');
                }
            });

            this.wss = null;
        } else {
            console.log('Попытка отключить WebSocket сервер, который уже не активен.');
        }
    };

}
