import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppointmentCard } from '../appointment-card';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '~/store/features/auth/auth-slice';

// Mock child components
vi.mock('../available-slot-details', () => ({
  AvailableSlotDetails: ({
    veterinarianName,
    veterinarianSpecialty,
    date,
    time,
  }: any) => (
    <div data-testid="slot-details">
      {veterinarianSpecialty} - {veterinarianName} - {date} {time}
    </div>
  ),
}));

vi.mock('~/components/book-appointment-form/book-appointment-popup', () => ({
  BookAppointmentPopup: ({ onClose, onBooked }: any) => (
    <div data-testid="booking-popup">
      <button
        onClick={() => {
          if (onBooked) {
            onBooked({
              veterinarianId: 'vet1',
              clinicId: 'clinic1',
              date: '2025-05-01',
              time: '10:00',
            });
          }
        }}
      >
        Confirm Booking
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock('~/components/pop-up-window/login-required-popup', () => ({
  LoginRequiredPopup: ({ onClose }: any) => (
    <div data-testid="login-popup">
      <button onClick={onClose}>Close Login Popup</button>
    </div>
  ),
}));

const createMockStore = (isAuthenticated = false) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        idToken: isAuthenticated ? 'mock-token' : null,
        isAuthenticated,
      },
    },
  });
};

describe('AppointmentCard', () => {
  const defaultProps = {
    veterinarianSpecialty: 'Cardiology',
    veterinarianName: 'Dr. Smith',
    veterinarianId: 'vet123',
    date: '2025-05-15',
    time: '10:00 AM',
    clinicAddress: '123 Main St',
    clinicId: 'clinic123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render appointment details', () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentCard {...defaultProps} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('slot-details')).toBeInTheDocument();
    expect(
      screen.getByText(/Cardiology - Dr. Smith - 2025-05-15 10:00 AM/)
    ).toBeInTheDocument();
  });

  it('should show book appointment button', () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentCard {...defaultProps} />
        </BrowserRouter>
      </Provider>
    );

    expect(
      screen.getByRole('button', { name: /Book Appointment/i })
    ).toBeInTheDocument();
  });

  it('should show login popup when unauthenticated user clicks book button', async () => {
    const store = createMockStore(false);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentCard {...defaultProps} />
        </BrowserRouter>
      </Provider>
    );

    const bookButton = screen.getByRole('button', {
      name: /Book Appointment/i,
    });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByTestId('login-popup')).toBeInTheDocument();
    });
  });

  it('should show booking popup when authenticated user clicks book button', async () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentCard {...defaultProps} />
        </BrowserRouter>
      </Provider>
    );

    const bookButton = screen.getByRole('button', {
      name: /Book Appointment/i,
    });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByTestId('booking-popup')).toBeInTheDocument();
    });
  });

  it('should call onBooked callback when booking is confirmed', async () => {
    const onBooked = vi.fn();
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentCard {...defaultProps} onBooked={onBooked} />
        </BrowserRouter>
      </Provider>
    );

    const bookButton = screen.getByRole('button', {
      name: /Book Appointment/i,
    });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByTestId('booking-popup')).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', {
      name: /Confirm Booking/i,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onBooked).toHaveBeenCalledWith({
        veterinarianId: 'vet1',
        clinicId: 'clinic1',
        date: '2025-05-01',
        time: '10:00',
      });
    });
  });

  it('should close login popup when close button is clicked', async () => {
    const store = createMockStore(false);
    const { rerender } = render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentCard {...defaultProps} />
        </BrowserRouter>
      </Provider>
    );

    const bookButton = screen.getByRole('button', {
      name: /Book Appointment/i,
    });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByTestId('login-popup')).toBeInTheDocument();
    });

    const closeLoginButton = screen.getByRole('button', {
      name: /Close Login Popup/i,
    });
    fireEvent.click(closeLoginButton);

    // After close, the popup should not be visible
    rerender(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentCard {...defaultProps} />
        </BrowserRouter>
      </Provider>
    );

    // Initially popup should not be there after rerender
    expect(screen.queryByTestId('login-popup')).not.toBeInTheDocument();
  });

  it('should close booking popup when close button is clicked', async () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentCard {...defaultProps} />
        </BrowserRouter>
      </Provider>
    );

    const bookButton = screen.getByRole('button', {
      name: /Book Appointment/i,
    });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByTestId('booking-popup')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /^Close$/ });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('booking-popup')).not.toBeInTheDocument();
    });
  });

  it('should not call onBooked if onBooked prop is not provided', async () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentCard {...defaultProps} />
        </BrowserRouter>
      </Provider>
    );

    const bookButton = screen.getByRole('button', {
      name: /Book Appointment/i,
    });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByTestId('booking-popup')).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', {
      name: /Confirm Booking/i,
    });
    // Should not throw even without onBooked callback
    expect(() => fireEvent.click(confirmButton)).not.toThrow();
  });
});
