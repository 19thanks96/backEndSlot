const {Prisma: PrismaInstance} = require('../api/Prisma.js');
const reel1 = [0, 1, 2,]
const reel2 = [0, 1, 2,]
const reel3 = [0, 1, 2,]
const reel4 = [0, 1, 2,]
const reel5 = [0, 1, 2, ]
let initialReelsSymbols = [reel1, reel2, reel3, reel4, reel5];
const rows = 5;
const lines = 3
const maxElements = 6
const additionalElements = ['wild', 'bonus',  'freeSpins']

const betLevel= {
    0: 0.25,
    1: 0.5,
    2: 0.75,
    3: 1,
    4: 1.5,
    5: 2,
    6: 2.5,
    7: 4,
    8: 5,
    9: 7,
    10: 10,
    11: 12.5,
    12: 15,
    13: 20,
    14: 25,
    15: 30,
    16: 50,
}


async function handleIdentify(data) {
    if (!data?.message.isNewUser.id) {
        console.log('data?.isNewUser')
        const Prisma =  PrismaInstance.getInstance()
        const user = await Prisma.handleCreateNewUser()
        console.warn('user handleIdentify', user)

        const newSeed = await Prisma.createFirstSeed(user.id);
        console.log("Новая запись Seed:", newSeed);
        return user
    } else {
        console.log('is not new user', data?.message.isNewUser.id)
        const Prisma =  PrismaInstance.getInstance()
        return await Prisma.getUserById(data?.message.isNewUser.id)
    }
}



async function handleGetReel(id, bet) {
    const Prisma =  PrismaInstance.getInstance()
    const user = await Prisma.getUserById(id)
    let reels = await Prisma.findReels(id)
    if (reels) {
        // const reelsElements = createNewReelsSymbols(5, 4, 6)

       // reels = await Prisma.updateReels(id, initialReelsSymbols, bet)
        console.log('reels', reels)
    } else {
        reels = await Prisma.createReels(id, initialReelsSymbols, bet)

        // await Prisma.setBalance(id, user.balance - bet)
    }
    const reelsArray = JSON.parse(reels.allReels)
    const combinations =  checkWinWithWild(reelsArray )
    return {reels, combinations}


}

async function handleBuySpin(id, bet) {
    console.log('handleBuySpin', id, bet)
    const Prisma =  PrismaInstance.getInstance()
    const user = await Prisma.getUserById(id)
    console.log(user.balance , bet)
    if (user.balance - bet > 0) {
        const reelsElements = createNewReelsSymbols(rows, lines, maxElements)
        console.log('reelsElements', reelsElements)
        const reels = await Prisma.updateReels(id, reelsElements, bet)
        if (!reels) {
            return new Error('something went wrong with reels')
        }
        await Prisma.setBalance(id, user.balance - bet)
        const reelsArray = JSON.parse(reels.allReels)
        const combinations =  checkWinWithWild(reelsArray)
        return {reels, combinations}
    } else {
        return false
    }
}


function createNewElement(maxElements) {
    const wildChance = 0.5 + 0.25
    const elementNumber =  Math.round(Math.random() * maxElements + wildChance) ;
     return elementNumber === maxElements  ? 'wild' : elementNumber
}

function chanceToGetBonus(row) {
    const chance = Math.floor(Math.random() * 100)
    if (chance < 15) {
        const position = Math.floor(Math.random() * rows -1)
        // console.log(row[position], position)
        row[position] = 'bonus'
        return  row
    } else {
        return row
    }

}

function createNewReelsSymbols(rows, lines, maxElements) {
    let array = [];

    for (let row = 0; row < rows; row++) {
        let newRow = [];
        for (let col = 0; col < lines; col++) {
            newRow.push(createNewElement(maxElements));
            if (col === lines - 1) {
                // console.log('newRow', newRow)
                newRow = chanceToGetBonus(newRow)
            }
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


function checkWinWithWild(array) {
    const minElementsInLine = 3;
    let rows = array.length;

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
                if (main.name !== 'wild') {
                    if (main.name !== ( array[row][lineOfAllLines[row]] === 'wild' ? main.name : array[row][lineOfAllLines[row]] )) {
                        break
                    } else {
                        main.count += 1;
                    }
                } else {
                    main.name = array[row][lineOfAllLines[row]]
                    main.count += 1;
                }
            }
        }
        if (main.count >= minElementsInLine) {
            main.indexLine = index + 1
            combinations.push({main, line: allLines[index]});
        }
    })
    console.log('array', array)
    console.log('checkWin array', combinations)

    return combinations;
}


// checkWin([[4, 1, 0, ],
//                 [0, 1, 2,],
//                 [0, 2, 2, ],
//                 [0, 1, 2, ],
//                 [5, 1, 0, ]
//                 ])

// const reels = createNewReelsSymbols(rows, lines, maxElements)
// console.log('reels', reels)
// const reels2 = createNewReelsSymbols(rows, lines, maxElements)
// console.log('reels', reels2)

module.exports = {
    betLevel,
    checkWinWithWild,
    createNewReelsSymbols,
    createNewElement,
    handleBuySpin,
    handleIdentify,
    handleGetReel,
}