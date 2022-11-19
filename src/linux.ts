import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

function checkPath(path: string[]): string | false {
  const steamPath = join(...path);

  if (!existsSync(steamPath)) return false;

  return steamPath;
}

async function getSteamPath(): Promise<string> {
  // As far as I am aware MacOS only installs steam to ~/Library/Application Support/Steam

  const paths: string[][] = [
    [homedir(), ".steam", "root"],
    [homedir(), "local", "share", "Steam"],
  ];

  for (const path of paths) {
    const res = checkPath(path);
    if (!!res) return res;
  }

  throw new Error("linux: Unable to find steam install path");
}

export const lib = {
  getSteamPath,
};
