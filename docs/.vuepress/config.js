module.exports = {
  title: 'Hello Vuepress',
  description: 'Just playing around',
  theme: 'reco',
  themeConfig: {
    subSidebar: 'auto',
    nav: [
      {
        text: '首页',
        link: '/ada',
      },
      {
        text: 'blog',
        items: [
          { text: 'github', link: 'https://github.com/mqyqingfeng' },
          {
            text: 'juejin',
            link: 'https://juejin.cn/user/712139234359182/posts',
          },
        ],
      },
    ],
    sidebar: [
      {
        title: '欢迎学习',
        path: '/',
        collapsable: false, // 不折叠
        children: [{ title: '学前必读', path: '/' }],
      },
      {
        title: '基础学习',
        path: '/handbook/ConditionalTypes',
        collapsable: false, // 不折叠
        children: [
          { title: '条件类型', path: '/handbook/ConditionalTypes' },
          { title: '泛型', path: '/handbook/Generics' },
        ],
      },
    ],
  },
  locales: {
    '/': {
      lang: 'zh-CN',
    },
  },
};
