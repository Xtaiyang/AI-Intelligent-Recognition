'use client';

type CategoryChipsProps = {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
  label?: string;
};

export function CategoryChips({
  categories,
  value,
  onChange,
  label = 'Category',
}: CategoryChipsProps) {
  return (
    <fieldset className="filters">
      <legend className="srOnly">{label}</legend>
      <div className="chips" aria-label={label}>
        <button
          type="button"
          className={value ? 'chip' : 'chip chipActive'}
          aria-pressed={!value}
          onClick={() => onChange('')}
        >
          All
        </button>
        {categories.map((category) => {
          const active = value === category;
          return (
            <button
              key={category}
              type="button"
              className={active ? 'chip chipActive' : 'chip'}
              aria-pressed={active}
              onClick={() => onChange(active ? '' : category)}
            >
              {category}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
