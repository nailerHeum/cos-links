const faker = require('faker');
const LINK_COUNT = 20;
const categoryList = ['all', 'backend', 'frontend', 'iOS', 'swift']
const Link = require('./models/link');
const og = require('open-graph');
(async () => {
  for (let i = 0; i<LINK_COUNT; i++) {
    og(faker.internet.url(), async (err, meta) => {
      const dummyLink = new Link({
          author: faker.name.findName(),
          title: faker.name.title(),
          description: faker.lorem.sentence(),
          category: categoryList[Math.floor(Math.random() * categoryList.length)],
          url: faker.internet.url(),
          metadata: JSON.stringify(meta),
      });
      try{
        await dummyLink.save();
        console.log('ok');
      } catch (err) {
        throw new Error(err.message);
      }
    });
  }
})()