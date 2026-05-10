type TabOption = {
  label: string;
  value: string;
};

type TabsProps = {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export const Tabs = ({
  options,
  value,
  onChange,
  className = '',
}: TabsProps) => {
  return (
    <div className={`flex ${className}`}>
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative flex items-center justify-center h-[48px] px-4 gap-2 border-b cursor-pointer ${
              isActive
                ? 'border-transparent text-body-m-bold text-green-400'
                : 'border-[#99A1AF] text-body-m-bold text-black-800 hover:text-black-700'
            }`}
          >
            <span>{option.label}</span>
            {isActive && (
              <span className="pointer-events-none absolute -bottom-[3px] left-0 right-0 h-[5px] w-full rounded-[6px] bg-[#128280]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
