const router = require('express').Router();
const debug = require('debug')('server:router');
const path = require('path');
const { isRequire } = require('../rules');

debug('is starter');

const { getCats } = require('../getCats');

router.get('/cats', async (req, res) => {
  try {

    calaboca

    const { max } = req.query;

    if (!max) {
      isRequire("max") 
    }
    
    debug('Photo array length max: ' + max );

    const cats = await getCats(max);

    res.status(200).json(cats);

  } catch (err) {
    res.status(500).send(err.toString())
    debug(err);

    // res.status(500).sendFile(path.join(__dirname,  `../public/images/httpErrors/${500}.jpg`));
  }
});

module.exports = router
