import fs from 'fs';

const logStream = fs.createWriteStream('./logfile.log', { flags: 'a' }); // 'a' for append mode

function logMsg(message) {
  logStream.write(`${new Date().toISOString()} - ${message}\n`);
}

export { logMsg };
