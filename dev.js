import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  🚀 Iniciando NovaEdu ERP...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 1. Iniciar servidor backend
console.log('  📡 Levantando servidor backend (puerto 3000)...');
const backend = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// 2. Iniciar servidor frontend (Vite)
console.log('  ⚡ Levantando frontend (Vite)...');
const frontend = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// Manejar cierre correcto de ambos procesos
const handleExit = () => {
  console.log('\n  👋 Apagando servicios...');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('exit', handleExit);
