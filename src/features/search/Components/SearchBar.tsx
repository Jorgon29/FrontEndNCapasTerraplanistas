interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
    value,
    onChange
}: SearchBarProps){
    return (
  <input
      type="text"
      placeholder="Buscar doctor o especialidad..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        p-3
        rounded-xl
        border
        border-r-text-muted
        focus:outline-none
        focus:ring-2
        focus:ring-primary
      "
    />

    );

}