import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import { showWinToast, showLoseToast, showHintToast, showTooShortToast, dismissToasts } from './utils/toasts'
import { launchConfetti } from './utils/confetti'
import { WORDS } from './data/words'
import { MAX_WORDS, WORD_LENGTH, USABLE_CHARS } from './constants'
import type { GameStatus, LetterResult } from './types'
import Board from './components/Board.tsx'
import Keyboard from './components/Keyboard.tsx'
import InstructionsModal from './components/InstructionsModal.tsx'
import faviconUrl from '/favicon.svg'
import './App.css'

function App() {

  const [currentWord, setCurrentWord] = useState('');
  const [currentHint, setCurrentHint] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [historyGuess, setHistoryGuess] = useState<LetterResult[][]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  
  const statusPriority: Record<LetterResult['status'], number> = { correct: 2, present: 1, absent: 0 };

  const letterStatuses = historyGuess.flat().reduce<Record<string, LetterResult['status']>>((acc, { letter, status }) => {
    if (!acc[letter] || statusPriority[status] > statusPriority[acc[letter]]) acc[letter] = status;
    return acc;
  }, {});

  function handleButtonClick(letter: string) {
    if(status !== 'playing' || historyGuess.length >= MAX_WORDS) return;
    
    if(USABLE_CHARS.test(letter) && currentGuess.length < WORD_LENGTH && letter.length === 1) {
      setCurrentGuess(prev => prev + letter.toLocaleUpperCase())
    }
    if(letter === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1))
    }
    if(letter.toUpperCase() === 'ENTER' && currentGuess.length < (WORD_LENGTH - 1)) {
      dismissToasts();
      showTooShortToast(WORD_LENGTH)
    }
    if(letter.toUpperCase() === 'ENTER' && currentGuess.length === WORD_LENGTH) {
      submitGuess(currentGuess)
    }
  }

  function selectWord(){
    const entry = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(entry.word);
    setCurrentHint(entry.hint);
  }

  function computeLetterResults(word: string, currentWord: string): LetterResult[] {

    const answer: (string | null)[] = currentWord.split('');

    const result: LetterResult[] = Array.from({ length: WORD_LENGTH }, (_, i) => ({
      position: i, letter: word[i], status: "absent"
    }));

    result.forEach((value, index) => {
      if(value.letter === currentWord.at(index)){
        answer[index] = null;
        value.status = "correct"
      }
    });

    result.forEach((value) => {
      if(value.status === "absent" && answer.indexOf(value.letter) !== -1){
        const index = answer.indexOf(value.letter);
        answer[index] = null;
        value.status = "present"
      }
    });

    return result;
  }

  function handleWin(attempts: number) {
    setStatus('win');
    launchConfetti();
    showWinToast(attempts, MAX_WORDS, currentWord);
  }

  function submitGuess(word: string) {
    const result = computeLetterResults(word, currentWord);
    if (word === currentWord) handleWin(historyGuess.length + 1);
    setHistoryGuess(prev => [...prev, result]);
    setCurrentGuess('');
  }

  function resetGame(){
    dismissToasts();
    setCurrentGuess('');
    setHistoryGuess([]);
    setStatus('playing');
    selectWord();
  }

  useEffect(() =>{
    selectWord();
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, [])

  useEffect(() => {

    const handleGlobalKeyDown = (event: any) => { 

      if(status === "playing" && historyGuess.length < MAX_WORDS) {
        if (event.key === 'Backspace') {
          setCurrentGuess(prev => prev.slice(0, -1))
        }
        if (event.key === 'Enter' && currentGuess.length > (WORD_LENGTH - 1)) {
          submitGuess(currentGuess)
        }
        if (event.key === 'Enter' && currentGuess.length < WORD_LENGTH) {
          dismissToasts();
          showTooShortToast(WORD_LENGTH)
        }
        if (event.key === 'Tab' || event.key === 'Shift') {
          event.preventDefault();
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
        <div className="grid grid-cols-1 gap-3">
          <div className="relative flex items-center justify-center mt-5">
            <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <img src={faviconUrl} alt="" className="w-8 h-8" />
              Wordle Game
            </h1>
            <button
              onClick={() => setIsInstructionsOpen(true)}
              className="absolute right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 hover:brightness-90 transition-all"
              style={{ borderColor: 'var(--text-secondary)', color: 'var(--text-secondary)' }}
              aria-label="How to play"
            >
              ?
            </button>
          </div>
          <InstructionsModal isOpen={isInstructionsOpen} onClose={() => setIsInstructionsOpen(false)} />
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
                <span className="text-center text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Guess the word in {MAX_WORDS - historyGuess.length} attempts</span>
                <div className="flex flex-col items-center gap-1 pb-3">
                  <button tabIndex={-1} onClick={(e) => { (e.currentTarget as HTMLButtonElement).blur(); dismissToasts(); showHintToast(currentHint); }} className="bg-gray-300 text-center text-xs mx-auto px-3 py-1 rounded-lg font-medium" style={{ color: 'var(--text-secondary)' }}>{isTouchDevice ? 'Tap for a hint' : 'Click for a hint'}</button>
                  {!isTouchDevice && <span className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}>or press Shift on your keyboard</span>}
                </div>
              </>
            )
          }
          
          <Keyboard 
            letterStatuses={letterStatuses} 
            handleButtonClick={handleButtonClick}
          />
          <Toaster 
            position="top-center" 
            expand={true} 
            duration={2000} 
          />
        </div>
      </div>
    </>
  )
}

export default App
