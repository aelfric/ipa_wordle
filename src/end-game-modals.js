import styles from "./App.module.css";
import { EmojiGuess } from "./game-board";
import { Timer } from "./Timer";
import { solution, solutionWord, appName, days } from "./App";
import { useState } from "react";

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

export function Victory({ currentGuess, guesses, expiry }) {
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
      <p className={styles.words}>
        /{solution}/ <br />
        ("{solutionWord}")
      </p>
      <div className={styles.emoji_share}>
        <p>
          {appName} {days + 1} {currentGuess}/6 {"\n\n"}
        </p>
        {guesses.map((guess, i) => (
          <EmojiGuess key={i} guess={guess} solution={solution} />
        ))}
      </div>
      <button onClick={copy}>Share</button>
      <Timer targetDate={expiry} />
    </Modal>
  );
}

export function Loss(){
  return <Modal>
  <p>Better luck next time</p>
  <p className={styles.words}>
    /{solution}/ <br />
    ("{solutionWord}")
  </p>
</Modal>
}