'use strict'

const WALL = '#'
const FOOD = '.'
const POWER = '&bigstar;'
const EMPTY = ' '
const CHERRY = '&blacklozenge;'

var gGame = {
    score: 0,
    isOn: false,
    foodLeft: -1 // 👈 -1 due to player start on food cell
}
var gBoard, gJailBoard, gCherryInterval

function init() {
    console.log('hello')

    gJailBoard = buildJail()
    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)

    printMat(gJailBoard, '.jail-container')
    printMat(gBoard, '.board-container')
    gGame.isOn = true
    gCherryInterval = setInterval(() => { addCherry() }, 15 * 1000)

}

function buildBoard() {
    const SIZE = 10
    const board = []

    for (let i = 0; i < SIZE; i++) {
        board.push([])

        for (let j = 0; j < SIZE; j++) {
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL
            } else if (i === 1 && j === SIZE - 2 || i === 1 && j === 1 ||
                i === SIZE - 2 && j === SIZE - 2 || j === 1 && i === SIZE - 2) {
                board[i][j] = POWER
            } else {
                board[i][j] = FOOD
                gGame.foodLeft++
            }
        }
    }
    return board
}

function buildJail() {
    const height = 5
    const length = 3
    const board = []

    for (let i = 0; i < height; i++) {
        board.push([])
        for (let j = 0; j < length; j++) {
            if (i === 0 || i === height - 1 ||
                j === 0 || j === length - 1) {
                board[i][j] = WALL
            } else board[i][j] = EMPTY
        }
    }
    return board
}

function addCherry() {
    let emptySlots = []
    for (let i = 1; i < gBoard.length - 1; i++) {
        for (let j = 1; j < gBoard[0].length - 1; j++) {
            if (gBoard[i][j] === EMPTY) {
                emptySlots.push({ i, j })
            }
        }
    }
    if (emptySlots.length < 1) return
    let randomSlot = emptySlots[getRandomIntInt(0, emptySlots.length - 1)]
    gBoard[randomSlot.i][randomSlot.j] = CHERRY
    renderCell(randomSlot, CHERRY)
}

function updateScore(diff) {
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score
    if (gGame.foodLeft === 0) gameOver(true)
}

function gameOver(playerWon) {
    console.log('Game Over')
    // let modalText = ''
    let modalText = (playerWon) ? 'You won!!' : 'Game Over'
    gGame.isOn = false
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    showModal(gGame.score, modalText)
}

function playAgain() {
    var elModal = document.getElementById("myModal")
    var elScore = document.querySelector(".score span")
    elModal.style.display = "none"
    elScore.innerText = 0
    gGame.score = 0
    gGame.foodLeft = -1
    init()
}

function showModal(score, str) {
    var elModal = document.getElementById("myModal")
    var elSpan = document.querySelector(".close")
    var modalScore = document.querySelector(".modal-content h3")
    modalScore.innerText = `${str} \nYour score is: ${score}`
    elModal.style.display = "block"
    elSpan.onclick = () => elModal.style.display = "none"
}