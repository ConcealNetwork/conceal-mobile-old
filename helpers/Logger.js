export const logger = {
  log: (msg, l=null) => {
    const level = l || 'debug';
    const colors = {
      debug: '#666',
      info: '#297aeb',
      warn: '#ff8426',
      error: '#f00',
    };
    const prefix = `[${level.toUpperCase()}]`;
    const spaces = prefix.length < 7 ? ' '.repeat(7 - prefix.length) : '';
    console.log(`%c ${prefix}${spaces} ${new Date().toUTCString()} | ${msg}`, `color: ${colors[level]}`);
  },
};
