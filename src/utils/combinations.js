import { reel1, reel2, reel3, reel4, reel5, initialReelsSymbols, rows, lines, maxElements, additionalElements, betLevel, line1For5Rows, line2For5Rows, line3For5Rows, line4For5Rows, line5For5Rows, line6For5Rows, line7For5Rows, line8For5Rows, line9For5Rows, line10For5Rows, line11For5Rows, line12For5Rows, line13For5Rows, line14For5Rows, line15For5Rows, line16For5Rows, line17For5Rows, line18For5Rows, line19For5Rows, line20For5Rows, line21For5Rows, line22For5Rows, line23For5Rows, line24For5Rows, line25For5Rows, allLines } from './initialReelsConfig.js'



export function createNewElement(maxElements) {
    const wildChance = 0.5 + 0.25
    const elementNumber =  Math.round(Math.random() * maxElements + wildChance) ;
    return elementNumber === maxElements  ? 'wild' : elementNumber
}

export function chanceToGetBonus(row) {
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

export function createNewReelsSymbols(rows, lines, maxElements) {
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


export function checkWinWithWild(array) {
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

