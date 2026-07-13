import { useEffect, useState } from "react";
import {
  Play,
  ListVideo,
  Tv,
  Edit2
} from "lucide-react";
import axios from "axios";

interface Uploads {
  id: string;
  slug: string;
  title: string;
  views: string;
  uploadedAt: string;
  duration: string;
  thumbnailUrl?: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"videos" | "playlists" | "about">("videos");
  const [isEditing, setIsEditing] = useState(false);

  const [channelName, setChannelName] = useState("");
  const [bio, setBio] = useState("");
  const [subscribers, setSubscribers] = useState("");
  const [videoCount, setVideoCount] = useState("");
  const [uploads, setUploads] = useState<Uploads[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:3001/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((response) => {
      setChannelName(response.data.data.channelName);
      setBio(response.data.data.description);
      setSubscribers(response.data.data.subscriberCount);
      setVideoCount(response.data.uploads.length);
      setUploads(response.data.uploads);
      console.log(response);
    }).catch((err) => {
      console.log(err);
    });
  }, [token]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 text-left py-6">
      
      {/* Profile Header Details Card */}
      <div className="bg-white/40 backdrop-blur-xl border border-black/5 rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        {/* Monospace Dotted Avatar Placeholder */}
        <div className="w-20 h-20 rounded-full border border-black/5 bg-black/[0.02] flex items-center justify-center relative overflow-hidden group shrink-0 select-none">
          <span className="font-ndot57 text-4xl text-black/70">
            {channelName ? channelName.charAt(0).toUpperCase() : "?"}
          </span>
        </div>

        {/* Channel Details Section */}
        <div className="flex-1 flex flex-col gap-1.5">
          <h1 className="font-ndot57 text-2xl md:text-3xl tracking-[0.1em] text-black uppercase">
            {channelName || "CHANNEL"}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-lettera text-[10px] tracking-widest text-black/45 font-bold uppercase">
            <span>@{channelName.toLowerCase().replace(/\s+/g, "")}</span>
            <span>•</span>
            <span>{subscribers || "0"} subscribers</span>
            <span>•</span>
            <span>{videoCount || "0"} videos</span>
          </div>
          {bio && (
            <p className="font-grotesk text-xs text-black/60 leading-relaxed mt-1 max-w-2xl line-clamp-2">
              {bio}
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-5 py-2.5 bg-transparent hover:bg-black/5 active:scale-98 transition-all rounded-full border border-black/10 text-[10px] font-bold font-lettera uppercase tracking-wider text-black cursor-pointer flex items-center gap-2 select-none"
        >
          <Edit2 className="w-3 h-3 text-black/50" />
          Customize
        </button>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex border-b border-black/5 gap-6 mt-4 mb-2 pb-2">
        {(["videos", "playlists", "about"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-[10px] font-bold font-lettera uppercase tracking-widest transition-all relative cursor-pointer select-none
                ${isActive ? "text-black" : "text-black/35 hover:text-black/60"}
              `}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-black rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tabs Dynamic Content */}
      <div className="min-h-[40vh] w-full">
        {activeTab === "videos" ? (
          /* Videos Tab */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {uploads.length === 0 ? (
              <div className="col-span-full py-16 text-center rounded-[32px] border border-black/5 bg-white/20 backdrop-blur-xl p-8 flex flex-col items-center gap-3">
                <Tv className="w-8 h-8 text-black/25 stroke-[1.2]" />
                <span className="font-lettera text-[10px] tracking-widest text-black/45 font-bold uppercase">No videos uploaded yet</span>
              </div>
            ) : (
              uploads.map((video) => (
                <div 
                  key={video.id}
                  onClick={() => {
                    window.location.href = "/watch?v=" + video.slug;
                  }}
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

                  {/* Metadata */}
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
              ))
            )}
          </div>
        ) : activeTab === "playlists" ? (
          /* Playlists Tab */
          <div className="py-16 text-center rounded-[32px] border border-black/5 bg-white/20 backdrop-blur-xl p-8 flex flex-col items-center gap-3">
            <ListVideo className="w-8 h-8 text-black/25 stroke-[1.2]" />
            <span className="font-lettera text-[10px] tracking-widest text-black/45 font-bold uppercase">No playlists created</span>
          </div>
        ) : (
          /* About Tab */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-[32px] border border-black/5 bg-white/20 backdrop-blur-xl p-6 md:p-8 flex flex-col gap-4">
              <h3 className="font-ndot57 text-sm tracking-[0.1em] text-black uppercase mb-1">Description</h3>
              <p className="font-grotesk text-sm text-black/70 leading-relaxed whitespace-pre-wrap">
                {bio || "No description provided."}
              </p>
            </div>

            <div className="rounded-[32px] border border-black/5 bg-white/20 backdrop-blur-xl p-6 md:p-8 flex flex-col gap-5">
              <h3 className="font-ndot57 text-sm tracking-[0.1em] text-black uppercase mb-1">Stats</h3>
              
              <div className="flex flex-col border-b border-black/5 pb-3">
                <span className="font-lettera text-[8px] tracking-widest text-black/40 font-bold uppercase">Joined</span>
                <span className="font-grotesk text-sm text-black font-semibold mt-0.5">July 13, 2026</span>
              </div>

              <div className="flex flex-col border-b border-black/5 pb-3">
                <span className="font-lettera text-[8px] tracking-widest text-black/40 font-bold uppercase">Total Views</span>
                <span className="font-grotesk text-sm text-black font-semibold mt-0.5">
                  {uploads.reduce((acc, curr) => acc + parseInt(curr.views || "0"), 0)} views
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-lettera text-[8px] tracking-widest text-black/40 font-bold uppercase">Subscribers</span>
                <span className="font-grotesk text-sm text-black font-semibold mt-0.5">{subscribers || "0"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
