"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { PolaroidFrame } from "@/components/PolaroidFrame";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import colorList from "@/utils/color";
import fontList from "@/utils/fonts";
import { exportDivToCanvas } from "@/utils/exportDivToCanvas";

export default function Create() {
  const polaroidRef = useRef<HTMLDivElement>(null);

  // const [caption, setCaption] = useState("Your Caption");
  // const [date, setDate] = useState("");
  // const [imageAfterCrop, setImageAfterCrop] = useState<string | null>(null);
  // const [imageFile, setImageFile] = useState<string | null>(null);
  const [showDate, setShowDate] = useState(true);
  const [fontIndex, setFontIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);

  const handleFontChange = useCallback((value: string) => {
    const index = fontList.findIndex((f) => f.font.className === value);
    if (index !== -1) setFontIndex(index);
  }, []);

  const handleColorChange = useCallback((value: string) => {
    const index = colorList.findIndex((c) => c.name === value);
    if (index !== -1) setFrameIndex(index);
  }, []);

  const reset = useCallback(() => {
    setShowDate(true);
    setFontIndex(0);
    setFrameIndex(0);
  }, []);

  const handleDownload = useCallback(async () => {
    if (polaroidRef.current?.querySelector("img")) {
      const canvas = await exportDivToCanvas(polaroidRef.current);
      const link = document.createElement("a");
      link.download = "polaroid.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Polaroid created successfully!");
    } else {
      toast.error("Please upload an image first!");
    }
  }, []);

  const handleShare = async () => {
    if (polaroidRef.current && polaroidRef.current.querySelector("img")) {
      const canvas = await exportDivToCanvas(polaroidRef.current);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Failed to prepare image for sharing.");
          return;
        }
        const file = new File([blob], "polaroid.png", { type: "image/png" });
        if (navigator.share) {
          try {
            await navigator.share({
              title: "My Polaroid",
              files: [file],
            });
            toast.success("Shared successfully!");
          } catch (error) {
            console.log(error);
            toast.error("Sharing failed.");
          }
        } else {
          toast.error("Sharing not supported on this device.");
        }
      });
    } else {
      toast.error("Please upload an image first!");
    }
  };

  const currentColor = colorList[frameIndex];
  const currentFont = fontList[fontIndex];

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-[#b78784] via-[#8e6e68] to-[#000]">
      <div className="w-full max-w-xs md:max-w-md p-4  rounded-xl flex flex-col items-center gap-4">
        <PolaroidFrame
          polaroidRef={polaroidRef}
          showDate={showDate}
          frameColor={currentColor.frame}
          textColor={currentColor.text}
          fontFamily={currentFont.font.className}
          dateFontFamily={currentFont.secondary.className}
          reset={reset}
        />

        <div className="flex gap-2 items-center justify-center">
          <label htmlFor="showDate">Show Date</label>
          <Checkbox
            id="showDate"
            className="border-white"
            checked={showDate}
            onCheckedChange={() => setShowDate((prev) => !prev)}
          />
        </div>

        <Select
          defaultValue={currentFont.font.className}
          onValueChange={handleFontChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {fontList.map((font, idx) => (
              <SelectItem key={idx} value={font.font.className}>
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-3 gap-2 w-full">
          {colorList.map((color, idx) => (
            <div
              key={idx}
              className={`rounded cursor-pointer p-1 ${
                idx === frameIndex ? "border" : ""
              }`}
              onClick={() => handleColorChange(color.name)}
            >
              <div
                className="text-center py-2 px-1 rounded"
                style={{ backgroundColor: color.frame, color: color.text }}
              >
                {color.name}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 w-full">
          <Button onClick={handleDownload} className="w-full ">
            Capture Polaroid
          </Button>
          <Button variant="outline" onClick={handleShare} className="w-full">
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
