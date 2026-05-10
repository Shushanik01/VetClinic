import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppointmentList } from '../appointment-list';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '~/store/features/auth/auth-slice';

// Mock child components
vi.mock('../appointment-card', () => ({
  AppointmentCard: ({ veterinarianName, onBooked }: any) => (
    <div data-testid="appointment-card">
      {veterinarianName}
      <button
        onClick={() =>
          onBooked?.({
            veterinarianId: 'vet1',
            clinicId: 'clinic1',
            date: '2025-05-01',
            time: '10:00',
          })
        }
      >
        Book
      </button>
    </div>
  ),
}));

vi.mock('../appointment-loader', () => ({
  AppointmentLoader: () => (
    <div data-testid="appointment-loader">Loading...</div>
  ),
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe('AppointmentList', () => {
  const mockAppointments = [
    {
      veterinarianSpecialty: 'Cardiology',
      veterinarianName: 'Dr. Smith',
      veterinarianId: 'vet1',
      date: '2025-05-15',
      time: '10:00',
      clinicAddress: '123 Main St',
      clinicId: 'clinic1',
    },
    {
      veterinarianSpecialty: 'Dermatology',
      veterinarianName: 'Dr. Jones',
      veterinarianId: 'vet2',
      date: '2025-05-16',
      time: '11:00',
      clinicAddress: '456 Second Ave',
      clinicId: 'clinic2',
    },
  ];

  const store = createMockStore();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when not showing and not loading', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentList appointments={[]} show={false} isLoading={false} />
        </BrowserRouter>
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should show loading spinner when loading', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentList appointments={[]} show={false} isLoading={true} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('appointment-loader')).toBeInTheDocument();
  });

  it('should show empty state when no appointments and show is true', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentList appointments={[]} show={true} isLoading={false} />
        </BrowserRouter>
      </Provider>
    );

    expect(
      screen.getByText(/No slots available for the selected criteria/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Reset Filters/i })
    ).toBeInTheDocument();
  });

  it('should call onResetFilters when reset button is clicked', () => {
    const onResetFilters = vi.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentList
            appointments={[]}
            show={true}
            isLoading={false}
            onResetFilters={onResetFilters}
          />
        </BrowserRouter>
      </Provider>
    );

    const resetButton = screen.getByRole('button', { name: /Reset Filters/i });
    fireEvent.click(resetButton);

    expect(onResetFilters).toHaveBeenCalled();
  });

  it('should render header with appointment count', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentList
            appointments={mockAppointments}
            show={true}
            isLoading={false}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Available Appointments/i)).toBeInTheDocument();
    expect(screen.getByText(/2 slots available/i)).toBeInTheDocument();
  });

  it('should render all appointment cards', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentList
            appointments={mockAppointments}
            show={true}
            isLoading={false}
          />
        </BrowserRouter>
      </Provider>
    );

    const cards = screen.getAllByTestId('appointment-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByText('Dr. Jones')).toBeInTheDocument();
  });

  it('should pass appointment data to cards', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentList
            appointments={mockAppointments}
            show={true}
            isLoading={false}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByText('Dr. Jones')).toBeInTheDocument();
  });

  it('should call onBooked callback from appointment card', () => {
    const onBooked = vi.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentList
            appointments={mockAppointments}
            show={true}
            isLoading={false}
            onBooked={onBooked}
          />
        </BrowserRouter>
      </Provider>
    );

    const bookButtons = screen.getAllByRole('button', { name: /Book/ });
    fireEvent.click(bookButtons[0]);

    expect(onBooked).toHaveBeenCalledWith({
      veterinarianId: 'vet1',
      clinicId: 'clinic1',
      date: '2025-05-01',
      time: '10:00',
    });
  });

  it('should show loading state even if appointments exist', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentList
            appointments={mockAppointments}
            show={true}
            isLoading={true}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('appointment-loader')).toBeInTheDocument();
    expect(
      screen.queryByText(/Available Appointments/i)
    ).not.toBeInTheDocument();
  });

  it('should render correct slot count singular', () => {
    const singleAppointment = [mockAppointments[0]];
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppointmentList
            appointments={singleAppointment}
            show={true}
            isLoading={false}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/1 slots available/i)).toBeInTheDocument();
  });
});
