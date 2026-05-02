import { useEffect, useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  fetchDoctors,
  setSearchQuery,
  setSpecialty,
  setSortBy,
  setPage,
  selectFilteredDoctors,
} from '../store/slices/doctorsSlice';
import { useDebounce } from '../hooks/useDebounce';
import { SPECIALTIES } from '../data/mockData';
import LoadingSpinner from '../components/LoadingSpinner';

const DoctorCard = lazy(() => import('../components/DoctorCard'));

const ITEMS_PER_PAGE = 6;

export default function Doctors() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading, error, searchQuery, selectedSpecialty, sortBy, currentPage } = useSelector(s => s.doctors);
  const filtered = useSelector(selectFilteredDoctors);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 400);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  // Handle specialty from URL params (from Home page specialty links)
  useEffect(() => {
    const sp = searchParams.get('specialty');
    if (sp) {
      dispatch(setSpecialty(sp));
      setSearchParams({});
    }
  }, []);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (error) return (
    <div className="page-container text-center py-20">
      <p className="text-red-500 text-lg">Failed to load doctors: {error}</p>
      <button onClick={() => dispatch(fetchDoctors())} className="btn-primary mt-4">Retry</button>
    </div>
  );

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title mb-1">Find Doctors</h1>
        <p className="text-slate-500 dark:text-slate-400">Browse {filtered.length} verified specialists</p>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, specialty, or location..."
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => dispatch(setSortBy(e.target.value))}
          className="input-field sm:w-48"
        >
          <option value="rating">Sort: Top Rated</option>
          <option value="fee_asc">Sort: Fee (Low-High)</option>
          <option value="fee_desc">Sort: Fee (High-Low)</option>
          <option value="experience">Sort: Most Experienced</option>
        </select>
      </div>

      {/* Specialty Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {SPECIALTIES.map(sp => (
          <button
            key={sp}
            onClick={() => dispatch(setSpecialty(sp))}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedSpecialty === sp
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-600'
            }`}
          >
            {sp}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading doctors..." />
      ) : paginated.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No doctors found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
          <button onClick={() => { dispatch(setSearchQuery('')); dispatch(setSpecialty('All')); setLocalSearch(''); }} className="btn-primary mt-4">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-stagger">
              {paginated.map(doc => <DoctorCard key={doc.id} doctor={doc} />)}
            </div>
          </Suspense>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => dispatch(setPage(currentPage - 1))}
                disabled={currentPage === 1}
                className="btn-secondary py-2 px-3 disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => dispatch(setPage(p))}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                    p === currentPage
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-primary-300'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => dispatch(setPage(currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary py-2 px-3 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
