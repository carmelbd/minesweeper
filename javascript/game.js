'use strict'
///// MINE SWEEPER ;) /////
document.addEventListener('contextmenu', function (ev) {
    ev.preventDefault();
    return false;
}, false);

const FLAG = '🚩'
const BOMB = '💣'

var gBoard = []

var gCurrLevel = {
    boardSize: 4,
    minesCount: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    flagsCount: 0,
    secsPassed: 0,
    rowStart: -1,
    colStart: -1,
    isGameOver: false,
    flaggedMines: 0,
}

var gLevels = {
    easy: {
        boardSize: 4,
        minesCount: 2
    },
    medium: {
        boardSize: 8,
        minesCount: 12
    },
    expert: {
        boardSize: 12,
        minesCount: 30
    },
}

var gScore = 0;

var gIntervalID
var gStartTime

function startTimeInterval() {
    gStartTime = Date.now()
    console.log('gStartTime', gStartTime) / 10
    // console.log(gStartTime);

    gIntervalID = setInterval(function () {
        var elTimer = document.querySelector('.timer')
        var miliSecs = Date.now() - gStartTime
        // console.log('miliSecs/1000:', miliSecs/1000);
        // console.log('miliSecs:', miliSecs);

        elTimer.innerText = 'Time: ' + ((miliSecs) / 1000).toFixed(3);
    }, 10)
}

function checkIsWin() {
    return gGame.flaggedMines == gCurrLevel.minesCount
}

function changeLevel(elBtn, elTimer) {
    if (gGame.isOn = false) {
        startTimeInterval()
        gGame.isOn = true
    }
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = 'Time: 0.000'
    gCurrLevel = gLevels[elBtn.innerText.toLowerCase()];
    if (gCurrLevel == "easy") {
        elHTML.classList.remove('unClickedCell')
        elHTML.classList.add('easy')
    }
    if (gCurrLevel == "medium") {
        elHTML.classList.remove('unClickedCell')
        elHTML.classList.add('medium')
    }
    if (gCurrLevel == "expert") {
        elHTML.classList.remove('unClickedCell')
        elHTML.classList.add('expert')
    }
    init()
}

function init(elBtn, elHTML) {
    gGame = {
        isOn: false,
        shownCount: 0,
        flagsCount: 0,
        secsPassed: 0,
        rowStart: -1,
        colStart: -1,
        isGameOver: false,
        flaggedMines: 0,
    }
    clearInterval(gIntervalID)
    resetScore()
    var elModal = document.querySelector('.modal')
    elModal.style.display = "none";
    gBoard = buildBoard(gCurrLevel.boardSize);
    printMat(gBoard, '.board-container');
}

function resetScore() {
    gScore = 0
    document.querySelector('h2 span').innerText = gScore;
}

function cellClicked(elHTML) {
    if (gGame.isGameOver) return
    var row = parseInt(elHTML.getAttribute('row'));
    var col = parseInt(elHTML.getAttribute('col'));
    if (gGame.isOn == false) {
        startTimeInterval()
        gGame.isOn = true
        gGame.rowStart = row
        gGame.colStart = col
        fillBoard()
    }
    var cell = gBoard[row][col]
    if (cell.isMine) {
        gameOver()
        showCell(elHTML, BOMB)
        return
    }
    if (cell.isShown || cell.isFlagged) return
    cell.isShown = true
    gGame.shownCount++
    updateScore()
    showCell(elHTML, cell.minesAroundCount)
    if (cell.minesAroundCount == 0) {
        openAround(row, col);
    }
}

function showCell(elHTML, content) {
    elHTML.classList.remove('unClickedCell')
    elHTML.classList.add('clickedCell')
    elHTML.innerText = content
}

function updateScore() {
    // Model:
    gScore++;
    // Dom:
    document.querySelector('h2 span').innerText = gScore;
}

function toggleFlag(elHTML) {
    elHTML.classList.toggle('flagged')
    elHTML.classList.toggle('unClickedCell')
}

function cellFlagged(elHTML) {
    var row = elHTML.getAttribute('row');
    var col = elHTML.getAttribute('col');
    var cell = gBoard[row][col]
    if (gGame.isGameOver || cell.isShown) return
    if (gGame.flagsCount == gCurrLevel.minesCount && !cell.isFlagged) return
    cell.isFlagged = !cell.isFlagged
    toggleFlag(elHTML)
    if (cell.isFlagged == true) {
        gGame.flagsCount++

        if (cell.isMine) gGame.flaggedMines++
    } else {
        gGame.flagsCount--

        if (cell.isMine) gGame.flaggedMines--
    }

    victory()
}

function victory() {
    if (checkIsWin()) {
        gGame.isGameOver = true
        clearInterval(gIntervalID)
        var elModal = document.querySelector('.modal')
        elModal.style.display = "block";
        elModal = document.querySelector('.modal h2')
        elModal.innerText = "Game Won"


    }
}

function gameOver() {
    gGame.isGameOver = true
    console.log('Game Over');
    clearInterval(gIntervalID)
    var elModal = document.querySelector('.modal')
    elModal.style.display = "block";
    elModal = document.querySelector('.modal h2')
    elModal.innerText = "Game Over"
}

function setMine() {
    var i = getRandomInclusive(0, gCurrLevel.boardSize - 1)
    var j = getRandomInclusive(0, gCurrLevel.boardSize - 1)
    var randCell = gBoard[i][j];
    if (!randCell.isMine && i != gGame.rowStart && j != gGame.colStart) {
        randCell.isMine = true
        updateMinesAround(i, j)
    } else {
        setMine()
    }
}

function updateMinesAround(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > gBoard[i].length - 1) continue;
            if (i == row && j == col) continue;
            if (gBoard[i][j].isMine) continue
            gBoard[i][j].minesAroundCount++;
        }
    }
}

function openAround(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > gCurrLevel.boardSize - 1) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > gCurrLevel.boardSize - 1) continue;
            if (i == row && j == col) continue;
            var cell = gBoard[i][j];
            if (cell.isShown || cell.isFlagged) continue;
            cell.isShown = true;
            var elHTML = document.getElementById("cell_" + i + "_" + j);
            showCell(elHTML, cell.minesAroundCount)

            if (cell.minesAroundCount == 0) {
                openAround(i, j)
            }
        }
    }
}


function fillBoard() {
    for (var i = 0; i < gCurrLevel.minesCount; i++) {
        setMine()
    }
}

function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isFlagged: false
            }
            row.push(cell)
        }
        board.push(row)
    }
    return board
}

function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td id="cell_${i}_${j}"class=\'unClickedCell\'row=${i} col=${j} onclick="cellClicked(this)" oncontextmenu="cellFlagged(this)"=> </td>`
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function getRandomInclusive(min, max) { //{max include /min include!//
    return Math.floor(Math.random() * (max - min + 1)) + min; /// max include /min include!
}