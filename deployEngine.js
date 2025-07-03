import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function deployBot({
  GITHUB_USERNAME,
  SESSION_ID,
  OWNER_NAME,
  OWNER_NUMBER,
  SUDO_NUMBER = OWNER_NUMBER
}) {
  const repoUrl = `https://github.com/${GITHUB_USERNAME}/INCONNU-XD-V2.git`;
  const localPath = path.join(os.tmpdir(), `INCONNU-${Date.now()}`);

  const git = simpleGit();
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

  await git.cwd(localPath);
  await git.add('.env');
  await git.commit('🚀 AutoDeploy: Nouveau fichier .env par DEPLOYED INCONNU XD WEB');
  await git.push('origin', 'main');
}
