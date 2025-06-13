"use client";

import { Area } from "react-easy-crop";
import { FilePicker } from "./FilePicker";
import { ImageCropper } from "./ImageCropper";
import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

interface PolaroidFrameProps {
  polaroidRef: React.RefObject<HTMLDivElement | null>;
  showDate: boolean;
  frameColor?: string;
  textColor?: string;
  fontFamily?: string;
  dateFontFamily?: string;
  reset: () => void;
}

export function PolaroidFrame({
  polaroidRef,
  showDate,
  frameColor = "#ffffff",
  textColor = "#000",
  fontFamily = "",
  dateFontFamily = "",
  reset,
}: PolaroidFrameProps) {
  const [imageAfterCrop, setImageAfterCrop] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [caption, setCaption] = useState("Your Caption");
  const [date, setDate] = useState("");
  const dateRef = useRef<HTMLInputElement>(null);
  const [formattedDate, setFormattedDate] = useState("");

  // Helper function for formatting date
  const formatToDDMMYYYY = (value: string) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  const onCropDone = (croppedArea: Area): void => {
    const canvasElement = document.createElement("canvas");
    canvasElement.width = croppedArea.width;
    canvasElement.height = croppedArea.height;

    const ctx = canvasElement.getContext("2d");
    const imgObject = new window.Image();
    imgObject.src = imageFile!;

    imgObject.onload = function () {
      ctx?.drawImage(
        imgObject,
        croppedArea.x,
        croppedArea.y,
        croppedArea.width,
        croppedArea.height,
        0,
        0,
        croppedArea.width,
        croppedArea.height
      );
      setImageAfterCrop(canvasElement.toDataURL("image/png"));
    };
  };

  const onCropCancel = () => {
    setImageAfterCrop(imageFile);
  };

  const resetData = () => {
    setCaption("Your Caption");
    setImageAfterCrop(null);
    setImageFile(null);
    setDate("");
    setFormattedDate("");
    reset();
  };

  return (
    <>
      <div
        className="shadow-md md:h-[280px] md:w-[230px] h-[300px] w-[250px]"
        ref={polaroidRef}
        style={{
          backgroundColor: frameColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "15px",
        }}
      >
        <div
          className="md:h-[200px] md:w-[200px] h-[220px] w-[220px] relative"
          style={{
            backgroundColor: textColor,
            color: frameColor,
          }}
        >
          {imageFile == null ? (
            <FilePicker setImage={setImageFile} />
          ) : imageAfterCrop == null ? (
            <Image
              src={imageFile}
              fill
              alt="image"
              className="h-full w-full object-center"
            />
          ) : (
            <Image
              src={imageAfterCrop}
              alt="image"
              fill
              className="object-cover object-center"
            />
          )}
        </div>

        <div className="w-full text-left">
          <input
            autoComplete="off"
            type="text"
            style={{
              color: textColor,
              fontSize: "18px",
              fontWeight: "bold",
              width: "100%",
              border: "none",
              outline: "none",
              marginTop: showDate ? "5px" : "15px",
            }}
            value={caption}
            name="caption"
            className={`bg-transparent ${fontFamily}`}
            onChange={(ev) => setCaption(ev.target.value)}
          />

          {showDate && (
            <div>
              <input
                type="date"
                ref={dateRef}
                className="hidden"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setFormattedDate(formatToDDMMYYYY(e.target.value));
                }}
              />
              <label
                onClick={() => dateRef?.current?.showPicker?.()}
                style={{
                  color: textColor,
                  fontSize: "15px",
                  fontWeight: "lighter",
                  width: "100%",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  display: "block",
                  cursor: "pointer",
                }}
                className={`${dateFontFamily}`}
              >
                {formattedDate || "Select a date"}
              </label>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        {imageFile && (
          <ImageCropper
            image={imageFile}
            onCropDone={onCropDone}
            onCropCancel={onCropCancel}
          />
        )}
        {imageFile && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"link"} className="text-red-600 underline">
                Reset
              </Button>
            </DialogTrigger>
            <DialogContent className="text-black text-center">
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you don&apos;t want to save the polaroid?
              </DialogDescription>
              <div className="flex justify-center gap-4 mt-4">
                <DialogClose>Cancel</DialogClose>
                <Button variant={"destructive"} asChild>
                  <DialogClose onClick={resetData} className="">
                    Yes, Reset
                  </DialogClose>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}
