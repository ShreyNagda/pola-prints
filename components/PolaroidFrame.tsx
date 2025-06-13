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
  colorScheme?: {
    frameColor: string;
    textColor: string;
  };
  fontScheme?: {
    captionFont: string;
    dateFont: string;
  };
  data: {
    caption: string;
    date: string;
    imageFile: string | null;
    imageAfterCrop: string | null;
  };
  setData: (
    value: React.SetStateAction<{
      caption: string;
      date: string;
      imageFile: string | null;
      imageAfterCrop: string | null;
    }>
  ) => void;

  reset: () => void;
}

export function PolaroidFrame({
  polaroidRef,
  showDate,
  colorScheme = {
    frameColor: "#fff",
    textColor: "#000",
  },
  fontScheme = {
    captionFont: "",
    dateFont: "",
  },
  data,
  setData,
  reset,
}: PolaroidFrameProps) {
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
    imgObject.src = data.imageFile!;

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
      setData((prev) => ({
        ...prev,
        imageAfterCrop: canvasElement.toDataURL("image/png"),
      }));
    };
  };

  const onCropCancel = () => {
    setData((prev) => ({
      ...prev,
      imageAfterCrop: data.imageAfterCrop || data.imageFile,
    }));
  };

  const resetData = () => {
    setDate("");
    setFormattedDate("");
    reset();
  };

  return (
    <div>
      <div
        className="shadow-md md:h-[280px] md:w-[230px] h-[300px] w-[250px]"
        ref={polaroidRef}
        style={{
          backgroundColor: colorScheme.frameColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "15px",
        }}
      >
        <div
          className="md:h-[200px] md:w-[200px] h-[220px] w-[220px] relative"
          style={{
            backgroundColor: colorScheme.textColor,
            color: colorScheme.frameColor,
          }}
        >
          {data.imageFile == null ? (
            <FilePicker
              setImage={(value) =>
                setData((prev) => ({ ...prev, imageFile: value }))
              }
            />
          ) : data.imageAfterCrop == null ? (
            <Image
              src={data.imageFile}
              fill
              alt="image"
              className="h-full w-full object-center"
            />
          ) : (
            <Image
              src={data.imageAfterCrop}
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
              color: colorScheme.textColor,
              fontSize: "18px",
              fontWeight: "bold",
              width: "100%",
              border: "none",
              outline: "none",
              marginTop: showDate ? "5px" : "15px",
            }}
            value={data.caption}
            name="caption"
            className={`bg-transparent ${fontScheme.captionFont}`}
            onChange={(ev) =>
              setData((prev) => ({ ...prev, caption: ev.target.value }))
            }
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
                  color: colorScheme.textColor,
                  fontSize: "15px",
                  fontWeight: "lighter",
                  width: "100%",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  display: "block",
                  cursor: "pointer",
                }}
                className={`${fontScheme.dateFont}`}
              >
                {formattedDate || "Select a date"}
              </label>
            </div>
          )}
        </div>
      </div>
      {data.imageFile && (
        <div className="flex items-center justify-between w-full">
          <ImageCropper
            image={data.imageFile}
            onCropDone={onCropDone}
            onCropCancel={onCropCancel}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"link"} className="text-red-400 underline">
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
        </div>
      )}
    </div>
  );
}
