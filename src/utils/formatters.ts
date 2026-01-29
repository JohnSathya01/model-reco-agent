// Utility functions for formatting data

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (value: number): string => {
  return `${value}%`;
};

export const formatLatency = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  } else {
    return `${(ms / 60000).toFixed(1)}m`;
  }
};

export const formatDatasetSize = (size: number): string => {
  if (size < 1000) {
    return size.toString();
  } else if (size < 1000000) {
    return `${(size / 1000).toFixed(1)}K`;
  } else if (size < 1000000000) {
    return `${(size / 1000000).toFixed(1)}M`;
  } else {
    return `${(size / 1000000000).toFixed(1)}B`;
  }
};

export const formatMemory = (gb: number): string => {
  if (gb < 1) {
    return `${(gb * 1024).toFixed(0)}MB`;
  } else if (gb < 1024) {
    return `${gb}GB`;
  } else {
    return `${(gb / 1024).toFixed(1)}TB`;
  }
};

export const formatTrainingTime = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)}min`;
  } else if (hours < 24) {
    return `${hours.toFixed(1)}h`;
  } else {
    return `${Math.round(hours / 24)}d`;
  }
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const formatJSON = (obj: Record<string, unknown>): string => {
  return JSON.stringify(obj, null, 2);
};