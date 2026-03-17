import { useEffect, useMemo, useRef, useState } from "react";

type Cell = {
  value: number | null;
  given: boolean;
  notes: number[];
};

const PUZZLE = [
  5, 3, 0, 0, 7, 0, 0, 0, 0,
  6, 0, 0, 1, 9, 5, 0, 0, 0,
  0, 9, 8, 0, 0, 0, 0, 6, 0,
  8, 0, 0, 0, 6, 0, 0, 0, 3,
  4, 0, 0, 8, 0, 3, 0, 0, 1,
  7, 0, 0, 0, 2, 0, 0, 0, 6,
  0, 6, 0, 0, 0, 0, 2, 8, 0,
  0, 0, 0, 4, 1, 9, 0, 0, 5,
  0, 0, 0, 0, 8, 0, 0, 7, 9
];

function makeBoard(): Cell[] {
  return PUZZLE.map((value) => ({
    value: value === 0 ? null : value,
    given: value !== 0,
    notes: []
  }));
}

function getPeers(index: number): number[] {
  const row = Math.floor(index / 9);
  const column = index % 9;
  const boxRow = Math.floor(row / 3) * 3;
  const boxColumn = Math.floor(column / 3) * 3;
  const peers = new Set<number>();

  for (let i = 0; i < 9; i += 1) {
    peers.add(row * 9 + i);
    peers.add(i * 9 + column);
  }

  for (let r = boxRow; r < boxRow + 3; r += 1) {
    for (let c = boxColumn; c < boxColumn + 3; c += 1) {
      peers.add(r * 9 + c);
    }
  }

  peers.delete(index);
  return [...peers];
}

function getCellNumber(cell: Cell): number | null {
  if (cell.value !== null) {
    return cell.value;
  }

  return cell.notes.length === 1 ? cell.notes[0] : null;
}

function getConflicts(board: Cell[]): Set<number> {
  const conflicts = new Set<number>();

  board.forEach((cell, index) => {
    const cellNumber = getCellNumber(cell);

    if (!cellNumber) {
      return;
    }

    const duplicated = getPeers(index).some((peerIndex) => getCellNumber(board[peerIndex]) === cellNumber);
    if (duplicated) {
      conflicts.add(index);
    }
  });

  return conflicts;
}

function getCellAriaLabel(index: number, cell: Cell, options: { conflict: boolean; showAsNote: boolean; cellNumber: number | null }): string {
  const row = Math.floor(index / 9) + 1;
  const column = (index % 9) + 1;
  const status: string[] = [];
  let content = "empty";

  if (options.showAsNote) {
    content = `notes ${cell.notes.join(" ")}`;
  } else if (options.cellNumber !== null) {
    content = String(options.cellNumber);
  } else if (cell.notes.length > 0) {
    content = `notes ${cell.notes.join(" ")}`;
  }

  if (cell.given) {
    status.push("given");
  }

  if (options.conflict) {
    status.push("conflict");
  }

  return `Row ${row} Column ${column}: ${content}${status.length > 0 ? ` (${status.join(", ")})` : ""}`;
}

