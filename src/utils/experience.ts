/**
 * Calculate years of professional experience
 * @param startDate - The date when professional career started
 * @returns Number of years of experience (rounded up)
 */
export const calculateYearsOfExperience = (startDate: Date = new Date('2022-01-01')): number => {
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
  const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
  return diffYears;
};

/**
 * Get formatted years of experience string
 * @param startDate - The date when professional career started
 * @returns Formatted string like "3+" for years of experience
 */
export const getYearsOfExperienceString = (startDate?: Date): string => {
  return `${calculateYearsOfExperience(startDate)}+`;
};
