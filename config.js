module.exports = {
  port: 3000,
  sitePath: 'site',
  distPath: 'dist',
  editBasePath: 'edit',
  siteConfig: 'config.json',
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
