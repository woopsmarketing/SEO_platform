interface DownloadItem {
  id: string;
  type: string;
  filename: string;
  content: string;
  url?: string;
  createdAt: string;
}

export function saveDownload(item: Omit<DownloadItem, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  const downloads = getDownloads();
  const newItem: DownloadItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  downloads.unshift(newItem);
  if (downloads.length > 50) downloads.pop();
  localStorage.setItem("seoworld_downloads", JSON.stringify(downloads));
}

export function getDownloads(): DownloadItem[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("seoworld_downloads");
  return saved ? JSON.parse(saved) : [];
}

export function removeDownload(id: string) {
  if (typeof window === "undefined") return;
  const downloads = getDownloads().filter((d) => d.id !== id);
  localStorage.setItem("seoworld_downloads", JSON.stringify(downloads));
}

export function clearDownloads() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("seoworld_downloads");
}

export type { DownloadItem };
