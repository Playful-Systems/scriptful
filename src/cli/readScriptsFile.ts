import { readFile } from "fs/promises";

const filePaths = [
  './scripts',
  './script',
  './scriptful',
  './scriptful.config',
] as const

const fileExtensions = [
  '.js',
  '.mjs',
  '.cjs',
  '.ts',
  '.mts',
  '.cts',
] as const

export const readScriptsFile = async () => {
  for (const path of filePaths) {
    for (const extension of fileExtensions) {
      const filePath = `${path}${extension}`;

      try {
        // Read file
        const file = await readFile(filePath, 'utf-8');
        return { file, path, extension, filePath };
      } catch (error: any) {
        // if file doesn't exist, continue
        if (error.code === 'ENOENT') continue;
        // if file exists but can't be read, throw error
        throw error;
      }

    }
  }

  throw new Error('No scripts file found');
};
