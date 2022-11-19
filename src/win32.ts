import { existsSync } from "fs";
import { enumerateValuesSafe, HKEY } from "registry-js";

function getSteamPath(): string {
  // Windows requires querying registry, using registry-js for this
  const KEY = HKEY.HKEY_LOCAL_MACHINE;
  const SUBKEY = "SOFTWARE\\WOW6432Node\\Valve\\Steam";
  const SUBKEY32 = "SOFTWARE\\Valve\\Steam";

  const paths = enumerateValuesSafe(KEY, SUBKEY)
    .concat(enumerateValuesSafe(KEY, SUBKEY32))
    .filter((v) => v.name == "InstallPath");

  const pathEntry = paths.pop();

  if (!pathEntry || !pathEntry.data)
    throw new Error("Windows: Unable to find steam install path");

  const path = pathEntry.data.toString();

  if (!existsSync(path))
    throw new Error("Windows: Steam install path does not exist");

  return path;
}

export const lib = {
  getSteamPath,
};
