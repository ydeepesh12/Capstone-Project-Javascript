import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bookAppointment } from '../store/slices/appointmentsSlice';
import { TIME_SLOTS, APPOINTMENT_TYPES } from '../data/mockData';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';

const STEPS = ['Select Date', 'Choose Slot', 'Your Details', 'Confirm'];

function generateDates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i + 1);
    return { date: format(d, 'yyyy-MM-dd'), display: format(d, 'EEE, dd MMM') };
  });
}

// Simulate some slots being pre-booked
const BOOKED_SLOTS = ['09:30 AM', '11:00 AM', '03:00 PM'];

export default function Booking() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const doctor = useSelector(s => s.doctors.list.find(d => d.id === parseInt(id)));
  const { user } = useSelector(s => s.auth);

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [appointmentType, setAppointmentType] = useState(APPOINTMENT_TYPES[0].id);
  const [form, setForm] = useState({
    patientName: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || '',
    reason: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const dates = generateDates();
  const selectedApptType = APPOINTMENT_TYPES.find(t => t.id === appointmentType);

  if (!doctor) return (
    <div className="page-container text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">Doctor not found</p>
      <Link to="/doctors" className="btn-primary">Browse Doctors</Link>
    </div>
  );

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = 'Name is required';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit phone required';
    if (!form.age || form.age < 1 || form.age > 120) e.age = 'Valid age required';
    if (!form.gender) e.gender = 'Gender is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !selectedDate) { toast.error('Please select a date'); return; }
    if (step === 1 && !selectedSlot) { toast.error('Please select a time slot'); return; }
    if (step === 2 && !validate()) return;
    setStep(s => s + 1);
  };

  const handleBook = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    dispatch(bookAppointment({
      patientId: user.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorAvatar: doctor.avatar,
      doctorLocation: doctor.location,
      date: selectedDate,
      timeSlot: selectedSlot,
      appointmentType: selectedApptType.label,
      fee: doctor.fee,
      ...form,
    }));
    setSubmitting(false);
    toast.success('🎉 Appointment booked successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="page-container max-w-2xl animate-fade-in">
      <Link to={`/doctors/${doctor.id}`} className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 mb-6 text-sm font-medium transition-colors">
        ← Back to Profile
      </Link>

      {/* Doctor Summary */}
      <div className="card p-4 mb-6 flex items-center gap-4">
        <img src={doctor.avatar} alt={doctor.name} className="w-14 h-14 rounded-2xl object-cover" />
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-white">{doctor.name}</h2>
          <p className="text-primary-500 text-sm">{doctor.specialty}</p>
          <p className="text-slate-500 dark:text-slate-400 text-xs">{doctor.location}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-bold text-slate-800 dark:text-white">₹{doctor.fee}</p>
          <p className="text-xs text-slate-400">per session</p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-primary-500 text-white' :
                i === step ? 'bg-primary-500 text-white ring-4 ring-primary-100 dark:ring-primary-900' :
                'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all ${i < step ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="card p-6">
        {/* Step 0 – Date */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h3 className="font-semibold text-slate-800 dark:text-white text-lg mb-1">Select Date</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">Choose your preferred appointment date</p>
            <div className="mb-5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-2">Appointment Type</label>
              <div className="grid grid-cols-2 gap-2">
                {APPOINTMENT_TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setAppointmentType(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      appointmentType === t.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-slate-200 dark:border-slate-600 hover:border-primary-300'
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{t.label}</p>
                    <p className="text-xs text-slate-400">{t.duration}</p>
                  </button>
                ))}
              </div>
            </div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-2">Available Dates</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {dates.map(d => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedDate === d.date
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-slate-200 dark:border-slate-600 hover:border-primary-300 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <p className="text-sm font-medium">{d.display}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 – Time Slot */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="font-semibold text-slate-800 dark:text-white text-lg mb-1">Choose Time Slot</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
              {selectedDate} · {selectedApptType?.label}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_SLOTS.map(slot => {
                const booked = BOOKED_SLOTS.includes(slot);
                return (
                  <button
                    key={slot}
                    disabled={booked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all ${
                      booked
                        ? 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed line-through'
                        : selectedSlot === slot
                          ? 'border-primary-500 bg-primary-500 text-white shadow-md'
                          : 'border-slate-200 dark:border-slate-600 hover:border-primary-400 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {slot}
                    {booked && <span className="block text-xs">Booked</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2 – Patient Details */}
        {step === 2 && (
          <div className="animate-fade-in space-y-4">
            <h3 className="font-semibold text-slate-800 dark:text-white text-lg mb-1">Your Details</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">Please fill in the patient information</p>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block">Full Name *</label>
              <input value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} placeholder="Enter patient full name" className="input-field" />
              {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block">Phone *</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit number" className="input-field" maxLength={10} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block">Age *</label>
                <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Age" className="input-field" min={1} max={120} />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block">Gender *</label>
              <div className="flex gap-3">
                {['Male', 'Female', 'Other'].map(g => (
                  <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))} className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.gender === g ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'}`}>
                    {g}
                  </button>
                ))}
              </div>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block">Reason for Visit (optional)</label>
              <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="Briefly describe your symptoms or concern..." rows={3} className="input-field resize-none" />
            </div>
          </div>
        )}

        {/* Step 3 – Confirm */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h3 className="font-semibold text-slate-800 dark:text-white text-lg mb-5">Confirm Appointment</h3>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Doctor', value: doctor.name },
                { label: 'Specialty', value: doctor.specialty },
                { label: 'Date', value: selectedDate },
                { label: 'Time', value: selectedSlot },
                { label: 'Type', value: selectedApptType?.label },
                { label: 'Patient', value: form.patientName },
                { label: 'Phone', value: form.phone },
                { label: 'Age / Gender', value: `${form.age} yrs / ${form.gender}` },
                { label: 'Location', value: doctor.location },
                { label: 'Consultation Fee', value: `₹${doctor.fee}`, highlight: true },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.highlight ? 'text-primary-600 dark:text-primary-400 text-base' : 'text-slate-800 dark:text-white'}`}>{value => value}{item.value}</span>
                </div>
              ))}
            </div>
            {form.reason && (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-5 text-sm text-slate-600 dark:text-slate-400 italic">
                "{form.reason}"
              </div>
            )}
            <button onClick={handleBook} disabled={submitting} className="btn-primary w-full py-3 text-base">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Booking...
                </span>
              ) : '✓ Confirm & Book Appointment'}
            </button>
          </div>
        )}

        {/* Nav buttons */}
        <div className={`flex mt-6 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="btn-secondary">← Back</button>
          )}
          {step < 3 && (
            <button onClick={handleNext} className="btn-primary">
              {step === 2 ? 'Review →' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
