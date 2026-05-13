import { toast } from 'sonner'

const WIN_LABELS = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!']

export function dismissToasts() {
  toast.dismiss()
}

export function showHintToast(hint: string) {
  toast.info(`Hint: ${hint}`, { duration: 6000, richColors: true })
}

export function showTooShortToast(wordLength: number) {
  toast.warning(`The word must have ${wordLength} letters`)
}

export function showWinToast(attempts: number, maxWords: number, word: string) {
  const label = WIN_LABELS[attempts - 1] ?? 'Nice!'
  toast.success(
    <div className="flex flex-col gap-1 mx-2">
      <span className="font-bold text-base">You won!</span>
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-sm">Solved in <strong>{attempts}/{maxWords}</strong> {attempts === 1 ? 'attempt' : 'attempts'}</span>
      <span className="text-sm">The word was <strong>{word}</strong></span>
      <span className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Click <strong>Play Again</strong> below to start a new game</span>
    </div>,
    { duration: Infinity, closeButton: true, richColors: true }
  )
}

export function showLoseToast(maxWords: number, word: string) {
  toast.error(
    <div className="flex flex-col gap-1 mx-2">
      <span className="font-bold text-base">You lost!</span>
      <span className="text-sm font-semibold">Better luck next time!</span>
      <span className="text-sm">You used all <strong>{maxWords}</strong> attempts</span>
      <span className="text-sm">The word was <strong>{word}</strong></span>
    </div>,
    { duration: Infinity, closeButton: true}
  )
}
