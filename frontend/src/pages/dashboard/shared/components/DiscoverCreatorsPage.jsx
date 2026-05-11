import { Search, Filter, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useApp } from '../context/AppContext';

export function DiscoverCreatorsPage() {
  const { navigate, creators } = useApp();

  return (
    <div className="min-h-screen p-4 sm:p-6 font-sans text-slate-800 flex flex-col gap-4 sm:gap-6 w-full">
      {/* Header */}
      <header className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1">Discover Creators</h1>
        <p className="text-white/80 text-sm">Find the perfect creators for your campaigns</p>
      </header>

      {/* Search and Filters */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 mb-6">
        <div className="flex gap-3 mb-5 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, niche, or location..."
              className="w-full bg-white/50 border border-white/50 rounded-2xl pl-12 pr-4 py-3.5 text-slate-800 placeholder-slate-400 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all shadow-sm"
            />
          </div>
          <button className="px-6 py-3.5 bg-white/60 border border-white/60 rounded-2xl text-slate-700 hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2 font-bold shadow-sm">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2 bg-[#6f8e97] text-white rounded-xl font-bold shadow-sm shadow-[#6f8e97]/20 border border-[#6f8e97]">
            All Creators
          </button>
          <button className="px-5 py-2 bg-white/50 border border-white/50 text-slate-700 rounded-xl hover:bg-white hover:border-white transition-all font-semibold shadow-sm">
            Fashion
          </button>
          <button className="px-5 py-2 bg-white/50 border border-white/50 text-slate-700 rounded-xl hover:bg-white hover:border-white transition-all font-semibold shadow-sm">
            Tech
          </button>
          <button className="px-5 py-2 bg-white/50 border border-white/50 text-slate-700 rounded-xl hover:bg-white hover:border-white transition-all font-semibold shadow-sm">
            Beauty
          </button>
          <button className="px-5 py-2 bg-white/50 border border-white/50 text-slate-700 rounded-xl hover:bg-white hover:border-white transition-all font-semibold shadow-sm">
            Fitness
          </button>
        </div>
      </div>

      {/* Creator Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {creators.map((creator, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:bg-white/80 transition-all group flex flex-col relative overflow-hidden"
          >
            {/* Profile */}
            <div className="flex items-start gap-5 mb-5 z-10">
              <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-2xl font-bold shadow-sm border border-white/40 ${creator.avatarColor}`}>
                {creator.name.charAt(0)}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{creator.name}</h3>
                  {creator.verified && <span className="text-[#6f8e97] bg-[#6f8e97]/10 rounded-full p-0.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>}
                </div>
                <p className="text-sm font-semibold text-slate-500 mb-1">{creator.niche}</p>
                <p className="text-xs font-medium text-slate-400">{creator.location}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/50 border border-white/50 rounded-2xl shadow-sm z-10">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Followers</p>
                <p className="text-xl font-bold text-slate-800">{creator.followers}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Engagement</p>
                <p className="text-xl font-bold text-[#f0ad9f]">{creator.engagement}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 z-10 mt-auto">
              <button onClick={() => navigate('create-campaign')} className="flex-1 px-4 py-3 bg-[#6f8e97] text-white rounded-2xl hover:bg-[#5A7684] transition-all font-bold shadow-md shadow-[#6f8e97]/20">
                Invite Creator
              </button>
              <button className="p-3 bg-white/60 border border-white/60 rounded-2xl text-slate-600 hover:bg-white hover:text-[#f0ad9f] transition-all shadow-sm">
                <Heart className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('messages')} className="p-3 bg-white/60 border border-white/60 rounded-2xl text-slate-600 hover:bg-white hover:text-[#6f8e97] transition-all shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#6f8e97]/5 rounded-full blur-2xl group-hover:bg-[#6f8e97]/10 transition-all pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}


