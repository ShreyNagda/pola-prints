"use client";

import { FilePicker } from "@/components/FilePicker";
import { exportDivToCanvas } from "@/utils/exportDivToCanvas";
import { useRef, useState } from "react";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("Caption");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const polaroidRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (polaroidRef.current) {
      const canvas = await exportDivToCanvas(polaroidRef.current);
      const link = document.createElement("a");
      link.download = "polaroid.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <div
        ref={polaroidRef}
        className="h-[280px] w-[230px] bg-white flex flex-col items-center p-[15px]"
      >
        <div className="h-[200px] w-[200px] bg-black text-white">
          {imageFile == null ? (
            <FilePicker setImage={setImageFile} />
          ) : (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="image"
              className="h-full w-full object-cover object-center"
            />
          )}
        </div>
        <div className="w-full text-left">
          <input
            type="text"
            className="text-[20px] font-light w-full border-none outline-none"
            style={{ fontFamily: "'Pacifico', cursive" }}
            value={caption}
            name="caption"
            onChange={(ev) => setCaption(ev.target.value)}
          />
          <input
            type="date"
            className="text-[15px] font-light w-full border-none outline-none bg-transparent"
            value={date}
            name="date"
            onChange={(ev) => setDate(ev.target.value)}
          />
        </div>
      </div>

      <button
        className="bg-white disabled:bg-white/40 px-4 py-2 rounded-full"
        onClick={handleDownload}
        disabled={imageFile == null}
      >
        Capture Polaroid
      </button>
    </div>
  );
}
