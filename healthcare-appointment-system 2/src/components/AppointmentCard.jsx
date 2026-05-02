import { useDispatch } from 'react-redux';
import { cancelAppointment, deleteAppointment, markCompleted } from '../store/slices/appointmentsSlice';
import { STATUS_CONFIG } from '../data/mockData';
import toast from 'react-hot-toast';

export default function AppointmentCard({ appointment }) {
  const dispatch = useDispatch();
  const statusCfg = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending;

  const handleCancel = () => {
    if (window.confirm('Cancel this appointment?')) {
      dispatch(cancelAppointment(appointment.id));
      toast.error('Appointment cancelled');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Permanently delete this record?')) {
      dispatch(deleteAppointment(appointment.id));
      toast.success('Record deleted');
    }
  };

  const handleComplete = () => {
    dispatch(markCompleted(appointment.id));
    toast.success('Marked as completed ✓');
  };

  return (
    <div className="card p-5 hover:shadow-md transition-all duration-300 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <img
            src={appointment.doctorAvatar}
            alt={appointment.doctorName}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${appointment.doctorName}&background=0694a2&color=fff`; }}
          />
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{appointment.doctorName}</h3>
            <p className="text-primary-500 dark:text-primary-400 text-xs font-medium">{appointment.doctorSpecialty}</p>
            <span className={`badge mt-1 ${statusCfg.color}`}>{statusCfg.label}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-slate-800 dark:text-white">{appointment.date}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{appointment.timeSlot}</p>
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-1">₹{appointment.fee}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <span>🏥</span> {appointment.doctorLocation}
          </span>
          <span className="flex items-center gap-1">
            <span>📋</span> {appointment.appointmentType}
          </span>
        </div>

        {appointment.reason && (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-3">
            "{appointment.reason}"
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {appointment.status === 'confirmed' && (
            <>
              <button onClick={handleComplete} className="text-xs py-1.5 px-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                ✓ Mark Done
              </button>
              <button onClick={handleCancel} className="text-xs py-1.5 px-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                ✕ Cancel
              </button>
            </>
          )}
          {(appointment.status === 'cancelled' || appointment.status === 'completed') && (
            <button onClick={handleDelete} className="text-xs py-1.5 px-3 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              🗑 Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
