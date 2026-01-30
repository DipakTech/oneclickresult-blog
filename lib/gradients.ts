export const gradients = [
  "from-[#FDE68A] via-[#FCA5A5] to-[#FECACA]", // Warm Sunset
  "from-[#A7F3D0] via-[#6EE7B7] to-[#34D399]", // Minty Fresh
  "from-[#BFDBFE] via-[#93C5FD] to-[#60A5FA]", // Ocean Blue
  "from-[#E9D5FF] via-[#C084FC] to-[#A855F7]", // Lavender Dream
  "from-[#FDE68A] via-[#FDBA74] to-[#FB923C]", // Citrus
  "from-[#FECACA] via-[#FCA5A5] to-[#F87171]", // Soft Red
  "from-[#DDD6FE] via-[#A78BFA] to-[#8B5CF6]", // Violet
  "from-[#CFFAFE] via-[#67E8F9] to-[#22D3EE]", // Cyan
  "from-[#D1FAE5] via-[#6EE7B7] to-[#10B981]", // Emerald
  "from-[#E5E7EB] via-[#D1D5DB] to-[#9CA3AF]", // Monochrome
];

export const getRandomGradient = (seed: string) => {
  // Simple hash function to get a deterministic number from the string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use the absolute value of the hash to pick a gradient
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};
