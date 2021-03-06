const express = require('express');
const router = express.Router();
const Link = require('../models/link');
const INITIAL_PAGE_NUMBER = 1;
const PAGE_LIMIT = 9;
const FIXED_CATEGORIES = ['all', 'backend', 'frontend', 'iOS', 'swift'];
const og = require('open-graph');
const verifyApiUser = require('../middlewares/api-auth');

router.post('/link', verifyApiUser, async (req, res) => {
  const {
    author,
    title,
    description,
    category,
    url
  } = req.body;
  if (!url) {
    res.status(400).json({
      message: "No URL!",
    });
  }
  og(url, async (err, meta) => {
    const newLink = new Link({
      author: author,
      title: title,
      description: description,
      category: category,
      url: url,
      metadata: JSON.stringify(meta),
    });
    try {
      await newLink.save();
      res.status(201).json({ // redirection이 필요한지?
        message: "Link Created!",
      });
    } catch (err) {
      res.status(500).json({
        message: "Link Creation Error",
      });
    }
  });
  return;
});

router.get('/', verifyApiUser, async (req, res) => {
  // const isIosApp = req.headers['user-agent'].includes('codesquad-blog-collection');
  let requestAuthor = req.query.author;
  let requestPage = req.query.page;
  let requestCategory = req.query.category;
  let links = {};
  let query = {};
  if (requestPage === undefined) {
    requestPage = INITIAL_PAGE_NUMBER;
  }
  const options = {
    page: requestPage,
    limit: PAGE_LIMIT,
    sort: {
      _id: -1,
    }
  };
  if (requestCategory === undefined || requestCategory === 'all') {
    query.category = /.*/;
  } else {
    query.category = requestCategory;
  }
  if (requestAuthor) {
    query.author = requestAuthor;
  }
  try {
    links = await Link.paginate(query, options);
    res.status(200).json({
      links: links,
      categories: FIXED_CATEGORIES,
    });
  } catch (mongodbError) {
    console.log(mongodbError);
    res.status(500).json({
      message: "Mongodb Selection Error",
    })
  }
});


router.get('/rank', async (req, res) => {
  const ranks = await Link.aggregate(
    [{
      $group: {
        _id: {
          author: "$author"
        },
        totalLinks: {
          $sum: 1
        }
      }
    }]
  );
  ranks.sort((a, b) => {
    if (a.totalLinks < b.totalLinks) {
      return 1;
    }
    if (a.totalLinks > b.totalLinks) {
      return -1;
    }
    return 0;
  });
  const results = ranks.slice(0, 10);

  res.status(200).json({
    ranking: results,
  });
})

module.exports = router;