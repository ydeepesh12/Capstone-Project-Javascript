import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(doctor.rating));

  return (
    <div className="card p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-16 h-16 rounded-2xl object-cover"
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${doctor.name}&background=0694a2&color=fff`; }}
          />
          {doctor.available && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-slate-800 rounded-full" title="Available today" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 dark:text-white text-base truncate">{doctor.name}</h3>
          <span className="text-primary-500 dark:text-primary-400 text-sm font-medium">{doctor.specialty}</span>

          <div className="flex items-center gap-1 mt-1">
            {stars.map((filled, i) => (
              <svg key={i} className={`w-3.5 h-3.5 ${filled ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{doctor.rating} ({doctor.reviewCount})</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <svg className="w-4 h-4 text-primary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{doctor.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <svg className="w-4 h-4 text-primary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{doctor.experience} years experience</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-slate-800 dark:text-white">₹{doctor.fee}</span>
          <span className="text-xs text-slate-400 ml-1">/ session</span>
        </div>
        <div className="flex gap-2">
          <Link to={`/doctors/${doctor.id}`} className="btn-secondary text-xs py-2 px-3">
            Profile
          </Link>
          <Link
            to={doctor.available ? `/book/${doctor.id}` : '#'}
            className={`text-xs py-2 px-3 rounded-xl font-semibold transition-all duration-200 ${
              doctor.available
                ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg active:scale-95'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            {doctor.available ? 'Book Now' : 'Unavailable'}
          </Link>
        </div>
      </div>
    </div>
  );
}
