import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?:string;
  type?: string;
  label?:string;
}

export default function Input({value, onChange,placeholder,type="text", label}: Props){
  return(
    <label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}
