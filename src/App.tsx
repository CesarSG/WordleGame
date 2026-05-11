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

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">
          Wordle Game
        </h1>
        
      </div>
    </>
  )
}

export default App
