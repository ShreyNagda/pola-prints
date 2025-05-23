"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("My Polaroid 📸");
  const [showDate, setShowDate] = useState<boolean>(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [frame, setFrame] = useState<string>("classic");
  const [captionTop, setCaptionTop] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);

  const frameStyles: Record<string, { bg: string; text: string }> = {
    classic: { bg: "#ffffff", text: "#000000" },
    black: { bg: "#000000", text: "#ffffff" },
    retro: { bg: "#fdf3e7", text: "#3a2e25" },
  };

  useEffect(() => {
    async function initialSetup() {
      await document.fonts.load("80px 'Pacifico'");
      drawCanvas();
    }
    initialSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, image, showDate, caption, frame, date, captionTop]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { bg, text } = frameStyles[frame];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const paddingSide = 100;

    // Determine if caption exists (non-empty after trim)
    const hasCaption = caption.trim().length > 0;

    // Heights for caption and date (adjust to your font sizes)
    const captionHeight = hasCaption ? 80 : 0;
    const dateHeight = showDate ? 48 : 0;
    const gapBetweenCaptionDate = hasCaption && showDate ? 30 : 0;
    const totalTextHeight = captionHeight + dateHeight + gapBetweenCaptionDate;
    const extraMargin = 30; // extra spacing so text doesn't touch image

    // Calculate padding for top and bottom depending on caption position
    let paddingTop: number;
    let paddingBottom: number;

    if (captionTop) {
      paddingTop = 150 + totalTextHeight + extraMargin;
      paddingBottom = 100;
    } else {
      paddingTop = 150;
      paddingBottom = 100 + totalTextHeight + extraMargin;
    }

    const imgW = canvas.width - paddingSide * 2;
    const imgH = canvas.height - paddingTop - paddingBottom;

    // Draw image or placeholder
    if (image) {
      ctx.drawImage(image, paddingSide, paddingTop, imgW, imgH);
    } else {
      ctx.fillStyle = "#d1d5db"; // gray-300
      ctx.fillRect(paddingSide, paddingTop, imgW, imgH);
      ctx.fillStyle = "#6b7280"; // gray-500
      ctx.font = "60px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "No Image Selected",
        canvas.width / 2,
        paddingTop + imgH / 2
      );
    }

    // Draw caption & date if they exist
    ctx.fillStyle = text;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    let captionY = 0;
    let dateY = 0;

    if (captionTop) {
      if (hasCaption) {
        captionY = 130 + 80; // fixed position for caption top
        ctx.font = "80px 'Pacifico', cursive";
        ctx.fillText(caption, canvas.width / 2, captionY);
      }
      if (showDate && date) {
        dateY = hasCaption ? captionY + 48 + 30 : 130 + 48; // below caption or directly below top if no caption
        ctx.font = "48px cursive";
        ctx.fillText(format(date, "PPP"), canvas.width / 2, dateY);
      }
    } else {
      if (showDate && date) {
        dateY = canvas.height - (paddingBottom - extraMargin - dateHeight + 10); // bottom date position
        ctx.font = "48px cursive";
        ctx.fillText(format(date, "PPP"), canvas.width / 2, dateY);
      }
      if (hasCaption) {
        captionY =
          canvas.height -
          (paddingBottom -
            extraMargin -
            dateHeight -
            gapBetweenCaptionDate -
            captionHeight);
        ctx.font = "80px 'Pacifico', cursive";
        ctx.fillText(caption, canvas.width / 2, captionY);
      }
    }
  };

  const sanitizeCaption = (caption: string) => {
    return caption.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.onerror = () => {
        toast.error("Failed to load image.");
        setImage(null);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = async () => {
    if (!image) {
      toast.error("Please select an image first!");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 100)); // small delay to ensure canvas is updated
    const canvas = canvasRef.current;
    if (!canvas) {
      setLoading(false);
      return;
    }
    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = `${sanitizeCaption(caption) || "polaroid"}.png`;
    link.href = dataUrl;
    link.click();

    toast.success("Polaroid saved and downloaded!");
    setLoading(false);
  };

  const reset = () => {
    setImage(null);
    setFile(null);
    setShowDate(true);
    setCaption("My Polaroid 📸");
    setFrame("classic");
    setCaptionTop(true);
  };

  return (
    <div className="mx-auto max-w-[900px] p-2 grid grid-cols-1 md:grid-cols-2 place-items-center align-middle gap-4">
      <canvas
        ref={canvasRef}
        width={2000}
        height={2500}
        className="bg-slate-400 mx-auto border rounded-sm shadow-md w-[300px] h-auto aspect-[4/5] max-w-[400px]"
      />
      <div className="w-full flex flex-col justify-center items-center gap-y-3">
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        <Input
          type="text"
          placeholder="Enter caption"
          value={caption}
          onChange={(ev) => setCaption(ev.target.value)}
        />

        {/* Frame Selection */}
        <Select value={frame} onValueChange={(value) => setFrame(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classic">Classic</SelectItem>
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="retro">Retro</SelectItem>
          </SelectContent>
        </Select>

        {/* Caption position toggle */}
        <Button
          type="button"
          variant={"outline"}
          onClick={() => setCaptionTop(!captionTop)}
        >
          Move Caption {!captionTop ? "Top" : "Bottom"}{" "}
          {!captionTop ? <ArrowUp /> : <ArrowDown />}
        </Button>

        {/* Date input */}
        <div className="flex gap-3 items-center w-full">
          <div className="flex-1 flex items-center justify-start gap-4">
            <Checkbox
              id="showDate"
              checked={showDate}
              onCheckedChange={(checked) => setShowDate(!!checked)}
            />
            <label htmlFor="showDate">Show Date</label>
          </div>
          {showDate && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="flex gap-2 mt-6 ">
          <Button disabled={!image || loading} onClick={downloadImage}>
            {!image
              ? "Select Image"
              : loading
              ? "Saving..."
              : "Download Polaroid"}
          </Button>
          {image && (
            <Button disabled={loading} onClick={reset} variant={"destructive"}>
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
