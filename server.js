const WebSocket = require('ws');
const port = 80
// Создаем WebSocket-сервер
const wss = new WebSocket.Server({ port: port });

wss.on('connection', function connection(ws) {
    console.log('Новое подключение');

    // Отправляем сообщение клиенту при подключении
    ws.send(JSON.stringify({data:'Привет, клиент!'}));

    // Обрабатываем сообщения от клиента
    ws.on('message', function incoming(message) {
        const parsedMessage = message.toString();

        // Если сообщение в формате JSON, можно его распарсить
        try {
            const data = JSON.parse(parsedMessage);
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
