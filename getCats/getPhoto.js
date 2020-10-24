const axios = require('axios').create();
const { checkType, isRequire } = require('../rules');
const debug = require('debug')('getCats:getPhoto');
debug('is starter');

/**
 * flick image quality
 * 
 * s	miniatura	75	quadrado recortado
 * q	miniatura	150	quadrado recortado
 * t	miniatura	100	
 * m	pequeno	240	
 * n	pequeno	320	
 * w	pequeno	400	
 * (none)	médio	500	
 * z	médio	640	
 * c	médio	800	
 * b	grande	1024
*/

// implementação futura image quality


async function getRandomImageByTags(tags = isRequire('tags'), groupId, max = 1, quality = 'w') {
  try {

    debug('tags is: ' + tags + ' | max is: ' + max);

    await checkType(tags, 'string', 'array');
    await checkType(max, 'number');
    await checkType(quality, 'string');

    if (groupId) {
      await checkType(groupId, 'string')
    }

    const url = process.env.FLICKR_URL;

    if (typeof tags !== 'string') {
      tags = tags.length ? tags.join(',') : tags[0]
    }

    const params = {
      method: "flickr.photos.search",
      api_key: process.env.FLICKR_API_KEY,
      tags: tags,
      group_id: groupId,
      format: "json",
      nojsoncallback: 1,
      license: "1,2,4,5,7", // Creative Commons License.
      sort: "interestingness-desc",
      content_type: "1", // photos
      media: "photos",
      extras: "original_format",
      per_page: max,
      page: Math.floor((Math.random() * 50) + 1)
    }

    debug('Params : ' + JSON.stringify(params, null, 4));

    const { data } = await axios.get(url, { params });

    debug('photo from flickr: ' + JSON.stringify(data, null, 4));


    if (data.stat !== "ok") throw new Error('Flickr return - ' + data.message);

    const { photo } = data.photos;


    const photos = photo.map(item => {
      const {id, secret, server, farm,  title,originalsecret, originalformat } = item;
      return {
        img: `https://live.staticflickr.com/${server}/${id}_${secret}${quality !== '' ? '_' + quality : ''}.jpg`,
        imgOrig: `http://farm${farm}.staticflickr.com/${server}/${id}_${originalsecret}_o.${originalformat}`,
        title: title
      }
    });

    debug('photos links is: \n' +  JSON.stringify(photos, null, 4));

    return Promise.resolve(photos.sort(() => Math.random() - 0.5));
  } catch (err) {
    debug(err);
    return Promise.reject(err);
  }
}

module.exports = {
  getRandomImageByTags
}