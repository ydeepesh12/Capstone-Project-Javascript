import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SPECIALTIES, DOCTORS } from '../data/mockData';

const SPECIALTY_ICONS = {
  Cardiologist: '❤️', Dermatologist: '🌿', Neurologist: '🧠',
  Orthopedic: '🦴', Pediatrician: '👶', Psychiatrist: '🧘',
  'General Physician': '🩺', Gynecologist: '🌸', Ophthalmologist: '👁️',
};

const FEATURES = [
  { icon: '🔒', title: 'Secure & Private', desc: 'Your health data is encrypted and never shared.' },
  { icon: '⚡', title: 'Instant Booking', desc: 'Book appointments in under 60 seconds.' },
  { icon: '📱', title: 'Smart Dashboard', desc: 'Track all your appointments in one place.' },
  { icon: '🩺', title: 'Top Doctors', desc: 'Verified specialists across 15+ specialties.' },
];

export default function Home() {
  const { isAuthenticated } = useSelector(s => s.auth);
  const topDoctors = DOCTORS.filter(d => d.rating >= 4.8).slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-teal-400 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-teal-200 rounded-full blur-3xl" />
        </div>
        <div className="page-container relative z-10 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              🏥 India's Trusted Healthcare Platform
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Your Health, <br />Our Priority
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Book appointments with top-rated doctors instantly. Manage your health journey with ease — from search to consultation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/doctors" className="bg-white text-primary-600 font-semibold py-3 px-6 rounded-xl hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl active:scale-95">
                Find Doctors →
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all border border-white/30">
                  Create Account
                </Link>
              )}
            </div>
            <div className="flex items-center gap-6 mt-10 text-white/80 text-sm">
              <div className="flex items-center gap-1.5"><span className="text-white font-bold text-lg">9+</span> Specialties</div>
              <div className="w-px h-4 bg-white/30" />
              <div className="flex items-center gap-1.5"><span className="text-white font-bold text-lg">4.8★</span> Avg Rating</div>
              <div className="w-px h-4 bg-white/30" />
              <div className="flex items-center gap-1.5"><span className="text-white font-bold text-lg">500+</span> Happy Patients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="page-container">
        <div className="text-center mb-10">
          <h2 className="section-title">Browse by Specialty</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Find the right specialist for your needs</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 animate-stagger">
          {SPECIALTIES.filter(s => s !== 'All').map(s => (
            <Link
              key={s}
              to={`/doctors?specialty=${encodeURIComponent(s)}`}
              className="card p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="text-3xl mb-2">{SPECIALTY_ICONS[s] || '🩺'}</div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors leading-tight">{s}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Doctors */}
      <section className="bg-slate-100 dark:bg-slate-800/50 py-14">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Top Rated Doctors</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Highest rated across all specialties</p>
            </div>
            <Link to="/doctors" className="btn-secondary text-sm">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-stagger">
            {topDoctors.map(doc => (
              <div key={doc.id} className="card p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <img src={doc.avatar} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{doc.name}</h3>
                    <p className="text-primary-500 text-xs font-medium">{doc.specialty}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-amber-400 text-xs">★</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{doc.rating}</span>
                      <span className="text-xs text-slate-400">({doc.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">₹{doc.fee}</span>
                  <Link to={`/book/${doc.id}`} className="btn-primary text-xs py-1.5 px-3">Book Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="page-container">
        <div className="text-center mb-10">
          <h2 className="section-title">Why Choose MedBook?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-stagger">
          {FEATURES.map(f => (
            <div key={f.title} className="card p-6 text-center hover:shadow-md transition-all duration-200">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="page-container pb-16">
          <div className="bg-gradient-to-r from-primary-500 to-teal-500 rounded-3xl p-10 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>
            <h2 className="font-display text-3xl mb-3 relative z-10">Ready to take charge of your health?</h2>
            <p className="text-white/80 mb-6 relative z-10">Create your free account and book your first appointment today.</p>
            <Link to="/register" className="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-xl hover:bg-primary-50 transition-all shadow-lg relative z-10">
              Get Started Free
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
