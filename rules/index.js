const debug = require('debug')('rules:index');
debug('is starter');

const isRequire = (item) => { throw new Error(item + ': is queried!') };

const checkType = async (item, ...types) => {
  const type = item.constructor.name.toLowerCase();
  if (!types.includes(type)) {
    throw new Error('only types: ' + ((types.length) ? types.join(', ') : types[0]) + ' is allowed!');
  }
}

module.exports = {
  isRequire,
  checkType
}