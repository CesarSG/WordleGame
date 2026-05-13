import { useState, useEffect } from 'react'
import type { GameStatus, LetterResult } from './types'
import { Toaster, toast } from 'sonner'
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
      setStatus('win');
      confetti({
          position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
          count: 200,
          size: 1,
          velocity: 300,
          fade: false,
      });
      const attempts = historyGuess.length + 1;
      const labels = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!'];
      const label = labels[attempts - 1] ?? 'Nice!';
      toast.success(
        <div className="flex flex-col gap-1 mx-2">
          <span className="font-bold text-base">You won!</span>
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-sm">Solved in <strong>{attempts}/{MAX_WORDS}</strong> {attempts === 1 ? 'attempt' : 'attempts'}</span>
          <span className="text-sm">The word was <strong>{currentWord}</strong></span>
          <span className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Click <strong>Play Again</strong> below to start a new game</span>
        </div>,
        { duration: Infinity, closeButton: true, richColors: true }
      );
    } 

    setHistoryGuess([...historyGuess, result])
    setCurrentGuess('')
  }

  function resetGame(){
    toast.dismiss();
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
          toast.warning(`The word must have ${WORD_LENGTH} letters`)
        }
        if (event.key === 'Shift') {
          toast.info(`Hint: ${currentHint}`, { duration: 6000, position: 'top-right', richColors: true  })
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
        toast.error(
          <div className="flex flex-col gap-1 mx-2">
            <span className="font-bold text-base">You lost!</span>
            <span className="text-sm font-semibold">Better luck next time!</span>
            <span className="text-sm">You used all <strong>{MAX_WORDS}</strong> attempts</span>
            <span className="text-sm">The word was <strong>{currentWord}</strong></span>
          </div>,
          { duration: 6000 }
        );
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
