import { Search, Filter, SlidersHorizontal, Bookmark, Star, MapPin, Calendar, Sparkles, Zap, Globe, Clock, CheckCircle2, Share2, TrendingUp, DollarSign, Users, ChevronDown, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

export function OpportunitiesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [savedCampaigns, setSavedCampaigns] = useState([]);

  const toggleSave = (id) => {
    setSavedCampaigns(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 pointer-events-none"></div>
        <div className="relative flex items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns, brands, categories..."
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg"
            />
          </div>
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 backdrop-blur-md border text-gray-700 rounded-2xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-semibold ${
              showFilters ? 'bg-purple-100/80 border-purple-300' : 'bg-white/80 border-white/60'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
          {/* Sort Dropdown */}
          <button className="px-6 py-3 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-2xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-semibold">
            <SlidersHorizontal className="w-5 h-5" />
            <span>Sort By</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {/* Saved Button */}
          <button className="px-6 py-3 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-2xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-semibold">
            <Bookmark className="w-5 h-5" />
            <span>Saved</span>
          </button>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="grid grid-cols-4 gap-4">
        {/* Trending Campaigns */}
        <div className="bg-gradient-to-br from-emerald-200 to-emerald-300 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden hover:scale-105 transition-all cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/60">
            <TrendingUp className="w-6 h-6 text-emerald-700" />
          </div>
          <div className="relative pt-2">
            <div className="text-xs font-bold uppercase tracking-wide text-emerald-800 mb-2">TRENDING</div>
            <div className="text-4xl font-bold text-emerald-900 mb-2">24</div>
            <div className="text-xs font-semibold text-emerald-700">+12 today</div>
          </div>
        </div>

        {/* Recommended for You */}
        <div className="bg-gradient-to-br from-blue-200 to-blue-300 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden hover:scale-105 transition-all cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/60">
            <Sparkles className="w-6 h-6 text-blue-700" />
          </div>
          <div className="relative pt-2">
            <div className="text-xs font-bold uppercase tracking-wide text-blue-800 mb-2">FOR YOU</div>
            <div className="text-4xl font-bold text-blue-900 mb-2">18</div>
            <div className="text-xs font-semibold text-blue-700">+6 new</div>
          </div>
        </div>

        {/* High Paying */}
        <div className="bg-gradient-to-br from-orange-200 to-orange-300 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden hover:scale-105 transition-all cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/60">
            <DollarSign className="w-6 h-6 text-orange-700" />
          </div>
          <div className="relative pt-2">
            <div className="text-xs font-bold uppercase tracking-wide text-orange-800 mb-2">HIGH PAYING</div>
            <div className="text-4xl font-bold text-orange-900 mb-2">12</div>
            <div className="text-xs font-semibold text-orange-700">$5k+ average</div>
          </div>
        </div>

        {/* Closing Soon */}
        <div className="bg-gradient-to-br from-purple-200 to-purple-300 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden hover:scale-105 transition-all cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/60">
            <Clock className="w-6 h-6 text-purple-700" />
          </div>
          <div className="relative pt-2">
            <div className="text-xs font-bold uppercase tracking-wide text-purple-800 mb-2">CLOSING SOON</div>
            <div className="text-4xl font-bold text-purple-900 mb-2">8</div>
            <div className="text-xs font-semibold text-purple-700">&lt;3 days left</div>
          </div>
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Campaign Card 1 - Nike Fashion */}
        <CampaignCard
          id={1}
          brandName="Nike"
          brandInitial="N"
          rating={4.9}
          title="Summer Sportswear Launch"
          description="Looking for fashion creators to promote our new summer collection. Must have strong engagement."
          platforms={["Instagram", "Youtube"]}
          budget="$2,500"
          location="Global"
          deadline="5 days left"
          slots="3/10"
          applicants={47}
          verified={true}
          imageUrl="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
          saved={savedCampaigns.includes(1)}
          onSave={() => toggleSave(1)}
          onClick={() => setSelectedCampaign({
            id: 1,
            brandName: "Nike",
            title: "Summer Sportswear Launch",
            description: "Looking for fashion creators to promote our new summer collection. Must have strong engagement. We're seeking authentic voices who can showcase our products in lifestyle settings.",
            budget: "$2,500",
            requirements: ["10K+ followers", "Fashion/Lifestyle niche", "High engagement rate"],
            deliverables: ["3 Instagram Posts", "5 Instagram Stories", "1 YouTube Video"],
            timeline: "Campaign runs from April 15 - May 15, 2026"
          })}
        />

        {/* Campaign Card 2 - Tech Gaming */}
        <CampaignCard
          id={2}
          brandName="Lumina Gaming"
          brandInitial="LG"
          rating={4.8}
          title="Gaming Headset Review Series"
          description="We need tech reviewers for our premium gaming headset launch. Experience with audio reviews preferred."
          platforms={["Youtube", "Instagram"]}
          budget="$3,800"
          location="USA"
          deadline="12 days left"
          slots="1/5"
          applicants={89}
          verified={false}
          imageUrl="https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
          saved={savedCampaigns.includes(2)}
          onSave={() => toggleSave(2)}
          onClick={() => setSelectedCampaign({
            id: 2,
            brandName: "Lumina Gaming",
            title: "Gaming Headset Review Series",
            description: "We need tech reviewers for our premium gaming headset launch. Experience with audio reviews preferred. Looking for creators who can provide detailed, honest reviews.",
            budget: "$3,800",
            requirements: ["Tech review experience", "YouTube channel with 50K+ subs", "Professional audio setup"],
            deliverables: ["1 Full YouTube Review Video", "3 Instagram Posts", "Unboxing Content"],
            timeline: "Product ships April 10, review due by April 30, 2026"
          })}
        />

        {/* Campaign Card 3 - Wellness */}
        <CampaignCard
          id={3}
          brandName="Aura Wellness"
          brandInitial="AW"
          rating={5.0}
          title="Mindfulness App Launch"
          description="Join us in promoting mental wellness. We're looking for wellness creators passionate about mindfulness."
          platforms={["Instagram", "Facebook"]}
          budget="$1,800"
          location="Europe"
          deadline="2 days left"
          slots="8/15"
          applicants={124}
          verified={true}
          urgent={true}
          imageUrl="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
          saved={savedCampaigns.includes(3)}
          onSave={() => toggleSave(3)}
          onClick={() => setSelectedCampaign({
            id: 3,
            brandName: "Aura Wellness",
            title: "Mindfulness App Launch",
            description: "Join us in promoting mental wellness. We're looking for wellness creators passionate about mindfulness and mental health advocacy.",
            budget: "$1,800",
            requirements: ["Wellness/Mental Health niche", "Authentic storytelling", "Engaged community"],
            deliverables: ["5 Instagram Posts", "10 Instagram Stories", "1 Facebook Post"],
            timeline: "Content needed by April 8, 2026 (URGENT)"
          })}
        />

        {/* Campaign Card 4 */}
        <CampaignCard
          id={4}
          brandName="TechStyle"
          brandInitial="TS"
          rating={4.7}
          title="Smart Watch Launch Campaign"
          description="Seeking tech influencers to review our latest smartwatch with advanced health tracking features."
          platforms={["Youtube", "Instagram"]}
          budget="$3,200"
          location="Worldwide"
          deadline="8 days left"
          slots="2/8"
          applicants={65}
          verified={true}
          imageUrl="https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
          saved={savedCampaigns.includes(4)}
          onSave={() => toggleSave(4)}
          onClick={() => setSelectedCampaign({
            id: 4,
            brandName: "TechStyle",
            title: "Smart Watch Launch Campaign",
            description: "Seeking tech influencers to review our latest smartwatch with advanced health tracking features and innovative design.",
            budget: "$3,200",
            requirements: ["Tech/Gadget niche", "Previous wearable reviews", "Quality photo/video production"],
            deliverables: ["1 YouTube Unboxing", "1 Full Review Video", "5 Instagram Posts"],
            timeline: "April 15 - May 15, 2026"
          })}
        />

        {/* Campaign Card 5 */}
        <CampaignCard
          id={5}
          brandName="Pure Beauty"
          brandInitial="PB"
          rating={4.9}
          title="Skincare Routine Series"
          description="Looking for beauty creators to showcase our organic skincare line. Focus on natural beauty enthusiasts."
          platforms={["Instagram", "Facebook"]}
          budget="$2,100"
          location="USA & Canada"
          deadline="10 days left"
          slots="5/12"
          applicants={92}
          verified={true}
          imageUrl="https://images.unsplash.com/photo-1556228720-195a672e8a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
          saved={savedCampaigns.includes(5)}
          onSave={() => toggleSave(5)}
          onClick={() => setSelectedCampaign({
            id: 5,
            brandName: "Pure Beauty",
            title: "Skincare Routine Series",
            description: "Looking for beauty creators to showcase our organic skincare line. Focus on natural beauty enthusiasts who value clean ingredients.",
            budget: "$2,100",
            requirements: ["Beauty/Skincare niche", "Organic/Clean beauty focus", "25K+ followers"],
            deliverables: ["Skincare routine video/reel", "4 Instagram Posts", "Product reviews"],
            timeline: "Campaign runs April 20 - May 20, 2026"
          })}
        />

        {/* Campaign Card 6 */}
        <CampaignCard
          id={6}
          brandName="FitLife"
          brandInitial="FL"
          rating={4.6}
          title="Home Workout Equipment Review"
          description="Fitness influencers needed to demonstrate our compact home gym equipment for busy professionals."
          platforms={["Youtube", "Instagram"]}
          budget="$2,800"
          location="Global"
          deadline="15 days left"
          slots="4/10"
          applicants={58}
          verified={false}
          imageUrl="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
          saved={savedCampaigns.includes(6)}
          onSave={() => toggleSave(6)}
          onClick={() => setSelectedCampaign({
            id: 6,
            brandName: "FitLife",
            title: "Home Workout Equipment Review",
            description: "Fitness influencers needed to demonstrate our compact home gym equipment for busy professionals who want to stay fit at home.",
            budget: "$2,800",
            requirements: ["Fitness niche", "Home workout content", "Demonstration skills"],
            deliverables: ["Workout tutorial videos", "Equipment review", "4 Instagram Posts"],
            timeline: "Ongoing - flexible schedule"
          })}
        />
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-4">
        <button className="px-8 py-4 bg-white/80 backdrop-blur-md border border-white/60 text-gray-900 font-semibold rounded-2xl hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2">
          <span>Load More Opportunities</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedCampaign(null)}>
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 relative overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>

            <div className="relative p-8">
              {/* Close Button */}
              <button
                onClick={() => setSelectedCampaign(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedCampaign.title}</h2>
                <p className="text-lg text-gray-700">{selectedCampaign.brandName}</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">About This Campaign</h3>
                <p className="text-gray-700 leading-relaxed">{selectedCampaign.description}</p>
              </div>

              {/* Budget */}
              <div className="bg-gradient-to-br from-emerald-200/80 to-emerald-300/80 rounded-2xl p-4 mb-6 border border-white/60">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-5 h-5 text-emerald-800" />
                  <span className="text-sm font-semibold text-emerald-900">Campaign Budget</span>
                </div>
                <div className="text-3xl font-bold text-emerald-900">{selectedCampaign.budget}</div>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {selectedCampaign.requirements?.map((req, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Deliverables</h3>
                <ul className="space-y-2">
                  {selectedCampaign.deliverables?.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timeline */}
              <div className="bg-blue-100/80 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/60">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-800" />
                  <span className="text-sm font-semibold text-blue-900">Timeline</span>
                </div>
                <p className="text-blue-900">{selectedCampaign.timeline}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl text-lg font-bold hover:shadow-2xl transition-all hover:scale-105">
                  Apply Now
                </button>
                <button className="px-6 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



function CampaignCard({
  id,
  brandName,
  brandInitial,
  rating,
  title,
  description,
  platforms,
  budget,
  location,
  deadline,
  slots,
  applicants,
  verified,
  urgent = false,
  imageUrl,
  saved,
  onSave,
  onClick
}) {
  return (
    <div onClick={onClick} className="bg-white/40 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/60 relative hover:scale-[1.02] transition-all cursor-pointer group">
      {/* Ultra Glossy Liquid Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-white/30 via-transparent to-white/40 pointer-events-none"></div>
      
      {/* Floating Orbs */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gray-200/20 rounded-full blur-3xl"></div>
      
      {/* Image Section */}
      <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
        <img 
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          {urgent && (
            <span className="px-2.5 py-1 bg-red-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-xl border border-white/30">
              URGENT
            </span>
          )}
        </div>
        
        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all border border-white/60"
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-purple-600 text-purple-600' : 'text-gray-600'}`} />
        </button>
      </div>
      
      {/* Content Section */}
      <div className="p-4 relative">
        {/* Brand Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-xl border border-white/20">
              <span className="text-white font-bold text-base">{brandInitial}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-gray-900">{brandName}</h3>
                {verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-gray-600">{rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-gray-900 mb-2 leading-snug">{title}</h4>
        
        {/* Description */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">{description}</p>

        {/* Platforms */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1.5">
            {platforms.includes("Instagram") && (
              <div className="w-6 h-6 bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-center shadow-md border border-white/60">
                <Globe className="w-3.5 h-3.5 text-gray-700" />
              </div>
            )}
            {platforms.includes("Youtube") && (
              <div className="w-6 h-6 bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-center shadow-md border border-white/60">
                <Globe className="w-3.5 h-3.5 text-gray-700" />
              </div>
            )}
            {platforms.includes("Facebook") && (
              <div className="w-6 h-6 bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-center shadow-md border border-white/60">
                <Globe className="w-3.5 h-3.5 text-gray-700" />
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-600">{applicants} applicants</span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-bold text-gray-900">{budget}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-700">{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span className={`text-xs font-medium ${urgent ? 'text-red-600' : 'text-gray-700'}`}>{deadline}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-700">{slots}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 hover:shadow-xl transition-all">
            Apply Now
          </button>
          <button className="px-3 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}