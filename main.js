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


  //add Flag with right click
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
        if (total == 2) square.classList.add('two')
        if (total == 3) square.classList.add('three')
        if (total == 4) square.classList.add('four')
        square.innerHTML = total
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add('checked')
  }


  //check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % WIDTH === 0)
    const isRightEdge = (currentId % WIDTH === WIDTH - 1)

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id
        //const newId = parseInt(currentId) - 1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - WIDTH].id
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId - WIDTH)].id
        //const newId = parseInt(currentId) -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - WIDTH].id
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id
        //const newId = parseInt(currentId) +1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + WIDTH].id
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + WIDTH].id
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) + WIDTH].id
        //const newId = parseInt(currentId) +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
    }, 10)
  }

  //game over
  function gameOver(square) {
    result.innerHTML = 'BOOM! Game Over!'
    isGameOver = true

    //show ALL the bombs
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣'
        square.classList.remove('bomb')
        square.classList.add('checked')
      }
    })
  }

  //check for win
  function checkForWin() {
    ///simplified win argument
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
