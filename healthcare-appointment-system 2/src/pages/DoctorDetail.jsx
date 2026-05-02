import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function DoctorDetail() {
  const { id } = useParams();
  const doctor = useSelector(s => s.doctors.list.find(d => d.id === parseInt(id)));

  if (!doctor) return (
    <div className="page-container text-center py-20">
      <div className="text-5xl mb-4">👨‍⚕️</div>
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Doctor not found</h2>
      <Link to="/doctors" className="btn-primary mt-4 inline-block">Back to Doctors</Link>
    </div>
  );

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(doctor.rating));

  return (
    <div className="page-container max-w-4xl animate-fade-in">
      <Link to="/doctors" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 mb-6 text-sm font-medium transition-colors">
        ← Back to Doctors
      </Link>

      <div className="card p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-28 h-28 rounded-3xl object-cover shadow-lg"
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${doctor.name}&background=0694a2&color=fff&size=128`; }}
            />
            {doctor.available && (
              <div className="absolute -bottom-2 -right-2 bg-green-400 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                Available
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="font-display text-3xl text-slate-800 dark:text-white mb-1">{doctor.name}</h1>
            <p className="text-primary-500 dark:text-primary-400 font-semibold text-lg mb-2">{doctor.specialty}</p>
            <div className="flex items-center gap-2 mb-3">
              {stars.map((f, i) => (
                <svg key={i} className={`w-5 h-5 ${f ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-slate-600 dark:text-slate-300 font-semibold">{doctor.rating}</span>
              <span className="text-slate-400 text-sm">({doctor.reviewCount} reviews)</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{doctor.education}</p>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-3xl font-bold text-slate-800 dark:text-white">₹{doctor.fee}</div>
            <div className="text-slate-400 text-sm mb-4">per session</div>
            <Link
              to={doctor.available ? `/book/${doctor.id}` : '#'}
              className={`inline-block font-semibold py-3 px-6 rounded-xl transition-all shadow-md ${
                doctor.available
                  ? 'bg-primary-500 hover:bg-primary-600 text-white hover:shadow-lg active:scale-95'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {doctor.available ? '📅 Book Appointment' : '⏳ Unavailable'}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-primary-400">🏥</span> Location
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">{doctor.location}</p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-primary-400">🌐</span> Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {doctor.languages.map(l => (
              <span key={l} className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">{l}</span>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-primary-400">📅</span> Next Available
          </h3>
          <p className="text-green-600 dark:text-green-400 font-semibold">{doctor.nextAvailable}</p>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 dark:text-white text-lg mb-3">About</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{doctor.about}</p>
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Experience</p>
            <p className="font-bold text-slate-800 dark:text-white">{doctor.experience} years</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Patients Served</p>
            <p className="font-bold text-slate-800 dark:text-white">{doctor.reviewCount * 3}+</p>
          </div>
        </div>
      </div>
    </div>
  );
}
