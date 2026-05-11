


interface BoardProps {
  currentWord: string;
  currentGuess: string;
  historyGuess: string[];
}

export default function Board({ currentWord, currentGuess, historyGuess }: BoardProps) {
    
  return (
    <div>
        <p>Current Word: {currentWord}</p>
        <p>Current Guess: {currentGuess}</p>
        <p>History Guesses:</p>
        {
          historyGuess.map((word, index) =>{
            return (
              <p key={index} >{word}</p>
            );
          })
        }
    </div>
  )
}