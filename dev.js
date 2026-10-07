import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting LearnAble in Development Mode...');
console.log('--------------------------------------------------');

// 1. Start Backend Express API Server on Port 5000
const serverPath = path.join(__dirname, 'server', 'server.js');
const serverProcess = spawn('node', [serverPath], {
  cwd: path.join(__dirname, 'server'),
  env: { ...process.env, PORT: '5000' },
  stdio: ['inherit', 'pipe', 'pipe']
});

serverProcess.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => console.log(`\x1b[36m[API 5000]\x1b[0m ${line}`));
});

serverProcess.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => console.error(`\x1b[31m[API ERR]\x1b[0m ${line}`));
});

// 2. Start Frontend Vite Client on Port 3000
const viteBin = path.join(__dirname, 'client', 'node_modules', 'vite', 'bin', 'vite.js');
const clientProcess = spawn('node', [viteBin, '--host', '0.0.0.0', '--port', '3000'], {
  cwd: path.join(__dirname, 'client'),
  env: process.env,
  stdio: ['inherit', 'pipe', 'pipe']
});

clientProcess.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => console.log(`\x1b[32m[CLIENT 3000]\x1b[0m ${line}`));
});

clientProcess.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => console.error(`\x1b[33m[CLIENT WARN]\x1b[0m ${line}`));
});

// Clean shutdown handler
const cleanExit = () => {
  console.log('\n🛑 Shutting down LearnAble development servers...');
  try { serverProcess.kill(); } catch {}
  try { clientProcess.kill(); } catch {}
  process.exit(0);
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
process.on('exit', cleanExit);

serverProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\x1b[31m[API]\x1b[0m Server process exited with code ${code}`);
  }
});

clientProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\x1b[31m[CLIENT]\x1b[0m Client process exited with code ${code}`);
  }
});
