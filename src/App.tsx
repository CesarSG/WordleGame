import { useState, useEffect } from 'react'
import './App.css'

const WORDS = ['apple', 'grape', 'peach', 'mango', 'berry']
const MAX_WORDS = 5
const WORD_LENGTH = 5

function App() {

  const [currentWord, setCurrentWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [historyGuess, setHistoryGuess] = useState<string[]>([]);
  const [status, setStatus] = useState('playing');

  function selectWord(){
    setCurrentWord(WORDS[Math.floor(Math.random() * WORDS.length)])
  }

  useEffect(() =>{
    selectWord()
  }, [])

  useEffect(() => {

    const handleGlobalKeyDown = (event) => { 

      if(status === "playing"){
        if (event.key === 'Backspace') {
          setCurrentGuess(prev => prev.slice(0, -1))
        }
        if (event.key === 'Enter' && currentGuess.length > (WORD_LENGTH - 1)) {
          setHistoryGuess([...historyGuess, currentGuess])
          setCurrentGuess('')
        }
        if (event.key.length === 1 && USABLE_CHARS.test(event.key) && currentGuess.length < WORD_LENGTH) {
          setCurrentGuess(prev => prev + event.key)
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
    
  }, [currentGuess, status])

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">
          Wordle Game
        </h1>
        <p>Status: {status}</p>
        <p>Current Word: {currentWord}</p>
        <p>Current Guess: {currentGuess}</p>
        <p>History Guesses:</p>
        {
          historyGuess.map((word, index) =>{
            return (
              <p key={index} >{word}</p>
            );
          })
        }
        
      </div>
    </>
  )
}

export default App
