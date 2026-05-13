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
        if (letterStatus === "correct") return "tile-correct"
        if (letterStatus === "present") return "tile-present"
        return "tile-absent"
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
                                        <div key={y} className={`tile w-15 h-15 mt-2 border-2 font-semibold rounded-md flex text-lg items-center justify-center ${isPastRow ? getCellStyle(historyGuess[x][y].status) : ''} ${isActiveRow ? 'tile-active' : ''}`}>
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