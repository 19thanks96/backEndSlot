
const {Prisma: PrismaInstance} = require('../prisma/Prisma.js');
// const {WebSocket : WebSocketInstance} = require('../WebSocket/WebSocket.js');

async function handleIdentify(data) {

    if (!data?.message.isNewUser.id) {
        console.log('data?.isNewUser')
        const Prisma =  PrismaInstance.getInstance()
        return  await Prisma.handleCreateNewUser()

    } else {
        console.log('is not new user', data?.message.isNewUser.id)
        const Prisma =  PrismaInstance.getInstance()
        return await Prisma.getUserById(data?.message.isNewUser.id)
    }
}

async function handleBuySpin(data) {
    const user = await getUserById(data.id);
    return await walletChangeHandler(data.id, user.balance)

}

async function handleGetReel(id, bet) {
    const Prisma =  PrismaInstance.getInstance()
    const user = await Prisma.getUserById(id)
    const reels = await Prisma.getReelsById(id)
    if (user.balance - bet > 0) {
        await Prisma.setBalance(id, user.balance - bet)
        return reels
    }
}

function createNewElement(maxElements) {
    return Math.floor(Math.random() * maxElements);
}

function createNewReelsSymbols(rows, lines, maxElements) {
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



const line1For5Rows = [1, 1, 1, 1, 1];
const line2For5Rows = [0, 0, 0, 0, 0];
const line3For5Rows = [2, 2, 2, 2, 2];
const line4For5Rows = [0, 1, 2, 1, 0];
const line5For5Rows = [2, 1, 0, 1, 2];
const line6For5Rows = [1, 0, 0, 0, 1];
const line7For5Rows = [1, 2, 2, 2, 1];
const line8For5Rows = [0, 0, 1, 2, 2];
const line9For5Rows = [2, 2, 1, 0, 0];
const line10For5Rows = [1, 2, 1, 0, 1];
const line11For5Rows = [1, 0, 1, 2, 1];
const line12For5Rows = [0, 1, 1, 1, 0];
const line13For5Rows = [2, 1, 1, 1, 2];
const line14For5Rows = [0, 1, 0, 1, 0];
const line15For5Rows = [2, 1, 2, 1, 2];
const line16For5Rows = [1, 1, 0, 1, 1];
const line17For5Rows = [1, 1, 2, 1, 1];
const line18For5Rows = [0, 0, 2, 0, 0];
const line19For5Rows = [2, 2, 0, 2, 2];
const line20For5Rows = [0, 2, 2, 2, 0];
const line21For5Rows = [2, 0, 0, 0, 2];
const line22For5Rows = [1, 2, 0, 2, 1];
const line23For5Rows = [1, 0, 2, 2, 1];
const line24For5Rows = [0, 2, 0, 2, 0];
const line25For5Rows = [2, 0, 2, 0, 2];

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
            } else {
                if (main.name !== array[row][lineOfAllLines[row]]) {
                    break
                } else {
                    main.count += 1;
                }
            }
        }
        if (main.count >= minElementsInLine) {
            main.indexLine = index
            combinations.push(main);
        }
    })
    return combinations;
}

module.exports = {
    checkWin,
    createNewReelsSymbols,
    createNewElement,
    handleBuySpin,
    handleIdentify,
    handleGetReel
}