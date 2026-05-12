import { useState, useEffect } from 'react'
import type { GameStatus, LetterResult } from './types'
import Board from './components/Board.tsx'
import Keyboard from './components/Keyboard.tsx'
import './App.css'

const WORDS = ['APPLE', 'GRAPE', 'MANGO', 'PEACH', 'BERRY', 'LEMON', 'CHERRY', 'PEARL', 'PLUMB', 'PRUNE']
const MAX_WORDS = 5
const WORD_LENGTH = 5
const USABLE_CHARS = /[a-zA-Z]/


function App() {

  const [currentWord, setCurrentWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [historyGuess, setHistoryGuess] = useState<LetterResult[][]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');

  function selectWord(){
    setCurrentWord(WORDS[Math.floor(Math.random() * WORDS.length)])
  }

  function evaluateWord(word: string){

    const result: LetterResult[] = word.split('').map((letter, index) => {
      return evaluateLetter(letter, index)
    })

    if(word === currentWord){
      setStatus('win');
      alert("You have win!");
    } 

    setHistoryGuess([...historyGuess, result])
    setCurrentGuess('')
  }

  function evaluateLetter(letter: string, position: number) {

    let status: LetterResult['status'] = 'absent'

    if(currentWord.at(position) == letter){
      status = "correct"
    } else if(currentWord.includes(letter)){
      status = "present"
    } 

    return { "position": position, "letter": letter, "status": status }
  }

  function resetGame(){
    setCurrentGuess('');
    setHistoryGuess([]);
    setStatus('playing');
    selectWord();
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
          setCurrentGuess(prev => prev + event.key.toUpperCase())
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
      const lastGuess = historyGuess[historyGuess.length - 1].map(lr => lr.letter).join('');
      if (lastGuess !== currentWord){
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
