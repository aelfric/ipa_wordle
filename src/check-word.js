export const Status = {
  CORRECT: "correct",
  INCORRECT: "incorrect",
  PARTIAL: "partial",
};

export function checkWord(guess, solution) {
  const solutionLetters = new Set(Array.from(solution));
  const guessLetters = Array.from(guess);
  const result = [];
  // First pass to identify letters in correct place
  for (let i = 0; i < guessLetters.length; i++) {
    const letter = guessLetters[i];
    if (solution.charAt(i) === letter) {
      solutionLetters.delete(letter);
      result.push(Status.CORRECT);
    } else {
      result.push(undefined);
    }
  }

  // Second pass to identify correct letters in wrong place
  for (let i = 0; i < guessLetters.length; i++) {
    const letter = guessLetters[i];
    if (!result[i]) {
      if (solutionLetters.has(letter)) {
        solutionLetters.delete(letter);
        result[i] = Status.PARTIAL;
      } else {
        result[i] = Status.INCORRECT;
      }
    }
  }
  return guessLetters.map((letter, pos) => ({ letter, status: result[pos] }));
}

export function statusToEmoji(status) {
  switch (status) {
    case Status.CORRECT:
      return "🟩";
    case Status.INCORRECT:
      return "⬛";
    case Status.PARTIAL:
      return "🟨";
    default:
      return "⬜";
  }
}
