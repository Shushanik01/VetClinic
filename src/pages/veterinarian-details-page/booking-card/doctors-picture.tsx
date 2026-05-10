import React from 'react';

type DoctorsPictureProps = {
  imageUrl?: string;
  fullName: string;
};

const getInitials = (fullName: string): string => {
  const tokens = fullName
    .trim()
    .split(/\s+/)
    .map((token) => token.replace(/[^a-zA-Z]/g, ''))
    .filter(Boolean);

  const normalizedTokens =
    tokens.length > 0 && /^(dr|doctor)$/i.test(tokens[0])
      ? tokens.slice(1)
      : tokens;

  if (normalizedTokens.length === 0) {
    return 'VT';
  }

  if (normalizedTokens.length === 1) {
    return normalizedTokens[0].slice(0, 2).toUpperCase();
  }

  return `${normalizedTokens[0][0]}${normalizedTokens[1][0]}`.toUpperCase();
};

const DoctorsPicture: React.FC<DoctorsPictureProps> = ({
  imageUrl,
  fullName,
}) => {
  const initials = getInitials(fullName);

  return (
    <div className="rounded-[32px] overflow-hidden bg-neutral-100 w-full max-w-[320px] aspect-square">
      <img
        src={
          imageUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=512&background=E5E7EB&color=111827&bold=true&format=png`
        }
        alt={fullName}
        className="w-full h-full object-cover object-top"
      />
    </div>
  );
};

export default DoctorsPicture;
