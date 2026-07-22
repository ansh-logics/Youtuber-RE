import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Home as HomeIcon,
  Tv,
  Clock,
  Play
} from "lucide-react";

interface VideoItem {
  id: string;
  slug: string;
  title: string;
  views: string;
  uploadedAt: string;
  duration: string;
  thumbnailUrl?: string;
  description?: string;
}

export default function Home() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"home" | "subscriptions" | "history">("home");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:3001/video").then((response) => {
      setVideos(response.data.videos || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const sidebarItems = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "subscriptions", label: "Subscriptions", icon: Tv },
    { id: "history", label: "History", icon: Clock },
  ] as const;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 text-left py-4 min-h-[85vh] relative pb-20 md:pb-4">

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col gap-5 w-52 shrink-0 select-none">
        <span className="font-lettera uppercase text-[9px] tracking-[0.2em] text-black/35 font-bold px-3">Feed</span>
        <div className="flex flex-col gap-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-[16px] transition-all cursor-pointer font-lettera uppercase text-[10px] tracking-wider font-bold
                  ${isActive
                    ? "bg-black text-white shadow-sm"
                    : "text-black/60 hover:bg-black/5 hover:text-black"
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-black/50"}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="flex md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-black/5 z-40 justify-around py-3 px-4 shadow-[0_-8px_30px_rgba(0,0,0,0.03)] select-none">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95
                ${isActive ? "text-black" : "text-black/35"}
              `}
            >
              <div className={`p-1.5 rounded-full ${isActive ? "bg-black text-white" : "bg-transparent text-black/50"}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-lettera text-[8px] tracking-wider font-bold uppercase">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Video Feed Column */}
      <div className="flex-1 flex flex-col gap-6">

        {/* Feed Title / Stats Header */}
        <div className="flex items-end justify-between border-b border-black/5 pb-3">
          <div className="flex flex-col gap-1">
            <h1 className="font-ndot57 text-2xl tracking-[0.1em] text-black uppercase">
              {activeTab === "home" ? "Home Feed" : activeTab === "subscriptions" ? "Subscriptions" : "Watch History"}
            </h1>
            <p className="font-lettera uppercase text-[9px] tracking-widest text-black/40 font-bold">
              {activeTab === "home"
                ? "Discover creative video updates"
                : activeTab === "subscriptions"
                  ? "Updates from channels you follow"
                  : "Keep track of your view activity"
              }
            </p>
          </div>
          {activeTab === "home" && !loading && (
            <span className="font-lettera uppercase text-[9px] tracking-widest text-black/35 font-bold">
              {videos.length} videos found
            </span>
          )}
        </div>

        {/* Dynamic content rendering based on selected tab */}
        {activeTab === "home" ? (
          loading ? (
            /* Skeleton Loader Grids */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="rounded-[24px] border border-black/5 bg-white/30 backdrop-blur-md p-4 flex flex-col gap-3 animate-pulse">
                  <div className="aspect-video rounded-[18px] bg-black/5" />
                  <div className="h-4 bg-black/5 rounded w-3/4 mt-1" />
                  <div className="h-3 bg-black/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            /* Empty Feed State Box */
            <div className="py-24 text-center rounded-[32px] border border-black/5 bg-white/20 backdrop-blur-xl p-8 flex flex-col items-center gap-3">
              <Tv className="w-10 h-10 text-black/25 stroke-[1.2]" />
              <span className="font-lettera text-[10px] tracking-widest text-black/45 font-bold uppercase">No videos available right now</span>
              <p className="font-grotesk text-xs text-black/40 mt-1">Be the first to upload amazing content to DotPlay!</p>
            </div>
          ) : (
            /* Video Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => navigate(`/watch?v=${video.slug}`)}
                  className="group rounded-[24px] border border-black/5 bg-white/35 hover:bg-white/50 backdrop-blur-md p-4 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] cursor-pointer flex flex-col gap-3"
                >
                  {/* Thumbnail Wrapper */}
                  <div className="aspect-video rounded-[18px] bg-black/5 overflow-hidden relative border border-black/5 flex items-center justify-center">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-black/5 flex items-center justify-center group-hover:scale-102 transition-transform duration-500">
                        <Play className="w-6 h-6 text-black/15 stroke-[1.2]" />
                      </div>
                    )}
                    {video.duration && (
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[9px] font-lettera font-bold text-white tracking-wider">
                        {video.duration}
                      </span>
                    )}
                  </div>

                  {/* Video Title and Info details */}
                  <div className="px-1 flex flex-col gap-1">
                    <h3 className="font-grotesk font-bold text-sm text-black leading-snug line-clamp-2 group-hover:text-black/75 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-1.5 font-lettera text-[9px] tracking-wider text-black/45 uppercase mt-1">
                      <span>{video.views || "0"} views</span>
                      <span>•</span>
                      <span>{video.uploadedAt || "Just now"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === "subscriptions" ? (
          /* Empty Subscriptions State Box */
          <div className="py-24 text-center rounded-[32px] border border-black/5 bg-white/20 backdrop-blur-xl p-8 flex flex-col items-center gap-3">
            <Tv className="w-10 h-10 text-black/25 stroke-[1.2]" />
            <span className="font-lettera text-[10px] tracking-widest text-black/45 font-bold uppercase">No subscriptions yet</span>
            <p className="font-grotesk text-xs text-black/40 mt-1">Channels you subscribe to will show up here.</p>
          </div>
        ) : (
          /* Empty History State Box */
          <div className="py-24 text-center rounded-[32px] border border-black/5 bg-white/20 backdrop-blur-xl p-8 flex flex-col items-center gap-3">
            <Clock className="w-10 h-10 text-black/25 stroke-[1.2]" />
            <span className="font-lettera text-[10px] tracking-widest text-black/45 font-bold uppercase">History is empty</span>
            <p className="font-grotesk text-xs text-black/40 mt-1">Videos you watch will be listed here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
