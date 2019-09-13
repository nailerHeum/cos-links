const express = require('express');
const router = express.Router();
const Link = require('../models/link');
const INITIAL_PAGE_NUMBER = 1;
const PAGE_LIMIT = 9;
const FIXED_CATEGORIES = ['all', 'backend', 'frontend', 'iOS', 'swift'];
const og = require('open-graph');
const verifyApiUser = require('../middlewares/api-auth');

/**
 * @swagger
 * definitions:
 *   Link:
 *     properties:
 *       author: 
 *         type: string
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       category:
 *         type: string
 *       url:
 *         type: string
 *       metadata: 
 *         type: string
 */


router.post('/link', verifyApiUser,async (req, res) => {
  const { author, title, description, category, url } = req.body;
  if (!url) {
    res.status(400).json({
      message: "No URL!",
    });
  }
  og(url, async (err, meta) => {
    console.log(meta);
    const newLink = new Link({
      author: author,
      title: title,
      description: description,
      category: category,
      url: url,
      metadata: JSON.stringify(meta),
    });
    try{
      await newLink.save();
      res.status(201).json({  // redirection이 필요한지?
        message: "Link Created!",
      });
    } catch (err) {
      res.status(500).json({
        message: "Link Creation Error",
      });
    }
  });
});

/**
 * @swagger
 * /v1:
 *   get:
 *     tags:
 *       - Links
 *     description: Get links with some conditions
 *     parameters:
 *       - name: author
 *         description: author of links
 *         in: path
 *         required: false
 *         type: string
 *       - name: page
 *         description: current page of links
 *         in: path
 *         required: false
 *         type: integer
 *       - name: category
 *         description: specific category of links 
 *         in: path
 *         required: false
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of links
 *         schema:
 *           type: object
 *           properties:
 *             links:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Link'
 *                 totalDocs:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 hasPrevPage:
 *                   type: boolean
 *                 hasNextPage:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 pagingCounter:
 *                   type: integer
 *                 prevPage:
 *                   type: integer
 *                 nextPage:
 *                   type: integer
 *             categories:
 *               type: array
 *               items:
 *                 type: string
 *                 
 */
router.get('/', verifyApiUser,async (req, res) => {
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
  };
  if (requestCategory === undefined || requestCategory === 'all') {
    query.category = /.*/;
  } else {
    query.category = requestCategory;
  }
  if (requestAuthor) {
    query.author = requestAuthor;
  }

  links = await Link.paginate(query, options);
  res.status(200).json({
    links: links,
    categories: FIXED_CATEGORIES,
  });
});


router.get('/rank', async (req, res) => {
  const ranks = await Link.aggregate(
    [{
      $group : {
        _id : { author: "$author" },
        totalLinks: { $sum: 1 }
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
  const results = ranks.slice(0,10);

  res.status(200).json({
    ranking: results,
  });
})

module.exports = router;
