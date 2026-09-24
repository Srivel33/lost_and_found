import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';

export const formatDate = (dateString, formatPattern = 'dd MMM yyyy, hh:mm a') => {
  if (!dateString) return 'N/A';
  try {
    const d = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(d, formatPattern);
  } catch {
    return String(dateString);
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  try {
    const d = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '';
  }
};

export const getRetentionInfo = (createdAt, returnedAt, status) => {
  const now = new Date();
  try {
    if (status === 'returned' && returnedAt) {
      const returnDate = typeof returnedAt === 'string' ? parseISO(returnedAt) : new Date(returnedAt);
      const daysPassed = differenceInDays(now, returnDate);
      const daysLeft = Math.max(0, 7 - daysPassed);
      return { daysLeft, totalDays: 7, label: `Auto-deleted in ${daysLeft} day${daysLeft === 1 ? '' : 's'}` };
    }
    const createdDate = typeof createdAt === 'string' ? parseISO(createdAt) : new Date(createdAt);
    const daysPassed = differenceInDays(now, createdDate);
    const daysLeft = Math.max(0, 60 - daysPassed);
    return { daysLeft, totalDays: 60, label: `Auto-deleted in ${daysLeft} day${daysLeft === 1 ? '' : 's'}` };
  } catch {
    return { daysLeft: 60, totalDays: 60, label: 'Auto-deleted in 60 days' };
  }
};

export const formatTimeCountdown = (targetDateString) => {
  if (!targetDateString) return '00:00:00';
  const target = new Date(targetDateString).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return '00:00:00';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
