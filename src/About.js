import { useState } from "react";
import styles from "./App.module.css";
import helpIcon from "./help.svg";

export function About() {
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
          idiolects with various pronunciation differences. While these variants
          are all valid and important, for this game to work some standardized
          pronunciation needed to be chosen. I took the following steps to
          create the word list for this game.
        </p>
        <p>
          The CMU Pronouncing Dictionary (CMUdict) is a pronunciation corpus for
          North American English. CMUdict is written using a system called{" "}
          <a href="https://en.wikipedia.org/wiki/Arpabet">Arpabet</a>. I used an{" "}
          <a href="https://github.com/lingz/cmudict-ipa">open-source mapping</a>{" "}
          from into IPA.
        </p>
        <p>
          I filtered the IPA CMUdict to find words that were represented by five
          IPA characters. I then further filtered the list such that the written
          version of the word also appears at least once in the Brown corpus.
          Since both datasets have been normalized to lowercase, this results in
          some proper nouns being included in the word list.
        </p>
        <p>
          Report bugs or feedback{" "}
          <a href="https://github.com/aelfric/ipa_wordle/issues">here</a>.
          (Maybe don't look at the word list file in that repository if you want
          to avoid spoilers).
        </p>
        <button className={styles.ipa_button} onClick={() => setShow(false)}>
          Hide
        </button>
      </aside>
      <button onClick={() => setShow(true)}>
        <img src={helpIcon} alt="Help" />
      </button>
    </>
  );
}
