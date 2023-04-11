document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const flagsLeft = document.querySelector('#flags-left')
  const result = document.querySelector('#result')

  const WIDTH = 10
  const BOMB_AMOUNT = 10

  let flags = 0
  let squares = []
  let isGameOver = false

  createBoard()


  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }


  function createBoard() {
    flagsLeft.innerHTML = BOMB_AMOUNT

    const states = Array(BOMB_AMOUNT).fill('bomb').concat(Array(WIDTH * WIDTH - BOMB_AMOUNT).fill('valid'))
    shuffle(states);

    for (let i = 0; i < WIDTH * WIDTH; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', i)
      square.classList.add(states[i], 'box')
      grid.appendChild(square)
      squares.push(square)

      square.addEventListener('click', () => click(square))

      square.oncontextmenu = e => {
        e.preventDefault()
        addFlag(square)
      }
    }

    for (let i = 0; i < squares.length; i++) {
      let total = 0
      const isLeftEdge = (i % WIDTH === 0)
      const isRightEdge = (i % WIDTH === WIDTH - 1)

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++  // left square
        if (i > 9 && !isRightEdge && squares[i + 1 - WIDTH].classList.contains('bomb')) total++  // top-right square
        if (i > 9 && squares[i - WIDTH].classList.contains('bomb')) total++  // top square
        if (i > 10 && !isLeftEdge && squares[i - 1 - WIDTH].classList.contains('bomb')) total++  // top-left square
        if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++  // right square
        if (i < 90 && !isLeftEdge && squares[i - 1 + WIDTH].classList.contains('bomb')) total++  // bottom-left square
        if (i < 89 && !isRightEdge && squares[i + 1 + WIDTH].classList.contains('bomb')) total++  // bottom-right square
        if (i < 90 && squares[i + WIDTH].classList.contains('bomb')) total++  // bottom
        squares[i].setAttribute('data-adjacent-bombs', total)
      }
    }
  }


  function click(square) {
    let currentId = square.id

    if (isGameOver) return

    if (square.classList.contains('checked') || square.classList.contains('flag')) return

    if (square.classList.contains('bomb')) {
      gameOver(square)
    } else {
      let total = square.getAttribute('data-adjacent-bombs')
      if (total != 0) {
        square.classList.add('checked')
        if (total == 1) square.classList.add('one')
        else if (total == 2) square.classList.add('two')
        else if (total == 3) square.classList.add('three')
        else if (total == 4) square.classList.add('four')
        square.innerHTML = total
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add('checked')
  }


  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % WIDTH === 0)
    const isRightEdge = (currentId % WIDTH === WIDTH - 1)
    currentId = parseInt(currentId)

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) click(document.getElementById(currentId - 1))  // left square
      if (currentId > 9 && !isRightEdge) click(document.getElementById(currentId + 1 - WIDTH))  // top-right square
      if (currentId > 9) click(document.getElementById(currentId - WIDTH))  // top square
      if (currentId > 10 && !isLeftEdge) click(document.getElementById(currentId - 1 - WIDTH))  // top-left square
      if (currentId < 99 && !isRightEdge) click(document.getElementById(currentId + 1))  // right square
      if (currentId < 90 && !isLeftEdge) click(document.getElementById(currentId - 1 + WIDTH))  // bottom-left square
      if (currentId < 89 && !isRightEdge) click(document.getElementById(currentId + 1 + WIDTH))  // bottom-right square
      if (currentId < 90) click(document.getElementById(currentId + WIDTH))  // bottom square
    }, 10)
  }

  function gameOver(square) {
    result.innerHTML = 'BOOM! Game Over!'
    isGameOver = true

    // Show all the bomb locations
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣'
        square.classList.remove('bomb')
        square.classList.add('checked')
      }
    })
  }


  function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < BOMB_AMOUNT)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = ' 🚩'
        flags++
        flagsLeft.innerHTML = BOMB_AMOUNT - flags
        checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        flags--
        flagsLeft.innerHTML = BOMB_AMOUNT - flags
      }
    }
  }


  function checkForWin() {
    let matches = 0

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches++
      }
      if (matches === BOMB_AMOUNT) {
        result.innerHTML = 'YOU WIN!'
        isGameOver = true
      }
    }
  }
})
