import { Signal } from "@sigjs/sig";
import Search from "../../assets/icons/search.svg";


interface SearchBarProps {
  value$: Signal<string>;
  onChange: (value: string) => void;
}

export function SearchBar({ value$, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search recipes..."
        value={value$}
        onInput={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      {Search({className: "absolute left-3 top-2.5 h-5 w-5 text-gray-400"})}
    </div>
  );
}