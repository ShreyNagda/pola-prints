"use client";

import { PolaroidFrame } from "@/components/PolaroidFrame";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { exportDivToCanvas } from "@/utils/exportDivToCanvas";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [showDate, setShowDate] = useState(true);
  const polaroidRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (polaroidRef.current && polaroidRef.current.querySelector("img")) {
      const canvas = await exportDivToCanvas(polaroidRef.current);
      const link = document.createElement("a");
      link.download = "polaroid.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else {
      toast.error("Please upload an image!");
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      {/* Main Polaroid Preview */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
        <div>
          <PolaroidFrame
            polaroidRef={polaroidRef}
            showDate={showDate}
            frameColor="gray"
            textColor="black"
            fontFamily="Pacifico"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Checkbox
            id="showDate"
            className="border-white"
            checked={showDate}
            onCheckedChange={(value) => setShowDate(!showDate)}
          />
          <label htmlFor="showDate">Show Date</label>
        </div>
        <Button
          className="px-4 py-2 "
          onClick={handleDownload}
          // disabled={
          //   polaroidRef.current?.querySelector("img") == null ||
          //   polaroidRef.current?.querySelector("img") == undefined
          // }
        >
          Capture Polaroid
        </Button>
      </div>
    </div>
  );
}
