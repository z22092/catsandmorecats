const { getRandomImageByTags } = require('./getPhoto');
const debug = require('debug')('getCats:index');
debug('is starter');


async function getCats (max) {

  const tags = ['cats', 'kitties'];
  const groupId = '10917369@N00'; //http://www.flickr.com/groups/cat-portraits/

  debug('max cats array: ' + max + ' | tags: ' + tags);

  return await getRandomImageByTags(tags, groupId, Number(max));
}

module.exports = {
  getCats
};
