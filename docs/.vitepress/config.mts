import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Jack's Blog",
  description: "A VitePress Site",
  head: [['link', { rel: 'icon', href: '/home.jpg' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/home.jpg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: '部署运维', items: [
        { text: 'Docker备忘录', link: '/docker101' },
        { text: 'VMware配置静态ip', link: '/vmware-config' },
        { text: 'SSH免密登陆GitHub', link: '/githubssh' }
      ]},
      { text: '数据库', items: [
        { text: 'MySQL踩坑记录', link: '/mysql-troblesome' },
        { text: 'Oracle批量事务更新', link: '/oracle-batch-commit' }
      ]}
    ],

    sidebar: [
      {
        text: '部署运维',
        items: [
          { text: 'Docker备忘录', link: '/docker101' },
          { text: 'Docker配置Elasticsearch', link: '/elasticsearch101' },
          { text: '修改Docker端口映射参数', link: '/modify-docker-port' },
          { text: 'MacOS配置SSH免密登陆GitHub', link: '/githubssh' },
          { text: 'VMware配置虚拟机静态ip地址', link: '/vmware-config' },
          { text: '部署VuePress到Tomcat服务器', link: '/deploy-vuepress-to-tomcat' },
          { text: '将博客的http协议更改为https', link: '/https-protocol-config' }
        ]
      },
      {
        text: '数据库',
        items: [
          { text: 'MySQL踩坑记录', link: '/mysql-troblesome' },
          { text: 'Oracle批量事务更新大量数据', link: '/oracle-batch-commit' }
        ]
      },
      {
        text: '博客',
        items: [
          { text: 'VuePress 1.x快速搭建部署', link: '/vuepress101' }
        ]
      },
      {
        text: '软件',
        items: [
          { text: '一些个人常用的macOS生产力软件推荐', link: '/useful-mac-app' }
        ]
      },
      {
        text: '其他',
        items: [
          { text: 'Todo list', link: '/todolist' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/chikit-lo' }
    ],
    
    footer: {
      copyright: 'Copyright © 2026-present Jack Lo'
    },
    
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '输入你想搜索的关键字',
            buttonAriaLabel: '搜索'
          },
          modal: {
            noResultsText: '没有查到相关内容',
            resetButtonTitle: '清除',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    }
  }
})
