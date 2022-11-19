import { platform } from "os";

import { lib as darwin } from "./darwin";

let lib: {
  getSteamPath(): string;
} = {} as any;

switch (platform()) {
  case "darwin":
    lib = darwin;
    break;
  default:
    throw new Error("Not implemented");
}

export default lib;
