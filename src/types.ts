export type GameStatus = 'playing' | 'win' | 'lost'

export type LetterResult = {
    position: number;
    letter: string;
    status: 'correct' | 'present' | 'absent';
}
