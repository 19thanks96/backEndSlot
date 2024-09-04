const fs = require('fs');
const pg = require('pg');
const url = require('url');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const WebSocket = require('ws');
const port = 8081
const wss = new WebSocket.Server({port: port});

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
    // const users = await prisma.user.findMany();
    // console.log('All users:', users);
    return newUser;
}

async function getUserById(id) {
    const user = await prisma.user.findFirst(
        { where: { id: id } },
    )
}

async function walletChangeHandler(id, balance) {
    const user = await prisma.user.update({
        where: { id: id },        // Specify the user by ID
        data: { balance: balance,
            updatedAt: new Date(),
        } // Update the balance
    });
}

async function handleIdetify(data) {

    if (data?.message.isNewUser) {
        console.log('data?.isNewUser')
        const user = await createNewUser()
            .catch(e => {
                throw e;
            })
            .finally(async () => {
                await prisma.$disconnect();
            });

            console.log(user, 'user');
            return user

    } else {
        console.log('is not new user')
        return false
    }
}

async function handleBuySpin (data) {
    const user = await getUserById(data.id);
    return await walletChangeHandler(data.id, user.balance)

}

function createNewElement(maxElements) {
    return Math.floor(Math.random() * maxElements);
}

function createNewReelsSymbols (rows, lines, maxElements) {
    let array = [];

    for (let row = 0; row < rows; row++) {
        let newRow = [];
        for (let col = 0; col < lines; col++) {
            newRow.push(createNewElement(maxElements));
        }
        array.push(newRow);
    }

    return array;
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

const line1For5Rows = [1, 1, 1, 1, 1];
const line2For5Rows = [0, 0, 0, 0, 0];
const line3For5Rows = [2, 2, 2, 2, 2];
const line4For5Rows = [0, 1, 2, 1, 0];
const line5For5Rows = [2, 1, 0, 1, 2];
const line6For5Rows = [1, 0, 0, 0, 1];
const line7For5Rows = [1, 2, 2, 2, 1];
const line8For5Rows = [0, 0, 1, 2, 2];
const line9For5Rows = [2, 2, 1, 0, 0];
const line10For5Rows= [1, 2, 1, 0, 1];
const line11For5Rows= [1, 0, 1, 2, 1];
const line12For5Rows= [0, 1, 1, 1, 0];
const line13For5Rows= [2, 1, 1, 1, 2];
const line14For5Rows= [0, 1, 0, 1, 0];
const line15For5Rows= [2, 1, 2, 1, 2];
const line16For5Rows= [1, 1, 0, 1, 1];
const line17For5Rows= [1, 1, 2, 1, 1];
const line18For5Rows= [0, 0, 2, 0, 0];
const line19For5Rows= [2, 2, 0, 2, 2];
const line20For5Rows= [0, 2, 2, 2, 0];
const line21For5Rows= [2, 0, 0, 0, 2];
const line22For5Rows= [1, 2, 0, 2, 1];
const line23For5Rows= [1, 0, 2, 2, 1];
const line24For5Rows= [0, 2, 0, 2, 0];
const line25For5Rows= [2, 0, 2, 0, 2];

const allLines = [
    line1For5Rows, line2For5Rows, line3For5Rows, line4For5Rows, line5For5Rows,
    line6For5Rows, line7For5Rows, line8For5Rows, line9For5Rows, line10For5Rows,
    line11For5Rows, line12For5Rows, line13For5Rows, line14For5Rows, line15For5Rows,
    line16For5Rows, line17For5Rows, line18For5Rows, line19For5Rows, line20For5Rows,
    line21For5Rows, line22For5Rows, line23For5Rows, line24For5Rows, line25For5Rows,
];

function checkWin(array, rows, minElementsInLine) {
    let combinations = []

    allLines.forEach((lineOfAllLines, index) => {
        let elements = []
        let main = {
            name: 0,
            count: 0,
        };
        for (let row = 0; row < rows; row++) {
            if (row === 0) {
                main.name = array[row][lineOfAllLines[row]];
                main.count += 1;
            }  else {
                if (main.name !== array[row][lineOfAllLines[row]]) {
                    break
                } else {
                    main.count += 1;
                }
            }
        }
        if(main.count >=  minElementsInLine) {
            main.indexLine = index
            combinations.push(main);
        }
    })
    return combinations;
}

wss.on('connection', async function connection(ws) {
    console.log('Новое подключение');

    // Отправляем сообщение клиенту при подключении
    ws.send(JSON.stringify({data: 'Привет, клиент!'}));

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
        checkWin([[0, 1, 2, 3, 0, 1],
            [0, 1, 2, 3, 0, 2],
            [0, 1, 2, 3, 0, 3],
            [0, 1, 2, 3, 0, 0],
            [0, 1, 2, 3, 0, 1]],  5,  3)

        // Если сообщение в формате JSON, можно его распарсить
        try {
            const data = JSON.parse(parsedMessage);

            if (data.type === 'identify') {
                const handleUserLogin = await handleIdetify(data)
                if (handleUserLogin) {

                ws.send(JSON.stringify({data: await handleIdetify(data), type: 'identify'}));
                }
            }
            if(data.type === 'buySpin') {
                const handler = await handleBuySpin(data)
                ws.send(JSON.stringify({data: handler.balance, type: 'buySpin'}));
                const generatedArray = createNewReelsSymbols(3, 5, 4)
            }
            console.log('Получено сообщение:', data);
        } catch (e) {
            console.log('Получено сообщение (не JSON):', parsedMessage);
        }

        // Отправляем сообщение обратно клиенту
        ws.send(JSON.stringify({data: `Вы сказали: ${message}`}));
    });


    // Обрабатываем отключение клиента
    ws.on('close', function () {
        console.log('Клиент отключился');
    });
});

console.log(`WebSocket сервер запущен на порту ${port}`);
