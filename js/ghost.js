'use strict'

const GHOST = '&#9781;'


var gGhosts = []
var gIntervalGhosts, ghostAfraidp
var gNextId = 0

function createGhost(board) {
    const ghost = {
        id: gNextId++,
        location: {
            i: 3,
            j: 3
        },
        jailLocation: {
            i: gNextId,
            j: 1
        },
        currCellContent: FOOD,
        color: getRandomColor(),
        class: 'ghost',
        isEaten: false
    }
    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST
}

function createGhosts(board) {
    gGhosts = []
    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    if (ghost['isEaten']) return

    const moveDiff = getMoveDiff();
    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell === WALL) return
    if (nextCell === GHOST) return
    if (nextCell === POWER) return
    if (nextCell === PACMAN) {
        if (gPacman['isSuper']) {
            ghostEaten(ghost)
            return
        }
        else {
            gameOver()
            return
        }
    }

    // model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent

    // DOM
    renderCell(ghost.location, ghost.currCellContent)

    // model
        ghost.location = nextLocation
        ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j]
        gBoard[ghost.location.i][ghost.location.j] = GHOST

    // DOM
    renderCell(ghost.location, getGhostHTML(ghost))
}

function ghostEaten(ghost) {
    ghost.isEaten = true

    setTimeout(() => { ghostRevive(ghost) }, 5000)

    gJailBoard[ghost.id][ghost.id] = GHOST
    renderCell(ghost.jailLocation, getGhostHTML(ghost), '.jail-container')
    renderCell(ghost.location, ghost.currCellContent)
}

function ghostRevive(ghost) {
    ghost.isEaten = false

    gJailBoard[ghost.id][ghost.id] = EMPTY
    ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j]
    renderCell(ghost.jailLocation, EMPTY, '.jail-container')
    renderCell(ghost.location, ghost.currCellContent)
}

function getMoveDiff() {
    const randNum = getRandomIntInt(0, 100);
    if (randNum < 25) {
        return { i: 0, j: 1 }
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    let style = (gPacman['isSuper']) ? `color: grey` : `color: ${ghost.color}`
    return `<span id="${ghost.id}" class="${ghost.class}" style="${style}">${GHOST}</span>`
}