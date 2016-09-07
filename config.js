module.exports = {
  port: 3000,
  sitePath: 'site',
  distPath: 'dist',
  editBasePath: 'edit',
  productionUrl: 'http://ssg-cms-test.s3-website-us-west-2.amazonaws.com/',
  s3Config: {
    key: process.env.SSGCMS_AWS_KEY,
    secret: process.env.SSGCMS_AWS_SECRET,
    region: process.env.SSGCMS_AWS_REGION,
    bucket: process.env.SSGCMS_AWS_BUCKET,
  },
  editors: [
    {
      previewPath: '/',
      name: 'config',
      title: 'Site-wide config',
      source: {
        filename: 'config.json',
        type: 'json',
      },
      fields: [
        {
          title: 'Site Title',
          path: 'locals.title',
          type: 'text',
        },
        {
          title: 'Site Logo',
          path: 'locals.logo',
          type: 'file',
          basePath: 'contents/images',
          configPrefix: 'images',
        },
      ],
    },
    {
      previewPath: '/',
      name: 'list',
      title: 'Item list config',
      source: {
        filename: 'config.json',
        type: 'json',
      },
      fields: [
        {
          title: 'Item list',
          path: 'locals.itemList',
          type: 'list',
          itemFields: [
            {
              title: 'Image',
              path: 'imgSrc',
              type: 'file',
              basePath: 'contents/images/list',
              configPrefix: 'images/list',
            },
            {
              title: 'Name',
              path: 'prop',
              type: 'text',
            },
            {
              title: 'Description',
              path: 'otherProp',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      previewPath: '/',
      name: 'index',
      title: 'Homepage',
      source: {
        filename: 'contents/index.md',
        type: 'md',
      },
      fields: [
        {
          title: 'Page title',
          path: 'meta.title',
          type: 'text',
        },
        {
          title: 'Body',
          path: 'markdown',
          type: 'textarea',
        },
      ],
    },
  ],
};
