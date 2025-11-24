interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function Input({
  label, type
})
