import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DOCTORS } from '../../data/mockData';

// Simulated API call (replace with real API endpoint if available)
export const fetchDoctors = createAsyncThunk('doctors/fetchAll', async (_, { rejectWithValue }) => {
  try {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 700));
    // In production: const res = await axios.get('https://api.example.com/doctors');
    return DOCTORS;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState: {
    list: [],
    loading: false,
    error: null,
    searchQuery: '',
    selectedSpecialty: 'All',
    sortBy: 'rating',
    currentPage: 1,
    itemsPerPage: 6,
  },
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setSpecialty(state, action) {
      state.selectedSpecialty = action.payload;
      state.currentPage = 1;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDoctors.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchDoctors.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchDoctors.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { setSearchQuery, setSpecialty, setSortBy, setPage } = doctorsSlice.actions;

// Selectors
export const selectFilteredDoctors = state => {
  const { list, searchQuery, selectedSpecialty, sortBy } = state.doctors;
  let filtered = [...list];

  if (selectedSpecialty !== 'All') {
    filtered = filtered.filter(d => d.specialty === selectedSpecialty);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'fee_asc') return a.fee - b.fee;
    if (sortBy === 'fee_desc') return b.fee - a.fee;
    if (sortBy === 'experience') return b.experience - a.experience;
    return 0;
  });

  return filtered;
};

export default doctorsSlice.reducer;
