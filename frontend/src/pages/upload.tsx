import axios, { create } from "axios";
import { useEffect, useState } from "react";
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
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl bg-[#181818] border border-[#2a2a2a] rounded-2xl shadow-2xl p-8">
        {formNumber == 0 ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Upload Video
              </h1>
              <p className="text-gray-400 mt-2">
                Choose a video to upload.
              </p>
              {error ? (
                <p className="text-sm text-red-400 mt-3">{error}</p>
              ) : null}
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-8">
                <input
                  type="file"
                  id="video"
                  name="video"
                  onChange={handleVideoChange}
                  className="block w-full text-gray-300
                    file:bg-red-600
                    file:text-white
                    file:border-0
                    file:px-4
                    file:py-2
                    file:rounded-lg
                    file:cursor-pointer
                    hover:file:bg-red-700"
                />
              </div>
  
              {previewUrl && (
                <div className="rounded-xl overflow-hidden border border-[#333] bg-black">
                  <video
                    src={previewUrl}
                    controls
                    className="w-full"
                  />
                </div>
              )}
  
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Next
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Video Details
              </h1>
              <p className="text-gray-400 mt-2">
                Complete the remaining details.
              </p>
              {error ? (
                <p className="text-sm text-red-400 mt-3">{error}</p>
              ) : null}
            </div>
  
            <form className="space-y-5">
              <input
                type="text"
                onChange={(e)=>{
                    setTitle(e.target.value);
                }}
                placeholder="Video title"
                className="w-full bg-[#242424] border border-[#3a3a3a] text-white rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />
  
              <textarea
                placeholder="Description"
                onChange={(e)=>{
                    setDesc(e.target.value);
                }}
                rows={5}
                className="w-full bg-[#242424] border border-[#3a3a3a] text-white rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />
  
              {thumbnailUpload?<div>
                 {
                    thumbnailLoading?<div>
                        Loading
                    </div>:<div>
                        <img src={thumbnailUrl ?? undefined} alt="thumbnailurl" />
                    </div>
                 }
              </div>:<div className="border-2 border-dashed border-gray-600 rounded-xl p-6">
                <label className="block text-white mb-3">
                  Upload Thumbnail
                </label>
  
                <input
                  type="file"
                  onChange={handleThumbnailChange}
                  id="thumbnail"
                  name="thumbnail"
                  className="block w-full text-gray-300
                    file:bg-gray-700
                    file:text-white
                    file:border-0
                    file:px-4
                    file:py-2
                    file:rounded-lg
                    file:cursor-pointer
                    hover:file:bg-gray-600"
                />
              </div>}
  
              {loading ? (
                <div className="text-center text-gray-300 py-10">
                  Uploading...
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-[#333] bg-black">
                  <video
                    src={videoUrl ?? undefined}
                    controls
                    className="w-full"
                  />
                </div>
              )}
  
              <div className="flex gap-4">
                <input
                  type="button"
                  value="Upload"
                  onClick={handleUpload}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl cursor-pointer transition"
                />
  
                <input
                  type="button"
                  value="Save as Draft"
                  onClick={handleDraft}
                  className="flex-1 bg-[#2b2b2b] hover:bg-[#3a3a3a] text-white py-3 rounded-xl cursor-pointer transition"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  ); 
}
