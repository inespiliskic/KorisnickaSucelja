import { spawn } from "node:child_process";
import process from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");

// Pokreni lokalno instalirani Next.js direktno preko Nodea.
// Time izbjegavamo Windows npx.cmd/spawn EINVAL problem.
const devServer = spawn(process.execPath, [nextBin, "dev"], {
  cwd: projectRoot,
  stdio: ["inherit", "pipe", "pipe"],
  shell: false,
});

let opened = false;

function openBrowser() {
  if (opened) return;
  opened = true;

  const url = "http://localhost:3000";

  try {
    if (process.platform === "win32") {
      const child = spawn("cmd.exe", ["/d", "/s", "/c", "start", "", url], {
        detached: true,
        stdio: "ignore",
        shell: false,
        windowsHide: true,
      });
      child.unref();
    } else if (process.platform === "darwin") {
      spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
    } else {
      spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
    }
  } catch {
    console.log(`\nCoinTracker je dostupan na: ${url}`);
  }
}

function handleChunk(chunk, target) {
  const text = chunk.toString();
  target.write(text);

  // Next.js može ispisati "Ready", "Local:" ili URL ovisno o verziji.
  if (/Ready|Local:|http:\/\/localhost:3000/i.test(text)) {
    openBrowser();
  }
}

devServer.stdout.on("data", (chunk) => handleChunk(chunk, process.stdout));
devServer.stderr.on("data", (chunk) => handleChunk(chunk, process.stderr));

devServer.on("error", (error) => {
  console.error("Ne mogu pokrenuti Next.js development server:", error.message);
  console.error("Provjeri jesi li prvo pokrenula: npm install");
  process.exit(1);
});

devServer.on("exit", (code) => process.exit(code ?? 0));

process.on("SIGINT", () => devServer.kill("SIGINT"));
process.on("SIGTERM", () => devServer.kill("SIGTERM"));
