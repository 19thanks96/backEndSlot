import  {UserController}  from "../infrastructure/controllers/user.controller.js";
import  {ReelsController}  from "../infrastructure/controllers/reels.controller.js";
import  {SeedController}  from "../infrastructure/controllers/seed.controller.js";
import { reel1, reel2, reel3, reel4, reel5, initialReelsSymbols, rows, lines, maxElements, additionalElements, betLevel, line1For5Rows, line2For5Rows, line3For5Rows, line4For5Rows, line5For5Rows, line6For5Rows, line7For5Rows, line8For5Rows, line9For5Rows, line10For5Rows, line11For5Rows, line12For5Rows, line13For5Rows, line14For5Rows, line15For5Rows, line16For5Rows, line17For5Rows, line18For5Rows, line19For5Rows, line20For5Rows, line21For5Rows, line22For5Rows, line23For5Rows, line24For5Rows, line25For5Rows, allLines } from './initialReelsConfig.js'
import {chanceToGetBonus, checkWinWithWild, createNewElement, createNewReelsSymbols} from "./combinations.js";

export async function handleGetReel(data) {
    const id = data?.message?.id
    const bet = betLevel[data?.message?.betLevel]
    if(!id || !bet) {
        console.error(
            'getReels bet is not full', data?.message)
        return
    }
    const user = await UserController.getUser(id)
    if(!user) {
        console.error(
            'getReels user is not exist', user)
        return
    }
    let reels = await ReelsController.getReelsById(id)
    console.warn('getReels bet ', user, reels)
    if (reels?.success) {
        console.log('reels', reels)
    } else {
        reels = await ReelsController.createReels(id, initialReelsSymbols, bet)
    }
    console.log('reels', reels)
    let reelsArray
    try{
        reelsArray = JSON.parse(reels.data.allReels)
    } catch (e) {
        console.error('getReels reelsArray is not exist', reelsArray)
    }
    const combinations =  checkWinWithWild(reelsArray )
    return {reels, combinations}

}

export async function handleBuySpin(data) {
    const id = data?.message?.id
    const bet = betLevel[data?.message?.betLevel]
    if(!id || !bet) {
        console.error(
            'getReels bet is not full', data?.message)
        return
    }
    let user =  await UserController.getUser(id)
    user = user.data
    console.log(user , bet)
    if (user.balance - bet > 0) {
        const reelsElements = createNewReelsSymbols(rows, lines, maxElements)
        console.log('reelsElements', reelsElements)
        const reels = await ReelsController.updateReels(id, reelsElements, bet)
        console.log('reels updateReels', reels)
        if (!reels) {
            return new Error('something went wrong with reels')
        }
        await UserController.setBalance(id, user.balance - bet)
        const reelsArray = JSON.parse(reels.data.allReels)
        const combinations =  checkWinWithWild(reelsArray)
        return {reels, combinations}
    } else {
        return false
    }
}