export default function SudokuDemo() {
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [board, setBoard] = useState<Cell[]>(() => makeBoard());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [noteMode, setNoteMode] = useState(false);

  const conflicts = useMemo(() => getConflicts(board), [board]);
  const isSolved = useMemo(
    () => board.every((cell) => getCellNumber(cell) !== null) && conflicts.size === 0,
    [board, conflicts]
  );

  function setCellValue(nextValue: number | null) {
    if (board[selectedIndex].given) {
      return;
    }

    setBoard((currentBoard) =>
      currentBoard.map((cell, index) => {
        if (index !== selectedIndex) {
          return cell;
        }

        if (noteMode && nextValue !== null) {
          const hasNote = cell.notes.includes(nextValue);
          const notes = hasNote
            ? cell.notes.filter((note) => note !== nextValue)
            : [...cell.notes, nextValue].sort((a, b) => a - b);

          return {
            ...cell,
            value: null,
            notes
          };
        }

        return {
          ...cell,
          value: nextValue,
          notes: []
        };
      })
    );
  }

  function toggleNoteMode() {
    const nextMode = !noteMode;

    setNoteMode(nextMode);
    setBoard((currentBoard) =>
      currentBoard.map((cell) => {
        if (cell.given) {
          return cell;
        }

        if (nextMode) {
          if (cell.value === null) {
            return cell;
          }

          return {
            ...cell,
            value: null,
            notes: [cell.value]
          };
        }

        if (cell.notes.length !== 1) {
          return cell;
        }

        return {
          ...cell,
          value: cell.notes[0],
          notes: []
        };
      })
    );
  }

  function resetBoard() {
    setBoard(makeBoard());
    setSelectedIndex(0);
    setNoteMode(false);
  }

  useEffect(() => {
    cellRefs.current[selectedIndex]?.focus();
  }, [selectedIndex]);

  function getNextSelectedIndex(index: number, key: string): number {
    const row = Math.floor(index / 9);
    const column = index % 9;

    switch (key) {
      case "ArrowLeft":
        return column > 0 ? index - 1 : index;
      case "ArrowRight":
        return column < 8 ? index + 1 : index;
      case "ArrowUp":
        return row > 0 ? index - 9 : index;
      case "ArrowDown":
        return row < 8 ? index + 9 : index;
      default:
        return index;
    }
  }

  function handleCellKeyDown(index: number, key: string) {
    const nextIndex = getNextSelectedIndex(index, key);

    if (nextIndex !== index) {
      setSelectedIndex(nextIndex);
    }
  }

  return (
    <div className="sudoku-demo">
      <div className="sudoku-toolbar">
        <button type="button" onClick={toggleNoteMode} data-active={noteMode} aria-pressed={noteMode}>
          Notes {noteMode ? "On" : "Off"}
        </button>
        <button type="button" onClick={resetBoard}>
          Reset puzzle
        </button>
        <p>{isSolved ? "Board complete. No conflicts remain." : "Fill the grid without repeating numbers in a row, column, or box."}</p>
      </div>

      <div className="sudoku-grid" role="grid" aria-label="Sudoku board">
        {board.map((cell, index) => {
          const row = Math.floor(index / 9);
          const column = index % 9;
          const isSelected = selectedIndex === index;
          const cellNumber = getCellNumber(cell);
          const showAsNote = noteMode && !cell.given && cellNumber !== null;
          const hasConflict = conflicts.has(index);
          const related =
            Math.floor(selectedIndex / 9) === row ||
            selectedIndex % 9 === column ||
            (Math.floor(selectedIndex / 27) === Math.floor(index / 27) &&
              Math.floor((selectedIndex % 9) / 3) === Math.floor(column / 3));

          return (
            <button
              key={index}
              type="button"
              ref={(element) => {
                cellRefs.current[index] = element;
              }}
              className="sudoku-cell"
              tabIndex={isSelected ? 0 : -1}
              data-selected={isSelected}
              data-related={related && !isSelected}
              data-given={cell.given}
              data-conflict={hasConflict}
              data-note={showAsNote}
              aria-label={getCellAriaLabel(index, cell, { conflict: hasConflict, showAsNote, cellNumber })}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={(event) => {
                if (event.key.startsWith("Arrow")) {
                  event.preventDefault();
                  handleCellKeyDown(index, event.key);
                }
              }}
            >
              {cellNumber !== null ? (
                showAsNote ? <small>{cellNumber}</small> : <span>{cellNumber}</span>
              ) : (
                <small>{cell.notes.join(" ")}</small>
              )}
            </button>
          );
        })}
      </div>

      <div className="sudoku-keypad" aria-label="Sudoku controls">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
          <button key={value} type="button" onClick={() => setCellValue(value)}>
            {value}
          </button>
        ))}
        <button type="button" onClick={() => setCellValue(null)}>
          Clear
        </button>
      </div>
    </div>
  );
}
