export const COLLEGE_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(snsct\.org|college\.edu)$/i;
export const REG_NUMBER_REGEX = /^[a-zA-Z0-9]{8,14}$/;
export const PHONE_REGEX = /^\d{10}$/;

export const isValidCollegeEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return COLLEGE_EMAIL_REGEX.test(email.trim());
};

export const isValidRegNumber = (reg) => {
  if (!reg || typeof reg !== 'string') return false;
  return REG_NUMBER_REGEX.test(reg.trim());
};

export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  return PHONE_REGEX.test(phone.trim().replace(/[-\s]/g, ''));
};

export const isValidTimeWindow = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const now = Date.now();

  if (isNaN(start) || isNaN(end)) return false;
  if (start > now || end > now) return false;
  return end >= start;
};
