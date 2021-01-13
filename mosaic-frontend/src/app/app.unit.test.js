import React from 'react';
import { screen, render, cleanup, fireEvent } from '@testing-library/react';
import App from 'app/App';

beforeAll(() => {
  render(<App />);
});

test('should have the right message in the dom', () => {
  const message = 'Hello World';
  expect(screen.getByText(message)).toBeInTheDocument();
});

afterAll(cleanup);