import fs from 'fs';
export const getNumberOfFiles = (dirPath: string) => {
  try {
    const files = fs.readdirSync(dirPath);
    return files.length;
  } catch (err) {
    console.error('Error reading directory:', err);
    return 0;
  }
};