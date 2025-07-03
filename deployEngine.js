import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

export async function deployBot({
  GITHUB_USERNAME,
  SESSION_ID,
  OWNER_NAME,
  OWNER_NUMBER,
  SUDO_NUMBER = OWNER_NUMBER,
  onLog
}) {
  const repoUrl = `https://github.com/${GITHUB_USERNAME}/INCONNU-XD-V2.git`;
  const localPath = path.join(os.tmpdir(), `INCONNU-${Date.now()}`);

  const git = simpleGit();

  onLog(`📥 Clonage du repo ${repoUrl}...\n`);
  await git.clone(repoUrl, localPath);

  const envContent = `
SESSION_ID="${SESSION_ID}"
PREFIX=.
OWNER_NUMBER=${OWNER_NUMBER}
SUDO_NUMBER=${SUDO_NUMBER}
OWNER_NAME="${OWNER_NAME}"
AUTO_STATUS_SEEN=true
AUTO_BIO=true
AUTO_STATUS_REACT=true
AUTO_READ=false
AUTO_RECORDING=false
AUTO_REACT=false
STATUS_READ_MSG=STATUS VIEWED BY INCONNU XD V2 ✅
ANTILINK=false
ANTIBOT=true
ANTIBOT_WARNINGS=3
REJECT_CALL=false
NOT_ALLOW=true
MODE=public
WELCOME=false
`;

  fs.writeFileSync(path.join(localPath, '.env'), envContent.trim());
  onLog('✅ Fichier .env créé.\n');

  onLog('📦 Installation des dépendances...\n');
  await runCommand('npm', ['install'], localPath, onLog);

  onLog('🚀 Lancement du bot...\n');
  const botProcess = spawn('npm', ['start'], { cwd: localPath, shell: true });

  botProcess.stdout.on('data', (data) => {
    onLog(`🟢 ${data.toString()}`);
  });
  botProcess.stderr.on('data', (data) => {
    onLog(`🔴 ${data.toString()}`);
  });
  botProcess.on('close', (code) => {
    onLog(`⚠️ Bot terminé avec le code ${code}\n`);
  });
}

async function runCommand(command, args, cwd, onLog) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { cwd, shell: true });
    proc.stdout.on('data', (data) => onLog(`🟢 ${data.toString()}`));
    proc.stderr.on('data', (data) => onLog(`🔴 ${data.toString()}`));
    proc.on('close', (code) => {
      if (code !== 0) reject(new Error(`Commande échouée avec code ${code}`));
      else resolve();
    });
  });
}
