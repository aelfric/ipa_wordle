import "./App.css";
import { useReducer, useState } from "react";
import styles from "./App.module.css";
import wordList from './wordlist'

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

const start = new Date("Jan 12, 2022")
const days = Math.floor((new Date() - start) / (1000*60*60*24))

const solution = wordList[days][1];

const wordMap = {}
wordList.forEach (word => wordMap[word[1]] = 1)


function reduce(state, action) {
  const guesses = [...state.guesses];
  const currentGuess = guesses[state.currentGuess];
  switch (action.type) {
    case "GUESS_LETTER":
      if (currentGuess.length < 5 && !state.win && !state.loss) {
        guesses[state.currentGuess] += action.payload;
        return { ...state, guesses: guesses };
      } else {
        return state;
      }
    case "BACKSPACE":
      guesses[state.currentGuess] = currentGuess.substring(
        0,
        currentGuess.length - 1
      );
      return { ...state, guesses: guesses };
    case "CHECK_WORD":
      if (currentGuess.length === 5) {
        if(wordMap[currentGuess] !== 1){
          alert("not a word")
          return state;
        }
        const newLetterMap = new Map(state.letterMap);
        Array.from(currentGuess).forEach((letter, pos) => {
          if (newLetterMap.get(letter) !== styles.correct) {
            newLetterMap.set(letter, checkLetter(letter, pos, solution));
          }
        });
        return {
          ...state,
          currentGuess: state.currentGuess + 1,
          letterMap: newLetterMap,
          win: currentGuess === solution,
          loss: state.currentGuess + 1 === 6,
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

function Modal({children}){
  const [visible, setVisible] = useState("")

  requestAnimationFrame(()=>{
    setVisible(styles.visible)
  })
  return <div className={`${styles.modal} ${visible}`}>
    {children}
  </div>
}

function Letter({ letter, position, clean }) {
  const [state, setState] = useState(styles.clean);

  if (!clean) {
    let newState = styles.incorrect;
    if (solution.charAt(position) === letter) {
      newState = styles.correct;
    } else if (solution.includes(letter)) {
      newState = styles.partial;
    }
    requestAnimationFrame(() => {
      setState(newState);
    });
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
      {state.win && <Modal><p>👏 You win!</p></Modal>}
      {state.loss && <Modal><p>Better luck next time</p></Modal>}
      <header>
        <h1>/wɚdl̩/</h1>
      </header>
      <main>
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
      </main>
      <div className={styles.keyboard}>
        {characters.map((c) => (
          <button
            className={`${styles.ipa_button} ${state.letterMap.get(c)}`}
            key={c}
            onClick={() => onclick(c)}
          >
            {c}
          </button>
        ))}
        <button className={styles.ipa_button} onClick={backspace} style={{gridColumn: "6 /span 2"}}>
          ⌫
        </button>
        <button className={styles.ipa_button} onClick={check} style={{gridColumn: "8 /span 3"}}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default App;
