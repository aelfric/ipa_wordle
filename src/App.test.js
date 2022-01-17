import { render, screen } from '@testing-library/react';
import {Timer} from './App';
import timekeeper from 'timekeeper';


test('victory timer works at midnight', () => {
  timekeeper.freeze(new Date('2021-01-16T00:00:00.000Z'));
  render(<Timer targetDate='2021-01-16T00:00:00.000Z' />);
  const linkElement = screen.getByText(/00:00:00/i);
  expect(linkElement).toBeInTheDocument();
  timekeeper.reset();
})

test('victory timer works before midnight', () => {
  timekeeper.freeze(new Date('2021-01-15T23:00:00.000Z'));
  render(<Timer targetDate='2021-01-16T00:00:00.000Z' />);
  const linkElement = screen.getByText(/01:00:00/i);
  expect(linkElement).toBeInTheDocument();
  timekeeper.reset();
});

test('victory timer works for complex time before midnight', () => {
  timekeeper.freeze(new Date('2021-01-15T23:15:01.000Z'));
  render(<Timer targetDate='2021-01-16T00:00:00.000Z' />);
  const linkElement = screen.getByText(/00:44:59/i);
  expect(linkElement).toBeInTheDocument();
  timekeeper.reset();
});
