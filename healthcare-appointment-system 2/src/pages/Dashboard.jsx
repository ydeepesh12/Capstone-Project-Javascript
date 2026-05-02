import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserAppointments, setFilterStatus } from '../store/slices/appointmentsSlice';
import AppointmentCard from '../components/AppointmentCard';
import StatsCard from '../components/StatsCard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const STATUS_FILTERS = ['all', 'confirmed', 'completed', 'cancelled'];
const PIE_COLORS = ['#0694a2', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { user } = useSelector(s => s.auth);
  const { filterStatus } = useSelector(s => s.appointments);
  const dispatch = useDispatch();
  const appointments = useSelector(s => selectUserAppointments(s, user?.id));

  const stats = useMemo(() => ({
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    totalSpent: appointments.filter(a => a.status !== 'cancelled').reduce((s, a) => s + Number(a.fee || 0), 0),
  }), [appointments]);

  const filtered = filterStatus === 'all' ? appointments : appointments.filter(a => a.status === filterStatus);

  const pieData = [
    { name: 'Confirmed', value: stats.confirmed },
    { name: 'Completed', value: stats.completed },
    { name: 'Pending',   value: appointments.filter(a => a.status === 'pending').length },
    { name: 'Cancelled', value: stats.cancelled },
  ].filter(d => d.value > 0);

  // Monthly spend bar chart data (last 6 months from existing data)
  const monthlyData = useMemo(() => {
    const map = {};
    appointments.filter(a => a.status !== 'cancelled').forEach(a => {
      const month = a.date ? a.date.slice(0, 7) : 'Unknown';
      map[month] = (map[month] || 0) + Number(a.fee || 0);
    });
    return Object.entries(map).sort().slice(-6).map(([m, v]) => ({ month: m.slice(5), spend: v }));
  }, [appointments]);

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-1">
          👋 Welcome, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Here's an overview of your health appointments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-stagger">
        <StatsCard icon="📋" label="Total Appointments" value={stats.total} color="primary" />
        <StatsCard icon="✅" label="Confirmed" value={stats.confirmed} color="green" />
        <StatsCard icon="🏁" label="Completed" value={stats.completed} color="purple" />
        <StatsCard icon="💰" label="Total Spent" value={`₹${stats.totalSpent}`} color="amber" />
      </div>

      {/* Charts */}
      {appointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Appointment Status</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-slate-400 text-sm text-center py-8">No data yet</p>}
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Monthly Spending (₹)</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip formatter={v => [`₹${v}`, 'Spend']} />
                  <Bar dataKey="spend" fill="#0694a2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-slate-400 text-sm text-center py-8">No spending data</p>}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => dispatch(setFilterStatus(f))}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
              filterStatus === f
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-primary-300'
            }`}
          >
            {f} {f !== 'all' && `(${appointments.filter(a => a.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {appointments.length === 0 ? 'No appointments yet' : 'No appointments in this category'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {appointments.length === 0 ? 'Book your first appointment with a specialist today!' : 'Try another filter above'}
          </p>
          {appointments.length === 0 && (
            <a href="/doctors" className="btn-primary inline-block">Find Doctors →</a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-stagger">
          {filtered.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)}
        </div>
      )}
    </div>
  );
}
