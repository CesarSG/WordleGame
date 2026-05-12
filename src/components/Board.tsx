import type { GameStatus, LetterResult } from '../types'

interface BoardProps {
    currentGuess: string;
    historyGuess: LetterResult[][];
    MAX_WORDS: number;
    WORD_LENGTH: number;
    status: GameStatus;
}

export default function Board({ currentGuess, historyGuess, MAX_WORDS, WORD_LENGTH, status }: BoardProps) {

    const getCellStyle = (letterStatus: LetterResult['status']) => {
        if(letterStatus === "correct"){
            return "bg-green-100 border-green-100"
        } else if(letterStatus === "present"){
            return "bg-yellow-100 border-yellow-100"
        } else {
            return "bg-gray-100 border-gray-100"
        }
    }
    
    return (
        <div>
            <div className="my-5">
            {
                Array.from({ length: MAX_WORDS }).map((_, x) => {
                    return(
                        <div key={x} className="flex gap-2 justify-center">
                            {
                                Array.from({ length: WORD_LENGTH }).map((_, y) => {
                                    const isActiveRow = x === historyGuess.length && status === 'playing';
                                    const isPastRow = x < historyGuess.length;
                                    return(
                                        <div key={y} className={`w-15 h-15 mt-2 border-2 flex text-lg items-center justify-center ${isPastRow ? getCellStyle(historyGuess[x][y].status) : ''} ${isActiveRow ? 'bg-gray-100' : !isPastRow ? 'bg-gray-400 border-gray-400' : ''}`}>
                                            { isPastRow ? historyGuess[x][y].letter : isActiveRow ? currentGuess[y] : '' }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }   
            </div>  

            {
                (MAX_WORDS - historyGuess.length > 0 && status === 'playing') && <p className='text-center'>You have {MAX_WORDS - historyGuess.length} guesses left</p>
            }   

        </div>
    )
}