const winston = require('winston');

function formatTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type) => parts.find(p => p.type === type).value;

  return `[${get('year')}-${get('month')}-${get('day')} ` + `${get('hour')}:${get('minute')}:${get('second')}]`;
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: () =>formatTime(),
    }),
    winston.format.printf(
      info => `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    // Add file logging if you want:
    // new winston.transports.File({ filename: 'automation.log' })
  ],
});

module.exports = logger;
