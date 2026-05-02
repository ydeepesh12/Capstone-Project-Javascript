import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem('medbook_appointments');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveToStorage = (appointments) => {
  localStorage.setItem('medbook_appointments', JSON.stringify(appointments));
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    list: loadFromStorage(),
    loading: false,
    error: null,
    filterStatus: 'all',
  },
  reducers: {
    bookAppointment(state, action) {
      const newAppt = {
        ...action.payload,
        id: Date.now(),
        status: 'confirmed',
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
      };
      state.list.unshift(newAppt);
      saveToStorage(state.list);
    },
    cancelAppointment(state, action) {
      const appt = state.list.find(a => a.id === action.payload);
      if (appt) {
        appt.status = 'cancelled';
        saveToStorage(state.list);
      }
    },
    rescheduleAppointment(state, action) {
      const { id, date, timeSlot } = action.payload;
      const appt = state.list.find(a => a.id === id);
      if (appt) {
        appt.date = date;
        appt.timeSlot = timeSlot;
        appt.status = 'confirmed';
        saveToStorage(state.list);
      }
    },
    markCompleted(state, action) {
      const appt = state.list.find(a => a.id === action.payload);
      if (appt) {
        appt.status = 'completed';
        saveToStorage(state.list);
      }
    },
    deleteAppointment(state, action) {
      state.list = state.list.filter(a => a.id !== action.payload);
      saveToStorage(state.list);
    },
    setFilterStatus(state, action) {
      state.filterStatus = action.payload;
    },
  },
});

export const {
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  markCompleted,
  deleteAppointment,
  setFilterStatus,
} = appointmentsSlice.actions;

export const selectUserAppointments = (state, userId) =>
  state.appointments.list.filter(a => a.patientId === userId);

export default appointmentsSlice.reducer;
