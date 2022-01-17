import styles from "./App.module.css";
import { checkWord, statusToEmoji } from "./check-word";
import { useState } from "react";

function Letter({ letter, style }) {
  const [state, setState] = useState(styles.clean);

  if (style) {
    requestAnimationFrame(() => {
      setState(style);
    });
  }

  return <li className={`${styles.guess_letter} ${state}`}>{letter}</li>;
}

export function CheckedGuess({ guess, solution }) {
  const result = checkWord(guess, solution);

  return (
    <ul className={styles.guess_word}>
      {result.map((res, i) => (
        <Letter key={i} letter={res.letter} style={styles[res.status]} />
      ))}
    </ul>
  );
}

export function EmojiGuess({ guess, solution }) {
  if (guess) {
    const result = checkWord(guess, solution);

    return (
      <p>
        {result.map((res) => statusToEmoji(res.status))}
        {"\n"}
      </p>
    );
  } else {
    return <p>⬜⬜⬜⬜⬜{"\n"}</p>;
  }
}

export function UncheckedGuess({ guess }) {
  return (
    <ul className={styles.guess_word}>
      {Array.from(guess.padEnd(5, " ")).map((letter, pos) => (
        <Letter key={pos} letter={letter} />
      ))}
    </ul>
  );
}
