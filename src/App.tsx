import { useState, useEffect } from 'react'
import Board from './components/Board.tsx'
import Keyboard from './components/Keyboard.tsx'
import './App.css'

const WORDS = ['apple', 'grape', 'peach', 'mango', 'berry']
const MAX_WORDS = 5
const WORD_LENGTH = 5
const USABLE_CHARS = /[a-zA-Z]/

import type { GameStatus } from './types'


function App() {

  const [currentWord, setCurrentWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [historyGuess, setHistoryGuess] = useState<string[]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');

  function selectWord(){
    setCurrentWord(WORDS[Math.floor(Math.random() * WORDS.length)])
  }

  function evaluateWord(word: string){

    if(word === currentWord){
      setStatus('win');
      alert("You have win!");
    } 

    setHistoryGuess([...historyGuess, currentGuess])
    setCurrentGuess('')
  }

  useEffect(() =>{
    selectWord()
  }, [])

  useEffect(() => {

    const handleGlobalKeyDown = (event: any) => { 

      if(status === "playing" && historyGuess.length < MAX_WORDS) {
        if (event.key === 'Backspace') {
          setCurrentGuess(prev => prev.slice(0, -1))
        }
        if (event.key === 'Enter' && currentGuess.length > (WORD_LENGTH - 1)) {
          evaluateWord(currentGuess)
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
    
  }, [currentGuess])

  useEffect(() => {

    if(historyGuess.length == MAX_WORDS){
      if (historyGuess[historyGuess.length - 1] !== currentWord){
        setStatus('lost');
        alert("You have lost");
      }
    }

  }, [historyGuess])

  return (
    <>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h1 className="text-3xl font-bold underline text-center">
              Wordle Game
            </h1>
            <p className="text-center">Status: {status} / Word: {currentWord}</p>
          </div>
          <Board  
              currentGuess={currentGuess}
              historyGuess={historyGuess}
              MAX_WORDS={MAX_WORDS}
              WORD_LENGTH={WORD_LENGTH}
              status={status}
          />  
          <Keyboard 

          />
        </div>
      </div>
    </>
  )
}

export default App
