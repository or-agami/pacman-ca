'use strict'

const PACMAN = '😷';
var gPacman;

function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 5
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {

    if (!gGame.isOn) return
    const nextLocation = getNextLocation(ev)

    if (!nextLocation) return

    var nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell === WALL) return
    if (nextCell === POWER) {
        if (gPacman['isSuper']) return
        else SuperPacman()
    }
    if (nextCell === FOOD) {
        gGame.foodLeft--
        updateScore(1)
    }
    if (nextCell === CHERRY) {
        updateScore(10)
    }
    if (nextCell === GHOST) {
        if (gPacman['isSuper']) {
            let elGhost = document.querySelector(`.cell-${nextLocation.i}-${nextLocation.j} span`)
            let ghostIdx = elGhost.id
            ghostEaten(gGhosts[ghostIdx])
        } else {
            gameOver()
            renderCell(gPacman.location, EMPTY)
            return
        }
    }

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY

    // update the DOM
    renderCell(gPacman.location, EMPTY)

    // update the model
    gPacman.location = nextLocation
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN

    // update the DOM
    renderCell(gPacman.location, PACMAN)
}

function SuperPacman() {
    gPacman.isSuper = true
    setTimeout(() => { gPacman.isSuper = false }, 5000)
}

function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--;
            break;
        case 'ArrowDown':
            nextLocation.i++;
            break;
        case 'ArrowLeft':
            nextLocation.j--;
            break;
        case 'ArrowRight':
            nextLocation.j++;
            break;
        default:
            return null;
    }
    return nextLocation;
}