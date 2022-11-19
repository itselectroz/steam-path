import { parse } from "@node-steam/vdf";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

import { AppManifest, AppPath, LibraryFolders, SteamPath } from "./types";
import lib from "./util";

/**
 * Parse libraryfolders.vdf and return contents.
 * If steamPath isn't provided it will attempt to find it.
 *
 * @param { string } [steamPath] *Optional* Steam installation path.
 * @return { Promise<LibraryFolders> } JSON object promise
 */
export async function getLibraryFolders(
  steamPath?: string
): Promise<LibraryFolders> {
  if (!steamPath) steamPath = await lib.getSteamPath();

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
 * Get Steam's installation path as well as any app library paths.
 *
 * @return { Promise<SteamPath> } Steam path and library paths promise
 */
export async function getSteamPath(): Promise<SteamPath> {
  const steamPath = await lib.getSteamPath();

  const libfolders = await getLibraryFolders(steamPath);

  const libs = Object.entries(libfolders.libraryfolders).map(
    ([_, { path }]) => path
  );

  return {
    path: steamPath,
    libs,
  };
}

/**
 * Get an app's manifest file.
 *
 * @param { number } appId app's id
 * @return { Promise<AppManifest> } app's manifest data promise
 */
export async function getAppManifest(appId: number): Promise<AppManifest> {
  const libfolders = (await getLibraryFolders()).libraryfolders;

  const appLib = Object.entries(libfolders)
    .filter(([_, { apps }]) => !!apps[appId])
    .map(([_, { path }]) => join(path, "steamapps"));

  const manifests = appLib
    .map((path) => {
      const manifestPath = join(path, `appmanifest_${appId}.acf`);
      if (!existsSync(manifestPath)) return false;

      const manifest: AppManifest = parse(
        readFileSync(manifestPath, {
          encoding: "utf-8",
        })
      );

      if (!manifest) return false;

      manifest.library_path = path;
      return manifest;
    })
    .filter((v) => !!v) as AppManifest[];

  if (!manifests.length) throw new Error("Unable to find or parse appmanifest");

  // Typescript is unable to see that pop cannot return undefined here.
  return manifests.pop() as AppManifest;
}

/**
 * Get a Steam app's path from app id.
 *
 * @param { number } appId app's id
 * @returns { Promise<AppPath> } app path promise
 */
export async function getAppPath(appId: number): Promise<AppPath> {
  const manifest = await getAppManifest(appId);

  return {
    name: manifest.AppState.name,
    path: join(manifest.library_path, "common", manifest.AppState.installdir),
  };
}
