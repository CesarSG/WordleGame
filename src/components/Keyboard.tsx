export default function Keyboard() {

    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ]

    return (
        <div>
            {
                keys.map((row, indexRow) => {
                    return(
                        <div key={indexRow} className="flex gap-2 justify-center">
                            {
                                row.map((letter, indexLetter) => {
                                    return(
                                        <div key={indexLetter} className={`w-15 h-15 mt-2 border-2 flex text-lg items-center justify-center`}>
                                            {letter}
                                        </div>
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