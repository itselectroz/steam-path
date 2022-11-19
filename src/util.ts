import { platform } from "os";

import { lib as darwin } from "./darwin";
import { lib as win32 } from "./win32";

let lib: {
  getSteamPath(): Promise<string>;
} = {} as any;

switch (platform()) {
  case "darwin":
    lib = darwin;
    break;
  case "win32":
    lib = win32;
    break;
  default:
    throw new Error("Not implemented");
}

export default lib;
