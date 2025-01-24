import { icons } from '@/theme/image';
import React, { useRef } from 'react';

interface IFileInputProps {
  name: string;
  // eslint-disable-next-line no-unused-vars
  handleFileChange: (event: any) => void;
  disabled?: boolean;
}

export default function FileInput({ name, handleFileChange, disabled=false }: IFileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event);
    resetFileInput();
  };
  return (
    <div className="flex items-center justify-center w-full">
      <label htmlFor="dropzone-file">
        <img
          src={icons.uploadFile}
          className="rounded-full absolute left-0 top-2/4 -translate-y-2/4 ms-2.5 cursor-pointer hover:scale-150"
          alt=""
        />
        <input
          id="dropzone-file"
          name={name}
          type="file"
          multiple
          className="hidden"
          accept=".xlsx, .csv"
          ref={fileInputRef}
          onChange={handleChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
}
