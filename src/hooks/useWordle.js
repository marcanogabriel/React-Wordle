import { useState } from 'react'

const useWordle = (solution, words) => {
  const [turn, setTurn] = useState(0)
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState([...Array(6)]) // each guess is an array
  const [history, setHistory] = useState([]) // each guess is a string
  const [isCorrect, setIsCorrect] = useState(false)
  const [usedKeys, setUsedKeys] = useState({}) // {a: 'green', b: 'yellow', c: 'grey'}

  // format a guess into an array of letter objects
  // e.g. [{key: "a", color: "yellow"}]
  const formatGuess = () => {
    let solutionArray = [...solution]
    let formattedGuess = [...currentGuess].map(l => {
      return { key: l, color: 'grey' }
    })

    // find any green letters
    formattedGuess.forEach((l, i) => {
      if (solutionArray[i] === l.key) {
        formattedGuess[i].color = 'green'
        solutionArray[i] = null
      }
    })

    // find any yellow letters
    formattedGuess.forEach((l, i) => {
      if (solutionArray.includes(l.key) && l.color !== 'green') {
        formattedGuess[i].color = 'yellow'
        solutionArray[solutionArray.indexOf(l.key)] = null
      }
    })

    return formattedGuess
  }

  // add a new guess to the guesses state
  // update the isCorrect state if the fuess is correct
  // add one to the turn state
  const addNewGuess = (formattedGuess) => {
    if (currentGuess === solution) {
      setIsCorrect(true)
    }

    setGuesses(prevGuesses => {
      let newGuesses = [...prevGuesses]
      newGuesses[turn] = formattedGuess
      return newGuesses
    })

    setHistory(prevHistory => {
      return [...prevHistory, currentGuess]
    })

    setTurn(prevTurn => {
      return prevTurn + 1
    })

    setUsedKeys((prevUsedKeys) => {
      let newKeys = {...prevUsedKeys}
      
      formattedGuess.forEach((l) => {
        const currentColor = newKeys[l.key]
        if (l.color === 'green') {
          newKeys[l.key] = 'green'
          return
        }

        if (l.color === 'yellow' && currentColor !== 'green') {
          newKeys[l.key] = 'yellow'
          return
        }

        if (l.color === 'grey' && currentColor !== 'green' && currentColor !== 'yellow') {
          newKeys[l.key] = 'grey'
          return
        }
      })

      return newKeys
    })

    setCurrentGuess('')
  }

  // handle keyup event & track current guess
  // if user presses enter, add the new guess
  const handleKeyup = ({ key }) => {

    if (key === 'Enter') {
      // only add guess if turn is less than 5
      if (turn > 5) {
        console.log('you used all your guesses')
        return
      }
      // check word is 5 chars long
      if (currentGuess.length !== 5) {
        alert('The word must be 5 chars long')
        console.log('word must be 5 chars long')
        return
      }
      // do not allow fake words 
      if (!words.includes(currentGuess)) {
        alert('That word doesn\'t exist')
        console.log('The word doesn\'t exist')
        return
      }
      // do not allow duplicate words
      if (history.includes(currentGuess)) {
        alert('You already used that word')
        console.log('you already tried that word')
        return
      }

      const formatted = formatGuess()
      addNewGuess(formatted)
    }

    if (key === 'Backspace') {
      setCurrentGuess(prev => {
        return prev.slice(0, -1)
      })
      return
    }

    if (/^[ÑñA-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess(prev => {
          return prev + key.toLowerCase()
        })
      }
    }
  }

  const handleClick = ({ target }) => {


    if (document.querySelector('div.keypad').contains(target)) {

      if (target.innerText.toUpperCase() === 'ENTER') {
        // only add guess if turn is less than 5
        if (turn > 5) {
          console.log('you used all your guesses')
          return
        }
        // check word is 5 chars long
        if (currentGuess.length !== 5) {
          alert('The word must be 5 chars long')
          console.log('word must be 5 chars long')
          return
        }
        // do not allow fake words 
        if (!words.includes(currentGuess)) {
          alert('That word doesn\'t exist')
          console.log('The word doesn\'t exist')
          return
        }
        // do not allow duplicate words
        if (history.includes(currentGuess)) {
          alert('You already used that word')
          console.log('you already tried that word')
          return
        }
  
        const formatted = formatGuess()
        addNewGuess(formatted)
      }
      
      if (target.innerText.toUpperCase() === 'DEL') {
        setCurrentGuess(prev => {
          return prev.slice(0, -1)
        })
        return
      }

      if (/^[ÑñA-Za-z]$/.test(target.innerText)) {
        if (currentGuess.length < 5) {
          setCurrentGuess(prev => {
            return prev + target.innerText.toLowerCase()
          })
        }
      }
    }
  }

  return { turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup, handleClick }
}

export default useWordle