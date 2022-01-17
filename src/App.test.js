import { render, screen } from "@testing-library/react";
import { Timer } from "./Timer";
import { checkWord, Status } from "./check-word";
import timekeeper from "timekeeper";

describe("Victory Timer", () => {
  test("works at midnight", () => {
    timekeeper.freeze(new Date("2021-01-16T00:00:00.000Z"));
    render(<Timer targetDate="2021-01-16T00:00:00.000Z" />);
    const linkElement = screen.getByText(/00:00:00/i);
    expect(linkElement).toBeInTheDocument();
    timekeeper.reset();
  });

  test("works before midnight", () => {
    timekeeper.freeze(new Date("2021-01-15T23:00:00.000Z"));
    render(<Timer targetDate="2021-01-16T00:00:00.000Z" />);
    const linkElement = screen.getByText(/01:00:00/i);
    expect(linkElement).toBeInTheDocument();
    timekeeper.reset();
  });

  test("works for complex time before midnight", () => {
    timekeeper.freeze(new Date("2021-01-15T23:15:01.000Z"));
    render(<Timer targetDate="2021-01-16T00:00:00.000Z" />);
    const linkElement = screen.getByText(/00:44:59/i);
    expect(linkElement).toBeInTheDocument();
    timekeeper.reset();
  });
});

describe("word checker", () => {
  test("detects correct words", () => {
    const result = checkWord("hello", "hello");

    expect(result).toEqual([
      { letter: "h", status: Status.CORRECT },
      { letter: "e", status: Status.CORRECT },
      { letter: "l", status: Status.CORRECT },
      { letter: "l", status: Status.CORRECT },
      { letter: "o", status: Status.CORRECT },
    ]);
  });
  test("detects totally incorrect words", () => {
    const result = checkWord("hello", "sinks");

    expect(result).toEqual([
      { letter: "h", status: Status.INCORRECT },
      { letter: "e", status: Status.INCORRECT },
      { letter: "l", status: Status.INCORRECT },
      { letter: "l", status: Status.INCORRECT },
      { letter: "o", status: Status.INCORRECT },
    ]);
  });

  test("detects partially correct words", () => {
    const result = checkWord("hello", "ghost");

    expect(result).toEqual([
      { letter: "h", status: Status.PARTIAL },
      { letter: "e", status: Status.INCORRECT },
      { letter: "l", status: Status.INCORRECT },
      { letter: "l", status: Status.INCORRECT },
      { letter: "o", status: Status.PARTIAL },
    ]);
  });

  test("detects partially correct words with letters in right place", () => {
    const result = checkWord("share", "shire");

    expect(result).toEqual([
      { letter: "s", status: Status.CORRECT },
      { letter: "h", status: Status.CORRECT },
      { letter: "a", status: Status.INCORRECT },
      { letter: "r", status: Status.CORRECT },
      { letter: "e", status: Status.CORRECT },
    ]);
  });

  test("detects partially correct words with double letters in guess", () => {
    const result = checkWord("hello", "plane");

    expect(result).toEqual([
      { letter: "h", status: Status.INCORRECT },
      { letter: "e", status: Status.PARTIAL },
      { letter: "l", status: Status.PARTIAL },
      { letter: "l", status: Status.INCORRECT },
      { letter: "o", status: Status.INCORRECT },
    ]);
  });
});
