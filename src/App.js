import "./App.css";
import { useEffect, useReducer } from "react";
import styles from "./App.module.css";
import wordList from "./wordlist";
import { checkWord } from "./check-word";
import { CheckedGuess, UncheckedGuess } from "./game-board";
import { About } from "./About";
import { Keyboard } from "./Keyboard";
import { Victory, Loss } from "./end-game-modals";

export const appName = "/wɝdl̩/";

const start = new Date("Jan 12, 2022");
export const days = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));

export const solution = wordList[days][1];
export const solutionWord = wordList[days][0];

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
        checkWord(currentGuess, solution).forEach((result) => {
          if (newLetterMap[result.letter] !== styles[result.status]) {
            newLetterMap[result.letter] = styles[result.status];
          }
        });
        return {
          ...state,
          currentGuess: state.currentGuess + 1,
          letterMap: newLetterMap,
          win: currentGuess === solution,
          loss: state.currentGuess + 1 === 6 && currentGuess !== solution,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
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

function App() {
  const [state, dispatch] = useReducer(reduce, getInitialState());

  useEffect(() => {
    window.localStorage.setItem("gameState", JSON.stringify(state));
    if (state.error) {
      alert(state.error);
    }
  }, [state]);

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
        <Loss />
      )}
      <header>
        <About />
        <h1>{appName}</h1>
      </header>
      <main>
        {state.guesses.map((guess, i) => {
          if (i < state.currentGuess) {
            return <CheckedGuess key={i} guess={guess} solution={solution} />;
          } else {
            return <UncheckedGuess key={i} guess={guess} />;
          }
        })}
      </main>
      <Keyboard letterMap={state.letterMap} dispatch={dispatch} />
    </div>
  );
}

export default App;
