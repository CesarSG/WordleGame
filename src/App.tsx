import { useState, useEffect } from 'react'
import type { GameStatus, LetterResult } from './types'
import { Toaster } from 'sonner'
import { showWinToast, showLoseToast, showHintToast, showTooShortToast, dismissToasts } from './utils/toasts'
import confetti from "@hiseb/confetti";
import Board from './components/Board.tsx'
import Keyboard from './components/Keyboard.tsx'
import './App.css'

const WORDS = [
  { word: 'APPLE', hint: 'A common red or green fruit that keeps the doctor away' },
  { word: 'GRAPE', hint: 'Small round fruit that grows in clusters on a vine' },
  { word: 'MANGO', hint: 'A tropical fruit with orange flesh and a large pit' },
  { word: 'PEACH', hint: 'A fuzzy-skinned fruit with a sweet, juicy center' },
  { word: 'BERRY', hint: 'A small, round, juicy fruit — think strawberry or blueberry' },
  { word: 'LEMON', hint: 'A sour yellow citrus fruit used in drinks and cooking' },
  { word: 'PEARL', hint: 'A gem formed inside an oyster' },
  { word: 'PLUMB', hint: 'Perfectly vertical, like a plumber\'s weight on a string' },
  { word: 'PRUNE', hint: 'A dried plum, often eaten for digestive health' },
  { word: 'QUICK', hint: 'Moving fast or doing something in a short time' },
  { word: 'ROBIN', hint: 'A small bird with a red breast, often seen in gardens' },
  { word: 'SNAKE', hint: 'A legless reptile that slithers on the ground' },
  { word: 'TIGER', hint: 'A large wild cat with orange fur and black stripes' },
  { word: 'UMBRE', hint: 'A portable shade used to protect from the sun' },
  { word: 'VIOLE', hint: 'A small plant with purple, blue, or white flowers' },
  { word: 'WHALE', hint: 'A large marine mammal that lives in the ocean' },
  { word: 'XENON', hint: 'A colorless, odorless noble gas used in lighting' },
  { word: 'YACHT', hint: 'A luxurious boat used for pleasure cruising' },
  { word: 'ZEBRA', hint: 'An African animal with black and white stripes' }
]
const MAX_WORDS = 5
const WORD_LENGTH = 5
const USABLE_CHARS = /[a-zA-Z]/


function App() {

  const [currentWord, setCurrentWord] = useState('');
  const [currentHint, setCurrentHint] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [historyGuess, setHistoryGuess] = useState<LetterResult[][]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');

  const statusPriority: Record<LetterResult['status'], number> = { correct: 2, present: 1, absent: 0 };

  const letterStatuses = historyGuess.flat().reduce<Record<string, LetterResult['status']>>((acc, { letter, status }) => {
    if (!acc[letter] || statusPriority[status] > statusPriority[acc[letter]]) acc[letter] = status;
    return acc;
  }, {});
  

  function selectWord(){
    const entry = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(entry.word);
    setCurrentHint(entry.hint);
  }

  function evaluateWord(word: string){

    let result: LetterResult[] = [];
    let answer: (string | null)[] = currentWord.split('')

    for (let i=0; i < WORD_LENGTH; i++){
      result.push({ "position": i, "letter": word[i], "status": "absent" })
    }

    result.forEach((value, index) => {
      if(value.letter === currentWord.at(index)){
        answer[index] = null;
        value.status = "correct"
      }
    })

    result.forEach((value) => {
      if(value.status === "absent" && answer.indexOf(value.letter) !== -1){
        const index = answer.indexOf(value.letter);
        answer[index] = null;
        value.status = "present"
      }
    });

    if(word === currentWord){
      const attempts = historyGuess.length + 1;
      setStatus('win');
      launchConfetti();
      showWinToast(attempts, MAX_WORDS, currentWord);
    } 

    setHistoryGuess([...historyGuess, result])
    setCurrentGuess('')
  }

  function resetGame(){
    dismissToasts();
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
        if (event.key === 'Enter' && currentGuess.length < WORD_LENGTH) {
          dismissToasts();
          showTooShortToast(WORD_LENGTH)
        }
        if (event.key === 'Tab' || event.key === 'Shift') {
          dismissToasts();
          showHintToast(currentHint)
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
    
  }, [currentGuess, currentHint, status])

  useEffect(() => {

    if(historyGuess.length == MAX_WORDS){
      const lastGuess = historyGuess[historyGuess.length - 1].map(lr => lr.letter).join('');
      if (lastGuess !== currentWord){
        setStatus('lost');
        showLoseToast(MAX_WORDS, currentWord);
      }
    }

  }, [historyGuess])

  return (
    <>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-center mt-5">
              Wordle Game
            </h1>
          </div>
          <Board  
              currentGuess={currentGuess}
              historyGuess={historyGuess}
              MAX_WORDS={MAX_WORDS}
              WORD_LENGTH={WORD_LENGTH}
              status={status}
          /> 

          {
            status !== 'playing' && (
              <div className="flex justify-center">

                <button onClick={resetGame} className="relative inline-block text-lg group">
                    <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                        <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                        <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                        <span className="relative">Play Again</span>
                    </span>
                    <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
                </button>
                
                
              </div>
            )
          }
          {
            status === 'playing' && (
              <>
                <p 
                  className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Press Shift for a hint
                </p>
              </>
            )
          }
          
          <Keyboard letterStatuses={letterStatuses} />
          <Toaster position="top-center" expand={true} duration={2000} />
        </div>
      </div>
    </>
  )
}

export default App
