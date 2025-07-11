export const safeJsonParse = <T>(data: string | null): T | null => {
  if (!data) return null;
  try {
    return typeof data === 'string' &&
      (data.startsWith('{') || data.startsWith('['))
      ? JSON.parse(data)
      : data;
  } catch (e) {
    return null;
  }
};

export const safeJsonStringify = (data: any): string => {
  if (typeof data === 'string') {
    return data;
  }
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error stringifying JSON:', error);
    return '';
  }
};
