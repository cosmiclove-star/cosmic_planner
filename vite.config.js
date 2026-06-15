import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Copiar automáticamente la conversación y los artefactos al iniciar/compilar
try {
  const homeDir = os.homedir();
  const brainDir = path.join(homeDir, '.gemini/antigravity-ide/brain/c3cfa7bc-07a0-4c4a-9c1f-d140d25da687');
  const backupDir = path.resolve('.cosmic-love-backup');
  
  function copyFolderSync(from, to, excludeDirs = []) {
    if (!fs.existsSync(from)) return;
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to, { recursive: true });
    }

    const elements = fs.readdirSync(from);
    for (const element of elements) {
      const fromPath = path.join(from, element);
      const toPath = path.join(to, element);

      const stat = fs.lstatSync(fromPath);
      if (stat.isDirectory()) {
        if (excludeDirs.includes(element)) continue;
        copyFolderSync(fromPath, toPath, excludeDirs);
      } else {
        fs.copyFileSync(fromPath, toPath);
      }
    }
  }

  copyFolderSync(brainDir, backupDir, ['.system_generated', '.tempmediaStorage']);
  const logsSrc = path.join(brainDir, '.system_generated', 'logs');
  const logsDest = path.join(backupDir, 'historial_conversacion');
  copyFolderSync(logsSrc, logsDest);
  console.log('Copia de seguridad del proyecto y conversaciones completada en .cosmic-love-backup/');
} catch (err) {
  console.error('Error al realizar la copia de seguridad:', err);
}

// Copiar automáticamente la imagen de fondo al iniciar/compilar
try {
  const homeDir = os.homedir();
  const brainDir = path.join(homeDir, '.gemini/antigravity-ide/brain/c3cfa7bc-07a0-4c4a-9c1f-d140d25da687');
  
  if (fs.existsSync(brainDir)) {
    const files = fs.readdirSync(brainDir);
    const mediaJpg = files.find(f => f.startsWith('media__') && f.endsWith('.jpg'));
    if (mediaJpg) {
      const src = path.join(brainDir, mediaJpg);
      const destDir = path.resolve('public');
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      const dest = path.join(destDir, 'bg-wedding.jpg');
      fs.copyFileSync(src, dest);
      console.log(`Imagen de fondo (${mediaJpg}) copiada con éxito a public/bg-wedding.jpg`);
    } else {
      console.log('Imagen de fondo de origen no encontrada en el brain, omitiendo copia.');
    }
  }
} catch (err) {
  console.error('Error al copiar la imagen de fondo:', err);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/.cosmic-love-backup/**']
    }
  }
})

