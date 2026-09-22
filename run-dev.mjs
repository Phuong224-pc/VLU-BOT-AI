import { spawn } from 'child_process';

console.log("\n==========================================");
console.log("🚀 KHỞI ĐỘNG VLU SMART ASSISTANT FULLSTACK");
console.log("==========================================\n");

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// Khởi chạy Server Node.js (Port 5000)
const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: './server',
  stdio: 'inherit',
  shell: true
});

// Khởi chạy Client React Vite (Port 5173)
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: './client',
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log("\nĐang tắt các tiến trình VLU Assistant...");
  try { server.kill(); } catch (e) {}
  try { client.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
