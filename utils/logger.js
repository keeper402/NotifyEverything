const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf(
            (info) =>
                `${[info.timestamp]} [${info.level}]: ${info.message}`
        )
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log/error.log', level: 'error' }),
        new transports.File({ filename: 'log/combined.log' })
    ]
});

logger.info('Hello, Winston!');
logger.error('Oops, something went wrong!');

module.exports = logger;