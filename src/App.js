import "./App.css";
import { useReducer } from "react";
import styles from "./App.module.css";

const characters = [
  "a",
  "æ",
  "ɑ",
  "b",
  "d",
  "ð",
  "e",
  "ə",
  "ɛ",
  "ɝ",
  "f",
  "ɡ",
  "h",
  "i",
  "ɪ",
  "j",
  "k",
  "ɫ",
  "m",
  "n",
  "ŋ",
  "o",
  "ɔ",
  "p",
  "r",
  "s",
  "ʃ",
  "t",
  "u",
  "ʊ",
  "v",
  "w",
  "z",
  "ʒ",
  "θ",
];

const solution = "wɔrɡə";

function reduce(state, action) {
  const guesses = [...state.guesses];
  switch (action.type) {
    case "GUESS_LETTER":
      guesses[state.currentGuess] += action.payload;
      return { ...state, guesses: guesses };
    case "BACKSPACE":
      guesses[state.currentGuess] = guesses[state.currentGuess].substring(
        0,
        guesses[state.currentGuess].length - 1
      );
      return { ...state, guesses: guesses };
    case "CHECK_WORD":
      if (guesses[state.currentGuess].length === 5) {
        const newLetterMap = new Map(state.letterMap);
        Array.from(guesses[state.currentGuess]).forEach((letter, pos) => {
          if (newLetterMap.get(letter) !== styles.correct) {
            newLetterMap.set(letter, checkLetter(letter, pos, solution));
          }
        });
        return {
          ...state,
          currentGuess: state.currentGuess + 1,
          letterMap: newLetterMap,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}

function checkLetter(letter, position, word) {
  let state = styles.incorrect;

  if (word.charAt(position) === letter) {
    state = styles.correct;
  } else if (word.includes(letter)) {
    state = styles.partial;
  }
  return state;
}

function Letter({ letter, position, clean }) {
  let state = styles.incorrect;

  if (clean) {
    state = styles.clean;
  } else if (solution.charAt(position) === letter) {
    state = styles.correct;
  } else if (solution.includes(letter)) {
    state = styles.partial;
  }
  return <li className={`${styles.guess_letter} ${state}`}>{letter}</li>;
}

function App() {
  const [state, dispatch] = useReducer(reduce, {
    currentGuess: 0,
    guesses: ["", "", "", "", "", ""],
    letterMap: new Map(),
  });

  function onclick(symbol) {
    dispatch({ type: "GUESS_LETTER", payload: symbol });
  }

  function backspace() {
    dispatch({ type: "BACKSPACE" });
  }

  function check() {
    dispatch({ type: "CHECK_WORD" });
  }

  return (
    <div className="App">
      {state.guesses.map((guess, i) => (
        <ul key={i} className={styles.guess_word}>
          {Array.from(guess.padEnd(5, " ")).map((letter, pos) => (
            <Letter
              key={pos}
              letter={letter}
              position={pos}
              clean={i >= state.currentGuess}
            />
          ))}
        </ul>
      ))}
      {characters.map((c) => (
        <button
          className={`${styles.ipa_button} ${state.letterMap.get(c)}`}
          key={c}
          onClick={() => onclick(c)}
        >
          {c}
        </button>
      ))}
      <button className={styles.ipa_button} onClick={backspace}>
        ⌫
      </button>
      <p>
        <button onClick={check}>Submit</button>
      </p>
    </div>
  );
}

export default App;
