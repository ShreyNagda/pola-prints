"use client";

import { Area } from "react-easy-crop";
import { FilePicker } from "./FilePicker";
import { ImageCropper } from "./ImageCropper";
import { useState } from "react";

interface PolaroidFrameProps {
  polaroidRef: React.RefObject<HTMLDivElement | null>;
  showDate: boolean;
  frameColor?: string;
  textColor?: string;
  fontFamily?: string;
  dateFontFamily?: string;
}

export function PolaroidFrame({
  polaroidRef,
  showDate,
  frameColor = "#ffffff",
  textColor = "#000",
  fontFamily = "",
  dateFontFamily = "",
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

    const imgObject = new Image();
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

  console.log(frameColor);

  return (
    <>
      <div
        className="shadow-md"
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
              width={200}
              height={200}
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
            autoComplete="off"
            type="text"
            style={{
              color: textColor,
              fontSize: "20px",
              fontWeight: "bold",
              width: "100%",
              border: "none",
              outline: "none",
              marginTop: showDate ? 0 : "5px",
            }}
            value={caption}
            name="caption"
            className={`bg-transparent ${fontFamily}`}
            onChange={(ev) => setCaption(ev.target.value)}
          />

          {showDate && (
            <input
              type="date"
              className={`${dateFontFamily} appearance:none ${
                textColor === "#fff" ? "calendar-dark" : "calendar-light"
              }`}
              style={{
                color: textColor,
                fontSize: "15px",
                fontWeight: "lighter",
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
