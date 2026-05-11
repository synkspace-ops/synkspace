import { CalendarDays, MapPin, Users, ChevronRight, PlusCircle, Search, Filter } from 'lucide-react';
import { motion } from "framer-motion";
import { useApp } from '../context/AppContext';

export function EventsPage() {
  const { events, navigate } = useApp();

  const totalAttendees = events.reduce((acc, event) => acc + event.attendees, 0);
  const upcomingEvents = events.filter((e) => e.status === 'upcoming').length;

  return (
    <div className="min-h-screen p-4 sm:p-6 font-sans text-slate-800 flex flex-col gap-4 sm:gap-6 w-full">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1">Events</h1>
          <p className="text-white/80 text-sm">Discover and manage creator events, summits, and meetups</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="bg-white/10 border border-white/20 text-white placeholder-white/60 text-sm rounded-full py-2.5 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold text-white transition-all shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#5A7684] hover:bg-slate-50 rounded-full text-sm font-bold transition-all shadow-sm">
            <PlusCircle className="w-4 h-4" />
            Create Event
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#6f8e97]/40 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-4 z-10 relative">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="z-10 relative">
            <p className="text-white/80 text-sm font-medium mb-1">Total Events</p>
            <h3 className="text-3xl font-bold tracking-tight mb-2">{events.length}</h3>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all pointer-events-none" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#6f8e97]/40 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-4 z-10 relative">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="z-10 relative">
            <p className="text-white/80 text-sm font-medium mb-1">Upcoming Events</p>
            <h3 className="text-3xl font-bold tracking-tight mb-2">{upcomingEvents}</h3>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all pointer-events-none" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#6f8e97]/40 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-4 z-10 relative">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="z-10 relative">
            <p className="text-white/80 text-sm font-medium mb-1">Total Expected Attendees</p>
            <h3 className="text-3xl font-bold tracking-tight mb-2">{(totalAttendees / 1000).toFixed(1)}k</h3>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all pointer-events-none" />
        </motion.div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col group hover:bg-white/80 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${event.color}`}>
                {event.type}
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                event.status === 'upcoming' ? 'bg-[#91c0cf]/20 text-[#4f8396]' :
                event.status === 'ongoing' ? 'bg-[#a3e4c7]/20 text-[#4c7569]' :
                'bg-slate-100 text-slate-500'
              }`}>
                {event.status}
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{event.title}</h3>
            
            <p className="text-sm text-slate-600 mb-5 line-clamp-2">
              {event.description}
            </p>

            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-slate-500" />
                </div>
                {event.date}
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-slate-500" />
                </div>
                {event.location}
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
                {event.attendees.toLocaleString()} Attendees
              </div>
            </div>

            <div className="flex items-center gap-3 pt-5 border-t border-white/50 mt-auto">
              <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-100 text-slate-700 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2">
                View Details
              </button>
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-2xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2">
                Register
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


