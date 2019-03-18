import * as fs from 'fs';
import * as path from 'path';

export type ConfigFile = {
  name: string;
  content: any;
};

function removeFromNodeCache(id: string): void {
  delete require.cache[require.resolve(id)];
}

export function requireFilesFromDir(directories: string[]): ConfigFile[] {
  const formats = ['.js', '.json'];

  return directories
    .map(dirPath => dirPath.replace('*', ''))
    .reduce(
      (allDirs, dir) => allDirs.concat((readDirFiles(path.normalize(dir)))),
      [] as string[]
    )
    .filter((file) => {
      const dtsExtension = file.substring(file.length - 5, file.length);
      return formats.indexOf(path.extname(file)) !== -1 && dtsExtension !== '.d.ts';
    })
    .map((pathTofile) => {
      const fileName = path.basename(pathTofile);
      removeFromNodeCache(pathTofile);
      const config: ConfigFile = {
        name: fileName.slice(0, fileName.lastIndexOf(formats[0])),
        content: require(pathTofile)
      };
      return config;
    })
    .filter(loaded => loaded.content);
}

const readDirFiles = (pathToDir: string): string[] => {
  const dirFileList: string[] = [];
  fs.readdirSync(pathToDir)
      .forEach((element) => {
        const elementPath = path.resolve(pathToDir, element);
        if (!fs.statSync(elementPath).isDirectory()) {
          dirFileList.push(elementPath);
        }
      });
  return dirFileList;
};
