import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loan application form', () => {
  render(<App />);
  const headingElement = screen.getByText(/Loan Application Form/i);
  expect(headingElement).toBeInTheDocument();
}); 