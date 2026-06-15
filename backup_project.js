import fs from 'fs';
import path from 'path';
import os from 'os';

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
      console.log(`Copiado: ${element}`);
    }
  }
}

try {
  console.log('Iniciando copia de seguridad de la conversación y artefactos...');
  
  // Copiar archivos de la raíz (md, metadata, media)
  copyFolderSync(brainDir, backupDir, ['.system_generated', '.tempmediaStorage']);
  
  // Copiar historial de conversaciones (transcript.jsonl)
  const logsSrc = path.join(brainDir, '.system_generated', 'logs');
  const logsDest = path.join(backupDir, 'historial_conversacion');
  copyFolderSync(logsSrc, logsDest);

  console.log('\n¡Copia de seguridad completada con éxito!');
  console.log(`Los archivos se han guardado en la carpeta: ${backupDir}`);
  console.log('Puedes copiar toda la carpeta del proyecto a otro ordenador y tendrás todo a mano.');
} catch (error) {
  console.error('Error al realizar la copia de seguridad:', error);
}
