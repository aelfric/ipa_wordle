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
    "ɹ",
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

export function Keyboard({ letterMap, dispatch }) {
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
    <div className={styles.keyboard}>
      {characters.map((c) => (
        <button
          className={`${styles.ipa_button} ${letterMap[c]}`}
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
  );
}
