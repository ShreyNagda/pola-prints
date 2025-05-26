"use client";

import { Area } from "react-easy-crop";
import { FilePicker } from "./FilePicker";
import { ImageCropper } from "./ImageCropper";
import { useState } from "react";
import { text } from "stream/consumers";

interface PolaroidFrameProps {
  polaroidRef: React.RefObject<HTMLDivElement | null>;
  showDate: boolean;
  frameColor?: string;
  textColor?: string;
  fontFamily?: string;
}

export function PolaroidFrame({
  polaroidRef,
  showDate,
  frameColor = "#fff",
  textColor = "#000",
  fontFamily = "Dancing Script",
}: PolaroidFrameProps) {
  const [imageAfterCrop, setImageAfterCrop] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [caption, setCaption] = useState("Your Caption");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const onCropDone = (croppedArea: Area): void => {
    const canvasElement = document.createElement("canvas");
    canvasElement.width = croppedArea.width;
    canvasElement.height = croppedArea.height;

    const ctx = canvasElement.getContext("2d");

    let imgObject = new Image();
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

      const dataUrl = canvasElement.toDataURL("image/png");
      setImageAfterCrop(dataUrl);
    };
  };

  const onCropCancel = () => {
    setImageAfterCrop(imageFile);
  };

  return (
    <>
      <div
        ref={polaroidRef}
        style={{
          height: "280px",
          width: "230px",
          backgroundColor: frameColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "15px",
        }}
      >
        <div
          style={{
            backgroundColor: textColor,
            color: frameColor,
            height: "200px",
            width: "200px",
          }}
        >
          {imageFile == null ? (
            <FilePicker setImage={setImageFile} />
          ) : imageAfterCrop == null ? (
            <img
              src={imageFile}
              alt="image"
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <img
              src={imageAfterCrop}
              alt="image"
              className="h-full w-full object-cover object-center"
            />
          )}
        </div>

        <div className="w-full text-left">
          <input
            type="text"
            style={{
              color: textColor,
              fontFamily: `"${fontFamily}", "cursive"`,
              fontSize: "20px",
              fontWeight: "bold",
              width: "100%",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",

              marginTop: showDate ? 0 : "5px",
            }}
            value={caption}
            name="caption"
            onChange={(ev) => setCaption(ev.target.value)}
          />

          {showDate && (
            <input
              type="date"
              style={{
                color: textColor,
                fontSize: "15px",
                fontWeight: "light",
                width: "100%",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
              }}
              value={date}
              name="date"
              onChange={(ev) => setDate(ev.target.value)}
            />
          )}
        </div>
      </div>
      {imageFile && (
        <ImageCropper
          image={imageFile}
          onCropDone={onCropDone}
          onCropCancel={onCropCancel}
        />
      )}
    </>
  );
}
