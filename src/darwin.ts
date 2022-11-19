import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

async function getSteamPath(): Promise<string> {
  // As far as I am aware MacOS only installs steam to ~/Library/Application Support/Steam

  const homeDir = homedir();

  const steamPath = join(homeDir, "Library", "Application Support", "Steam");

  if (!existsSync(steamPath))
    // Steam is not installed OR installed in a different location (please make an issue if this is the case!)
    throw new Error("MacOS: Steam directory was not in Application Support");

  return steamPath;
}

export const lib = {
  getSteamPath,
};
