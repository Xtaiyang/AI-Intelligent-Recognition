'use client';

type SearchBarProps = {
  value: string;
  onChange: (nextValue: string) => void;
  id?: string;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  id = 'service-search',
  placeholder = 'Search services…',
}: SearchBarProps) {
  return (
    <div className="search" role="search">
      <label htmlFor={id} className="srOnly">
        Search services
      </label>
      <input
        id={id}
        className="input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
}
