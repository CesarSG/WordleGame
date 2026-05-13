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
          <Keyboard 

          />
        </div>
      </div>
    </>
  )
}

export default App
