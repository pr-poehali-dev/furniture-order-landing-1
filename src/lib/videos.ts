import { useEffect, useState } from "react";
import { getAdminPassword } from "@/lib/siteImages";

const VIDEOS_URL = "https://functions.poehali.dev/4ece7b63-b40b-488c-8424-8a4c92c1a1a3";
const CHUNK_SIZE = 2 * 1024 * 1024;
export const MAX_VIDEO_MB = 300;

export interface Video {
  id: number;
  title: string;
  video_url: string;
  poster_url: string | null;
}

async function post<T = Record<string, unknown>>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch(VIDEOS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Password": getAdminPassword() },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data as T;
}

export async function fetchVideos(): Promise<Video[]> {
  const res = await fetch(VIDEOS_URL);
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchVideos()
      .then(setVideos)
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);
  return { videos, loaded };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",", 2)[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

type Part = { PartNumber: number; ETag: string };

export async function uploadVideoFile(file: File, onProgress: (pct: number) => void): Promise<string> {
  const contentType = file.type || "video/mp4";
  const init = await post<{ key: string; uploadId: string; parts: Part[] }>({ action: "init", contentType });
  let parts: Part[] = [];
  for (let offset = 0; offset < file.size; offset += CHUNK_SIZE) {
    const data = await blobToBase64(file.slice(offset, offset + CHUNK_SIZE));
    let attempt = 0;
    for (;;) {
      try {
        const res = await post<{ parts: Part[] }>({ action: "chunk", key: init.key, uploadId: init.uploadId, parts, data });
        parts = res.parts;
        break;
      } catch (e) {
        if (++attempt >= 3) throw e;
      }
    }
    onProgress(Math.min(99, Math.round(((offset + CHUNK_SIZE) / file.size) * 100)));
  }
  const done = await post<{ url: string }>({ action: "complete", key: init.key, uploadId: init.uploadId, parts });
  onProgress(100);
  return done.url;
}

export function capturePoster(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;
    const finish = (b: Blob | null) => {
      URL.revokeObjectURL(url);
      resolve(b);
    };
    const timer = setTimeout(() => finish(null), 15000);
    video.onloadeddata = () => {
      video.currentTime = Math.min(1, (video.duration || 2) / 2);
    };
    video.onseeked = () => {
      clearTimeout(timer);
      const scale = Math.min(1, 1080 / Math.max(video.videoWidth, video.videoHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((b) => finish(b), "image/jpeg", 0.82);
    };
    video.onerror = () => {
      clearTimeout(timer);
      finish(null);
    };
  });
}

export const createVideo = (data: { title: string; video_url: string; poster_url: string | null }) =>
  post<{ id: number }>({ action: "create", ...data });
export const updateVideoTitle = (id: number, title: string) => post({ action: "update", id, title });
export const deleteVideo = (id: number) => post({ action: "delete", id });
export const reorderVideos = (ids: number[]) => post({ action: "reorder", ids });
