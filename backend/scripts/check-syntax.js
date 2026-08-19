import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = join(directory, entry.name);
    return entry.isDirectory() ? files(target) : entry.name.endsWith(".js") ? [target] : [];
  });
}

for (const file of files(fileURLToPath(new URL("../src", import.meta.url)))) {
  execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
}
