"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

const LEAFLET_FILES = [
  "/assets/images/main/leaflet-1.jpg",
  "/assets/images/main/leaflet-2.jpg",
];

export function LeafletDownloadButton() {
  const handleDownload = () => {
    LEAFLET_FILES.forEach((src, index) => {
      const link = document.createElement("a");
      link.href = src;
      link.download = src.split("/").pop() ?? `leaflet-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="self-start"
      onClick={handleDownload}
    >
      <Download className="size-4" />
      리플렛 다운로드
    </Button>
  );
}
