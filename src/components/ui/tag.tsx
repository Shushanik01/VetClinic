type TagVariant = 'pink' | 'blue' | 'green';

type TagProps = {
  label: string;
  variant?: TagVariant;
  className?: string;
};

const variantClasses: Record<TagVariant, string> = {
  pink: 'text-pink-600 bg-pink-100',
  blue: 'text-black-900 bg-blue-300',
  green: 'text-green-400 bg-green-50',
};

export const Tag = ({ label, variant = 'pink', className = '' }: TagProps) => {
  return (
    <span
      className={`text-body-s-regular rounded-[32px] px-[12px] py-[4px] inline-block ${variantClasses[variant]} ${className}`}
    >
      {label}
    </span>
  );
};
