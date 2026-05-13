interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ExampleTile({ letter, status }: { letter: string; status?: string }) {
  return (
    <span
      className={`tile w-10 h-10 border-2 flex items-center justify-center text-base font-bold rounded ${status ? `tile-${status}` : ""}`}
    >
      {letter}
    </span>
  );
}

export default function InstructionsModal({
  isOpen,
  onClose,
}: InstructionsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Close instructions"
        >
          ✕
        </button>

        <h2
          className="text-xl font-bold text-center mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          How to Play
        </h2>
        <p
          className="text-sm text-center mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Guess the word in 6 tries
        </p>

        <hr className="mb-4" style={{ borderColor: "var(--tile-border)" }} />

        <div>
          <ul
            className="text-sm space-y-2 mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            <li>
              Each guess must be a <strong>5-letter word</strong>.
            </li>
            <li>
              Press <strong>ENTER</strong> to
              submit your guess.
            </li>
            <li>
              The color of the tiles will change to show how close your guess
              was.
            </li>
          </ul>
        </div>

        <hr className="mb-4" style={{ borderColor: "var(--tile-border)" }} />

				<div>
					<p
						className="text-xs font-semibold uppercase tracking-wide mb-3"
						style={{ color: "var(--text-secondary)" }}
					>
						Examples
					</p>

					<div className="flex gap-1 mb-1 ">
						{["W", "E", "A", "R", "Y"].map((l, i) => (
							<ExampleTile
								key={i}
								letter={l}
								status={i === 0 ? "correct" : undefined}
							/>
						))}
					</div>
					<p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
						<strong>W</strong> is in the word and in the correct spot.
					</p>

					<div className="flex gap-1 mb-1">
						{["P", "I", "L", "L", "S"].map((l, i) => (
							<ExampleTile
								key={i}
								letter={l}
								status={i === 1 ? "present" : undefined}
							/>
						))}
					</div>
					<p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
						<strong>I</strong> is in the word but in the wrong spot.
					</p>

					<div className="flex gap-1 mb-1">
						{["V", "A", "G", "U", "E"].map((l, i) => (
							<ExampleTile
								key={i}
								letter={l}
								status={i === 3 ? "absent" : undefined}
							/>
						))}
					</div>
					<p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
						<strong>U</strong> is not in the word.
					</p>
				</div>

        <hr className="mb-4" style={{ borderColor: "var(--tile-border)" }} />

        <p
          className="text-xs font-semibold uppercase tracking-wide mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Keyboard Shortcuts
        </p>
        <ul
          className="text-xs space-y-1"
          style={{ color: "var(--text-secondary)" }}
        >
          <li>
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-300 font-mono text-gray-700">
              A–Z
            </kbd>{" "}
            Type a letter
          </li>
          <li>
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-300 font-mono text-gray-700">
              ENTER
            </kbd>{" "}
            Submit guess <span className="text-gray-400">(Enter)</span>
          </li>
          <li>
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-300 font-mono text-gray-700">
              ⌫
            </kbd>{" "}
            Delete letter <span className="text-gray-400">(Backspace)</span>
          </li>
          <li>
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-300 font-mono text-gray-700">
              Shift
            </kbd>{" "}
            Show hint
          </li>
        </ul>
      </div>
    </div>
  );
}
