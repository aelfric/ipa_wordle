import "./App.css";
import { useEffect, useReducer, useState } from "react";
import styles from "./App.module.css";
import wordList from "./wordlist";
import helpIcon from './help.svg';

const appName = "/wɝdl̩/";
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

const start = new Date("Jan 12, 2022");
const days = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));

const solution = wordList[days][1];
const solutionWord = wordList[days][0];

const wordMap = {};
wordList.forEach((word) => (wordMap[word[1]] = 1));

function reduce(state, action) {
  const guesses = [...state.guesses];
  const currentGuess = guesses[state.currentGuess];
  switch (action.type) {
    case "GUESS_LETTER":
      if (currentGuess.length < 5 && !state.win && !state.loss) {
        guesses[state.currentGuess] += action.payload;
        return { ...state, guesses: guesses, error: undefined };
      } else {
        return state;
      }
    case "BACKSPACE":
      guesses[state.currentGuess] = currentGuess.substring(
        0,
        currentGuess.length - 1
      );
      return { ...state, guesses: guesses, error: undefined };
    case "CHECK_WORD":
      if (currentGuess.length === 5) {
        if (wordMap[currentGuess] !== 1) {
          return { ...state, error: "Sorry, I don't recognize that word" };
        }
        const newLetterMap = { ...state.letterMap };
        Array.from(currentGuess).forEach((letter, pos) => {
          if (newLetterMap[letter] !== styles.correct) {
            newLetterMap[letter] = checkLetter(letter, pos, solution);
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

function Modal({ children }) {
  const [visible, setVisible] = useState("");

  requestAnimationFrame(() => {
    setVisible(styles.visible);
  });
  return (
    <div className={`${styles.modal} ${visible}`}>
      <div>{children}</div>
    </div>
  );
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

function LetterEmoji({ letter, position, clean }) {
  if (clean) {
    return "⬜";
  }
  let newState = "⬛";
  if (solution.charAt(position) === letter) {
    newState = "🟩";
  } else if (solution.includes(letter)) {
    newState = "🟨";
  }

  return newState;
}

function getInitialState() {
  const initialGameState = window.localStorage.getItem("gameState");

  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  const defaultState = {
    currentGuess: 0,
    guesses: ["", "", "", "", "", ""],
    letterMap: {},
    expiry: midnight,
  };

  if (initialGameState) {
    const savedState = JSON.parse(initialGameState);
    console.log(new Date());
    console.log(new Date(savedState.expiry));
    if (new Date() > new Date(savedState.expiry)) {
      console.log("It's a brand new day - new puzzle");
      return defaultState;
    } else {
      return savedState;
    }
  } else {
    return defaultState;
  }
}

function Timer({ targetDate }) {
  const calculateTimeLeft = () => {
    let difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <p>
      Next puzzle in {String(timeLeft.hours).padStart(2, "0")}:
      {String(timeLeft.minutes).padStart(2, "0")}:
      {String(timeLeft.seconds).padStart(2, "0")}
    </p>
  );
}

function Victory({ currentGuess, guesses, expiry }) {
  function copy() {
    const newLocal = document.getElementsByClassName(styles.emoji_share)[0];
    if (!navigator.clipboard) {
      newLocal.select();
      document.execCommand("copy");
    } else {
      navigator.clipboard
        .writeText(newLocal.textContent)
        .then(function () {
          alert("Copied to clipboard!"); // success
        })
        .catch(function () {
          alert("Could not copy result to clipboard"); // error
        });
    }
  }
  return (
    <Modal>
      <p>👏 You win! 👏</p>
      <div className={styles.emoji_share}>
        <p>
          {appName} {days + 1} {currentGuess + 1}/6 {"\n\n"}
        </p>
        {guesses.map((guess, i) => (
          <p key={i}>
            {Array.from(guess.padEnd(5, " ")).map((letter, pos) => (
              <LetterEmoji
                key={pos}
                letter={letter}
                position={pos}
                clean={i > currentGuess}
              />
            ))}
            {"\n"}
          </p>
        ))}
      </div>
      <button onClick={copy}>Share</button>
      <Timer targetDate={expiry} />
    </Modal>
  );
}

function About({ showMenu }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <aside className={`${styles.about} ${show ? styles.show : ""}`}>
        <p>
          This is inspired by{" "}
          <a href={"https://www.powerlanguage.co.uk/wordle/"}>Wordle</a> by Josh
          Wardle and a{" "}
          <a
            href={"https://twitter.com/GretchenAMcC/status/1480971953603334145"}
          >
            tweet
          </a>{" "}
          by everyone's favorite internet linguist Gretchen McCulloch.
        </p>
        <p>
          <strong>Some linguistic notes:</strong> English has many dialects and
          ideolects with various pronunciation differences. While these variants
          are all valid and important, for this game to work some standardized
          pronunciation needed to be chosen. I took the following steps to
          create the word list for this game.
        </p>
        <p>
          The CMU Pronouncing Dictionary (CMUdict) is a pronunciation corpus for
          North American English. CMUdict is written using a system called{" "}
          <a href="https://en.wikipedia.org/wiki/Arpabet">Arpabet</a>. I used an
          <a href="https://github.com/lingz/cmudict-ipa">
            open-source mapping
          </a>{" "}
          from into IPA.
        </p>
        <p>
          I filtered the IPA CMUdict to find words that were represented by five
          IPA characters. I then further filtered the list such that the written
          version of the word also appears at least once in the Brown corpus.
          Since both datasets have been normalized to lowercase, this results in
          some proper nouns being included in the word list.
        </p>
        <button className={styles.ipa_button} onClick={() => setShow(false)}>Hide</button>
      </aside>
      <button onClick={() => setShow(true)}><img src={helpIcon} alt="Help"/></button>
    </>
  );
}

function App() {
  const [state, dispatch] = useReducer(reduce, getInitialState());

  useEffect(() => {
    window.localStorage.setItem("gameState", JSON.stringify(state));
    if (state.error) {
      alert(state.error);
    }
  }, [state]);

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
      {state.win && (
        <Victory
          currentGuess={state.currentGuess}
          guesses={state.guesses}
          expiry={state.expiry}
        />
      )}
      {state.loss && (
        <Modal>
          <p>Better luck next time</p>
          <p>The word was </p>
          <p>/{solution}/</p>
          <p>("{solutionWord}")</p>
        </Modal>
      )}
      <header>
        <About hide={() => undefined} />
        <h1>{appName}</h1>
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
            className={`${styles.ipa_button} ${state.letterMap[c]}`}
            key={c}
            onClick={() => onclick(c)}
          >
            {c}
          </button>
        ))}
        <button
          className={styles.ipa_button}
          onClick={backspace}
          style={{ gridColumn: "6 /span 2" }}
        >
          ⌫
        </button>
        <button
          className={styles.ipa_button}
          onClick={check}
          style={{ gridColumn: "8 /span 3" }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default App;
