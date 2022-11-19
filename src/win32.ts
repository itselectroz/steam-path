import { existsSync } from "fs";
import { promisified } from "regedit";

async function getSteamPath(): Promise<string> {
  // Windows requires querying registry, using regedit (npm package) for this
  const keys = await promisified.list([
    "HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam",
    "HKLM\\SOFTWARE\\Valve\\Steam",
    "HKCU\\SOFTWARE\\WOW6432Node\\Valve\\Steam",
    "HKCU\\SOFTWARE\\Valve\\Steam",
  ]);

  const entry = Object.values(keys).find(
    (v) => !!v.exists && (!!v.values["InstallPath"] || !!v.values["SteamPath"])
  );

  if (!entry) throw new Error("Windows: Unable to find steam install path");

  const path = (entry.values["InstallPath"] || entry.values["SteamPath"])
    .value as string;

  if (!existsSync(path))
    throw new Error("Windows: Steam install path does not exist");

  return path;
}

export const lib = {
  getSteamPath,
};
