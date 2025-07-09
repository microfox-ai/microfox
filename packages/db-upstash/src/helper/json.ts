export const safeJsonParse = <T>(data: string | null): T | null => {
  if (!data) return null;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};

export const safeJsonStringify = (data: any): string => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error stringifying JSON:', error);
    return '';
  }
};
