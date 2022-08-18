const chalk = require('chalk')

const getTimeStamp = () => {
  const date = new Date()
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const info = (namespace, message, object) => {
  if (object) {
    console.log(chalk.green(`[${getTimeStamp()}] [${namespace}] [INFO] ${message}`, object))
  } else {
    console.log(chalk.green(`[${getTimeStamp()}] [${namespace}] [INFO] ${message}`))
  }
}

const warn = (namespace, message, object) => {
  if (object) {
    console.warn(chalk.green(`[${getTimeStamp()}] [${namespace}] [WARN] ${message}`, object))
  } else {
    console.warn(chalk.yellow(`[${getTimeStamp()}] [${namespace}] [WARN] ${message}`))
  }
}

const error = (namespace, message, object) => {
  if (object) {
    console.error(chalk.red(`[${getTimeStamp()}] [${namespace}] [ERROR] ${message}`, object))
  } else {
    console.error(chalk.red(`[${getTimeStamp()}] [${namespace}] [ERROR] ${message}`))
  }
}

const debug = (namespace, message, object) => {
  if (object) {
    console.debug(chalk.blue(`[${getTimeStamp()}] [${namespace}] [DEBUG] ${message}`, object))
  } else {
    console.debug(chalk.blue(`[${getTimeStamp()}] [${namespace}] [DEBUG] ${message}`))
  }
}

module.exports = {
  info,
  warn,
  error,
  debug
}
