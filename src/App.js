import "./App.css";
import { useState } from "react";
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

function Guess({ guess }) {
  return (
    <ul className={styles.guess_word}>
      {Array.from(guess).map((letter, pos) => (
        <Letter key={pos} position={pos} letter={letter} />
      ))}
    </ul>
  );
}

function App() {
  const [pastGuesses, setPastGuesses] = useState([]);
  const [guess, setGuess] = useState("");
  const [letterMap, setLetterMap] = useState(new Map());

  function onclick(symbol) {
    if (guess.length < 5 && pastGuesses.length < 6) {
      setGuess(guess + symbol);
    }
  }

  function backspace() {
    setGuess(guess.substring(0, guess.length - 1));
  }

  function check() {
    if (guess.length === 5) {
      setPastGuesses([...pastGuesses, guess]);
      Array.from(guess).forEach((letter, pos) => {
        setLetterMap(
          new Map(letterMap.set(letter, checkLetter(letter, pos, solution)))
        );
      });
      if(guess === solution){
        alert("You win!")
      } else if (pastGuesses.length + 1 === 5 ){
        alert("You lose!");
      }
      setGuess("");
    }
  }

  return (
    <div className="App">
      {pastGuesses.map((gs) => (
        <Guess key={gs} guess={gs} />
      ))}
      <ul className={styles.guess_word}>
        {Array.from(guess.padEnd(5, " ")).map((letter, pos) => (
          <Letter key={pos} letter={letter} clean={true} />
        ))}
      </ul>
      {characters.map((c) => (
        <button
          className={`${styles.ipa_button} ${letterMap.get(c)}`}
          key={c}
          onClick={() => onclick(c)}
        >
          {c}
        </button>
      ))}
      <button className={styles.ipa_button} onClick={() => backspace()}>
        ⌫
      </button>
      <p>
        <button onClick={check}>Submit</button>
      </p>
    </div>
  );
}

export default App;
