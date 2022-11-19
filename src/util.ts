import { platform } from "os";

import { lib as darwin } from "./darwin";
import { lib as win32 } from "./win32";
import { lib as linux } from "./linux";

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
  case "linux":
    lib = linux;
    break;
  default:
    throw new Error("Not implemented");
}

export default lib;
