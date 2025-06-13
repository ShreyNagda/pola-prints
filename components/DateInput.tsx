import { useRef, useState } from "react";

export default function DateInput({
  fontFamily,
  fontColor,
  onChange,
}: {
  fontFamily: string;
  fontColor: string;
  onChange: (value: string) => void;
}) {
  const dateRef = useRef<HTMLInputElement>(null);
  const [formattedDate, setFormattedDate] = useState("");

  const formatToDDMMYYYY = (value: string) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <input
        type="date"
        ref={dateRef}
        className="hidden"
        onChange={(e) => {
          const formatted = formatToDDMMYYYY(e.target.value);
          setFormattedDate(formatted);
          onChange(e.target.value); // Pass raw ISO string (yyyy-mm-dd) to parent
        }}
      />

      <label
        onClick={() => dateRef?.current?.showPicker?.()}
        style={{
          color: fontColor,
          fontSize: "15px",
          fontWeight: "lighter",
          width: "100%",
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          display: "block",
          cursor: "pointer",
        }}
        className={`${fontFamily}`}
      >
        {formattedDate || "Select a date"}
      </label>
    </div>
  );
}
