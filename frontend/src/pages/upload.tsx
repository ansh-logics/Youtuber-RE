import axios from "axios";
import { useEffect, useState } from "react";
import { Check, FileVideo, Image as ImageIcon, Loader2, Save, UploadCloud } from "lucide-react";
export default function Upload() {
  const [video, setVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formNumber, setFormNumber] = useState<any>(0);
  const [thumbnailUpload, setThumbnailUpload] = useState<boolean>(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null | undefined>(null);
  const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [desc, setDesc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  let formData = {
    title: "",
    desc: "",
    videoUrl: "",
    thumbnailUrl: "",
    isDraft: false,
  };
  const createForm = () =>{
      formData.title = title ?? ""
      formData.desc = desc ?? "" 
      formData.videoUrl = videoUrl ?? ""
      formData.thumbnailUrl = thumbnailUrl ?? ""
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const videoUploadData = new FormData();

    if (!video) return;

    videoUploadData.append("video", video);

    setLoading(true);
    setFormNumber(1);
    try {
      let token = localStorage.getItem("token");
      let res = await axios.post(
        "http://localhost:3001/upload/video",
        videoUploadData,
          {
              headers:{
                  Authorization:`Bearer ${token}`
              }
          }
      );

      setVideoUrl(res.data.url);
    } catch (err: any) {
      setFormNumber(0);
      setError(err.response?.data?.error || err.response?.data?.message || "Video upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setVideo(file);
    setPreviewUrl(URL.createObjectURL(file));
  };
  const handleThumbnailChange =  async (e: React.ChangeEvent<HTMLInputElement>) =>{
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setThumbnailUpload(true);
    const thumbnailData = new FormData();
    thumbnailData.append("image", file);
    setThumbnailLoading(true);
    let token = localStorage.getItem("token");
    await axios.post(
        "http://localhost:3001/upload/image",
        thumbnailData,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    ).then((res)=>{
        setThumbnailLoading(false);
        setThumbnailPreview(res.data.url);
        setThumbnailUrl(res.data.url);
    }).catch((err)=>{
        setThumbnailLoading(false);
        setThumbnailUpload(false);
        setError(err.response?.data?.error || err.response?.data?.message || "Thumbnail upload failed");
    })
  }
  const handleUpload = async ()=>{
    setError(null);
    createForm();
    let token = localStorage.getItem("token");
    await axios.post(
        "http://localhost:3001/upload/",
        formData,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    ).then(()=>{
    }).catch((err)=>{
      setError(err.response?.data?.error || err.response?.data?.message || "Upload failed");
    });
  }
  const handleDraft = async ()=>{
    createForm();
    formData.isDraft = true;
    let token = localStorage.getItem("token");
    await axios.post(
        "http://localhost:3001/upload/",
        formData,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    ).then(()=>{
    }).catch((err)=>{
      setError(err.response?.data?.error || err.response?.data?.message || "Upload failed");
    });
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  return (
    <div className="w-full max-w-6xl mx-auto py-6 md:py-10 text-left">
      <div className="flex flex-col gap-7">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between border-b border-black/5 pb-6">
          <div className="flex flex-col gap-2">
            <span className="font-lettera text-[9px] font-bold uppercase tracking-[0.22em] text-black/35">
              Creator studio / New upload
            </span>
            <h1 className="font-ndot57 text-3xl md:text-4xl uppercase tracking-[0.1em] text-black">
              Upload video
            </h1>
            <p className="font-grotesk text-sm text-black/45 max-w-xl">
              Add your media, shape the details, and publish when everything feels right.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-black/5 bg-white/45 backdrop-blur-xl p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            {[
              { number: 0, label: "Media" },
              { number: 1, label: "Details" },
            ].map((step) => {
              const isActive = formNumber === step.number;
              const isComplete = formNumber > step.number;
              return (
                <div
                  key={step.number}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-2 transition-colors ${
                    isActive ? "bg-black text-white" : "text-black/35"
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current font-lettera text-[8px] font-bold">
                    {isComplete ? <Check className="h-3 w-3" /> : `0${step.number + 1}`}
                  </span>
                  <span className="font-lettera text-[9px] font-bold uppercase tracking-widest">{step.label}</span>
                </div>
              );
            })}
          </div>
        </header>

        {error ? (
          <div role="alert" className="rounded-[18px] border border-red-500/15 bg-red-500/[0.04] px-5 py-3 font-lettera text-[10px] font-bold uppercase tracking-wider text-red-700">
            {error}
          </div>
        ) : null}

        {formNumber === 0 ? (
          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <label
              htmlFor="video"
              className="group min-h-[360px] cursor-pointer rounded-[32px] border border-dashed border-black/15 bg-white/35 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all hover:border-black/30 hover:bg-white/55 flex flex-col items-center justify-center text-center"
            >
              <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-sm transition-transform group-hover:-translate-y-1">
                <UploadCloud className="h-6 w-6" />
              </span>
              <span className="font-ndot57 text-xl uppercase tracking-[0.1em] text-black">Select your video</span>
              <span className="mt-2 max-w-xs font-grotesk text-xs leading-relaxed text-black/40">
                Choose a video file from your device. You can preview it before continuing.
              </span>
              <span className="mt-7 rounded-full border border-black/10 bg-white px-4 py-2 font-lettera text-[9px] font-bold uppercase tracking-widest text-black/60">
                Browse files
              </span>
              {video ? (
                <span className="mt-4 max-w-full truncate rounded-full bg-black/[0.04] px-3 py-1.5 font-lettera text-[8px] uppercase tracking-wider text-black/45">
                  {video.name}
                </span>
              ) : null}
              <input id="video" name="video" type="file" accept="video/*" onChange={handleVideoChange} className="sr-only" />
            </label>

            <section className="rounded-[32px] border border-black/5 bg-white/40 backdrop-blur-xl p-4 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col gap-5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                  <FileVideo className="h-4 w-4 text-black/45" />
                  <span className="font-lettera text-[9px] font-bold uppercase tracking-widest text-black/45">Preview</span>
                </div>
                <span className="font-lettera text-[8px] font-bold uppercase tracking-wider text-black/25">Local media</span>
              </div>

              <div className="aspect-video overflow-hidden rounded-[24px] border border-black/5 bg-black/[0.03] flex items-center justify-center">
                {previewUrl ? (
                  <video src={previewUrl} controls className="h-full w-full object-contain bg-black" />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-black/20">
                    <FileVideo className="h-9 w-9 stroke-[1.2]" />
                    <span className="font-lettera text-[9px] font-bold uppercase tracking-widest">No media selected</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!video || loading}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 font-lettera text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-black/85 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-black/20"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                {loading ? "Uploading media" : "Upload & continue"}
              </button>
            </section>
          </form>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[32px] border border-black/5 bg-white/40 backdrop-blur-xl p-4 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col gap-5">
              <div className="flex items-center justify-between px-1">
                <span className="font-lettera text-[9px] font-bold uppercase tracking-widest text-black/45">Uploaded media</span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-lettera text-[8px] font-bold uppercase tracking-wider text-emerald-700">
                  {loading ? "Processing" : "Ready"}
                </span>
              </div>
              <div className="aspect-video overflow-hidden rounded-[24px] border border-black/5 bg-black flex items-center justify-center">
                {loading ? (
                  <div className="flex flex-col items-center gap-3 text-white/70">
                    <Loader2 className="h-7 w-7 animate-spin" />
                    <span className="font-lettera text-[9px] font-bold uppercase tracking-widest">Uploading video</span>
                  </div>
                ) : (
                  <video src={videoUrl ?? undefined} controls className="h-full w-full object-contain" />
                )}
              </div>
              <div className="rounded-[20px] border border-black/5 bg-black/[0.02] px-4 py-3">
                <span className="font-lettera text-[8px] font-bold uppercase tracking-widest text-black/30">Source file</span>
                <p className="mt-1 truncate font-grotesk text-xs text-black/65">{video?.name || "Uploaded video"}</p>
              </div>
            </section>

            <form className="rounded-[32px] border border-black/5 bg-white/40 backdrop-blur-xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col gap-5">
              <div className="border-b border-black/5 pb-4">
                <span className="font-lettera text-[9px] font-bold uppercase tracking-widest text-black/35">Metadata</span>
                <h2 className="mt-1 font-ndot57 text-2xl uppercase tracking-[0.08em] text-black">Video details</h2>
              </div>

              <label className="flex flex-col gap-2">
                <span className="font-lettera text-[9px] font-bold uppercase tracking-widest text-black/45">Title</span>
                <input
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your video a title"
                  className="w-full rounded-[18px] border border-black/10 bg-black/[0.02] px-4 py-3 font-grotesk text-sm text-black outline-none transition-colors placeholder:text-black/25 focus:border-black/30"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-lettera text-[9px] font-bold uppercase tracking-widest text-black/45">Description</span>
                <textarea
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Tell viewers what this video is about"
                  rows={5}
                  className="w-full resize-none rounded-[18px] border border-black/10 bg-black/[0.02] px-4 py-3 font-grotesk text-sm leading-relaxed text-black outline-none transition-colors placeholder:text-black/25 focus:border-black/30"
                />
              </label>

              {thumbnailUpload ? (
                <div className="relative aspect-video overflow-hidden rounded-[20px] border border-black/5 bg-black/[0.03]">
                  {thumbnailLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-black/40">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="font-lettera text-[8px] font-bold uppercase tracking-widest">Uploading thumbnail</span>
                    </div>
                  ) : (
                    <img src={(thumbnailPreview || thumbnailUrl) ?? undefined} alt="Video thumbnail preview" className="h-full w-full object-cover" />
                  )}
                </div>
              ) : (
                <label htmlFor="thumbnail" className="group flex cursor-pointer items-center gap-4 rounded-[20px] border border-dashed border-black/15 bg-black/[0.015] p-4 transition-colors hover:border-black/30 hover:bg-black/[0.03]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-black/50 group-hover:bg-black group-hover:text-white transition-colors">
                    <ImageIcon className="h-4 w-4" />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-lettera text-[9px] font-bold uppercase tracking-widest text-black/60">Upload thumbnail</span>
                    <span className="font-grotesk text-xs text-black/35">Choose a clear 16:9 cover image</span>
                  </span>
                  <input id="thumbnail" name="thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} className="sr-only" />
                </label>
              )}

              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleDraft}
                  className="flex items-center justify-center gap-2 rounded-full border border-black/10 bg-transparent py-3.5 font-lettera text-[9px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-black/5"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  className="flex items-center justify-center gap-2 rounded-full bg-black py-3.5 font-lettera text-[9px] font-bold uppercase tracking-widest text-white transition-all hover:bg-black/85 active:scale-[0.99]"
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  Publish video
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
