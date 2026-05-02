export default function StatsCard({ icon, label, value, color = 'primary', trend }) {
  const colors = {
    primary: 'from-primary-400 to-primary-600',
    green:   'from-green-400 to-emerald-600',
    amber:   'from-amber-400 to-orange-500',
    red:     'from-red-400 to-rose-600',
    purple:  'from-purple-400 to-violet-600',
  };

  return (
    <div className="card p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white text-xl shadow-md flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        {trend && <p className="text-xs text-green-500 font-medium mt-0.5">{trend}</p>}
      </div>
    </div>
  );
}
