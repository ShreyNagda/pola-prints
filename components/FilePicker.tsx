import { useRef } from "react";

type FilePickerProps = {
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
};

export function FilePicker({ setImage }: FilePickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  return (
    <div
      className="h-[200px] flex items-center justify-center cursor-pointer"
      onClick={() => fileRef.current?.click()}
    >
      <input
        type="file"
        id="filePicker"
        onChange={handleChange}
        className="hidden"
        accept="image/*"
        ref={fileRef}
      />
      <label htmlFor="filePicker">Upload Image</label>
    </div>
  );
}
