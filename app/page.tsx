"use client";

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
import { exportDivToCanvas } from "@/utils/exportDivToCanvas";
import fontList from "@/utils/fonts";
import { useRef, useState } from "react";
import { toast } from "sonner";

export type FontStyle = {
  name: string;
  fontFamily: string;
  secondaryFont?: string; // optional secondary font
};

export default function Home() {
  const [showDate, setShowDate] = useState(true);
  const polaroidRef = useRef<HTMLDivElement>(null);

  const [fontIndex, setFontIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);

  const handleFontChange = (value: string) => {
    const index = fontList.findIndex((f) => f.font.className === value);
    if (index !== -1) setFontIndex(index);
  };

  const handleColorChange = (value: string) => {
    const index = colorList.findIndex((c) => c.name === value);
    if (index !== -1) setFrameIndex(index);
  };

  const reset = () => {
    window.location.reload();
  };

  const handleDownload = async () => {
    if (polaroidRef.current && polaroidRef.current.querySelector("img")) {
      const canvas = await exportDivToCanvas(polaroidRef.current);
      const link = document.createElement("a");
      link.download = "polaroid.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Polaroid created successfully!");
      reset();
    } else {
      toast.error("Please upload an image!");
    }
  };
  return (
    <div className="h-full flex flex-col justify-center gap-[5px]">
      {/* Main Polaroid Preview */}
      <div className="flex flex-col items-center">
        <PolaroidFrame
          polaroidRef={polaroidRef}
          showDate={showDate}
          frameColor={colorList[frameIndex].frame}
          textColor={colorList[frameIndex].text}
          fontFamily={fontList[fontIndex].font.className}
          dateFontFamily={fontList[fontIndex].secondary.className}
        />
      </div>

      {/* Show Date checkbox */}
      <div className="flex gap-2 items-center bg-transparent">
        <Checkbox
          id="showDate"
          className="border-white"
          checked={showDate}
          onCheckedChange={() => setShowDate(!showDate)}
        />
        <label htmlFor="showDate">Show Date</label>
      </div>

      <Select
        defaultValue={fontList[fontIndex].font.className}
        onValueChange={handleFontChange}
      >
        <SelectTrigger className="w-[230px] focus:outline-none focus:ring-0">
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent>
          {fontList.map((font, index) => (
            <SelectItem key={index} value={font.font.className}>
              {font.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="py-1 grid grid-cols-3 items-center place-items-center">
        {colorList.map((color, index) => {
          return (
            <div
              key={index}
              className={`p-1 rounded cursor-pointer hover:opacity-90 ${color} ${
                index === frameIndex ? "border" : ""
              }`}
              onClick={() => handleColorChange(color.name)}
            >
              <div
                className={`flex flex-col items-center justify-center py-2  px-1 rounded`}
                style={{ backgroundColor: color.frame, color: color.text }}
              >
                {color.name}
              </div>
            </div>
          );
        })}
      </div>

      <Button className="px-4 py-2 " onClick={handleDownload}>
        Capture Polaroid
      </Button>
    </div>
  );
}
