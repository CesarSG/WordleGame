import type { LetterResult } from '../types'

const STATUS_CLASS: Record<LetterResult['status'], string> = {
    correct: 'tile-correct',
    present: 'tile-present',
    absent: 'tile-absent',
}

interface KeyboardProps {
    letterStatuses: Record<string, LetterResult['status']>
    handleButtonClick: (letter: string) => void;
}

export default function Keyboard({ letterStatuses, handleButtonClick }: KeyboardProps) {

    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
    ]

    return (
        <div>
            {
                keys.map((row, indexRow) => {
                    return(
                        <div key={indexRow} className="flex gap-2 justify-center mx-2">
                            {
                                row.map((letter, indexLetter) => {
                                    const status = letterStatuses[letter]
                                    return(
                                        <button onClick={() => handleButtonClick(letter)} key={indexLetter} className={`key w-15 h-15 mt-2 rounded-sm flex text-lg font-semibold items-center justify-center ${status ? STATUS_CLASS[status] : ''}`}>
                                            {letter === 'Backspace' ? '⌫' : letter === 'Enter' ? '↵' : letter}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}
