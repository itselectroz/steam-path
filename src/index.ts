import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { parse } from "@node-steam/vdf";

import lib from "./util";

export type LibraryFolders = {
  libraryfolders: {
    [key: string]: {
      path: string;
      label: string;
      contentid: number;
      totalsize: number;
      update_clean_bytes_tally: number;
      time_last_update_corruption: number;
      apps: {
        [appid: string]: string;
      };
    };
  };
};

export type SteamPath = {
  path: string;
  libs: string[];
};

/**
 * Parse libraryfolders.vdf and return contents.
 * If steamPath isn't provided it will attempt to find it.
 *
 * @param { string } [steamPath] *Optional* Steam installation path.
 * @return { object } JSON object
 */
export function getLibraryFolders(steamPath?: string): LibraryFolders {
  if (!steamPath) steamPath = lib.getSteamPath();

  const steamApps = join(steamPath, "steamapps");
  const libraryfoldersPath = join(steamApps, "libraryfolders.vdf");

  if (!existsSync(libraryfoldersPath))
    throw new Error("Unable to find libraryfolders.vdf");

  const libfolders: LibraryFolders = parse(
    readFileSync(libraryfoldersPath, {
      encoding: "utf-8",
    })
  );

  if (!libfolders) throw new Error("Unable to parsse libraryfolders.vdf");

  return libfolders;
}

/**
 * Get the Steam installation path.
 *
 * @return { SteamPath } Steam path and library paths
 */
export function getSteamPath(): SteamPath {
  const steamPath = lib.getSteamPath();

  const libfolders = getLibraryFolders(steamPath);

  const libs = Object.entries(libfolders.libraryfolders).map(
    ([_, { path }]) => path
  );

  return {
    path: steamPath,
    libs,
  };
}
