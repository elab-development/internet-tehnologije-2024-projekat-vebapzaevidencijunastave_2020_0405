import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';

// Mock axios
jest.mock('../api/axios', () => ({
  post: jest.fn(),
}));

const MockedLoginPage = () => (
  <BrowserRouter>
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  </BrowserRouter>
);

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('prikazuje formu za prijavu', () => {
    render(<MockedLoginPage />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lozinka/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /prijavi se/i })).toBeInTheDocument();
  });

  test('validira obavezna polja', async () => {
    render(<MockedLoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /prijavi se/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email je obavezan/i)).toBeInTheDocument();
      expect(screen.getByText(/lozinka je obavezna/i)).toBeInTheDocument();
    });
  });
});
