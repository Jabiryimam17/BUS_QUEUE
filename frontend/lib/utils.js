import { format, formatDistanceToNow, isBefore, isAfter } from 'date-fns';

export const formatDate = (dateString) => {
  return format(new Date(dateString), 'PPp');
};

export const formatTime = (dateString) => {
  return format(new Date(dateString), 'HH:mm');
};

export const formatDateShort = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

export const getTimeUntil = (dateString) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export const isWindowOpen = (windowOpen, windowClose) => {
  const now = new Date();
  return isAfter(now, new Date(windowOpen)) && isBefore(now, new Date(windowClose));
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
