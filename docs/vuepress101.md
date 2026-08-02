---
title: VuePress 1.x快速搭建部署
lang: zh-CN
description: Blogging with VuePress 1.x
date: '2022-02-27 02:22:00'
sidebar: 'auto'
meta:
 - name: description
   content: VuePress部署
 - name: keywords
   content: VuePress
categories:
 - 博客
tags:
 - VuePress
---

## VuePress入魔
> 用Hexo搭建的静态博客其实已经比较好用强大了，但是美中不足的一点是网页是全局刷新的，之前在Hexo的主页上其实我是放了播放器的，点击播放音乐也没有问题，但在切换内部页面的时候浏览器一刷新歌也就没有了，这一点体验并不好，而且由于不是局部刷新，这种跳转页面带来的闪烁感也不是特别的舒服。这段时间我也刚好在学Vue，10天前才了解到有VuePress这种用Vue驱动的静态网站，体验了一下别人的网页，确实比较舒服，基本上是秒响应，而且是单页面应用，并没有那种全局刷新的问题，非常的流畅，于是在学习完Vue的基本知识之后决定再淦一次，但官方文档写得似乎有点晦涩，于是我来一个101


### 1.环境准备
#### 1.1 安装VuepPress
首先还是需要node环境的，我习惯还是局部安装：
```shell
mkdir vuepress-blog && cd vuepress-blog # 创建博客目录并进入
npm init -y # 初始化项目
npm i -D vuepress # 局部安装VuePress
```

安装完之后可以检查一下版本信息：
这是当前我的版本：`vuepress/1.9.7 darwin-x64 node-v16.14.0`


#### 1.2 配置package.json
打开项目根目录的package.json，在scripts中添加两行，用于测试以及打包项目：
```shell
"scripts": {
  "dev": "vuepress dev docs",
  "build": "vuepress build docs"
}
```


#### 1.3 创建页面并Helloworld之
依然是项目根目录下，创建docs目录，这个目录比较关键，配置文件/静态资源等等的文件都会放在这：
```shell
mkdir docs && echo '# Hello World VuePress' > docs/README.md # 创建一个页面
npm run dev # 启动本地服务
```
看到`success [15:48:09] Build 2f6668 finished in 139 ms! ( http://localhost:8080/ )`类似输出就成功了，然后浏览器访问本地8080端口，VuePress的Hello World完成了~


### 2.VuePress目录结构
官方推荐的目录结构如下：
```shell
.
├── docs
│   ├── .vuepress (可选的)
│   │   ├── components (可选的)
│   │   ├── theme (可选的)
│   │   │   └── Layout.vue
│   │   ├── public (可选的)
│   │   ├── styles (可选的)
│   │   │   ├── index.styl
│   │   │   └── palette.styl
│   │   ├── templates (可选的, 谨慎配置)
│   │   │   ├── dev.html
│   │   │   └── ssr.html
│   │   ├── config.js (可选的)
│   │   └── enhanceApp.js (可选的)
│   │ 
│   ├── README.md
│   ├── guide
│   │   └── README.md
│   └── config.md
│ 
└── package.json
```
官方给的目录介绍如下：  
`docs/.vuepress`: 用于存放全局的配置、组件、静态资源等  
`docs/.vuepress/components`: 该目录中的 Vue 组件将会被自动注册为全局组件  
`docs/.vuepress/theme`: 用于存放本地主题  
`docs/.vuepress/styles`: 用于存放样式相关的文件  
`docs/.vuepress/styles/index.styl`: 将会被自动应用的全局样式文件，会生成在最终的 CSS 文件结尾，具有比默认样式更高的优先级  
`docs/.vuepress/styles/palette.styl`: 用于重写默认颜色常量，或者设置新的 stylus 颜色常量，可以修改页面的字体等等的颜色  
`docs/.vuepress/public`: 静态资源目录  
`docs/.vuepress/templates`: 存储 HTML 模板文件  
`docs/.vuepress/templates/dev.html`: 用于开发环境的 HTML 模板文件  
`docs/.vuepress/templates/ssr.html`: 构建时基于 Vue SSR 的 HTML 模板文件  
`docs/.vuepress/config.js`: 配置文件的入口文件，也可以是 YML 或 toml  
`docs/.vuepress/enhanceApp.js`: 客户端应用的增强  


是不是看完还很多问号？让我们先把文件创建好吧：
```shell
mkdir .vuepress && cd .vuepress
mkdir components/ theme/ public/ styles/ templates
touch config.js
```
其中，config.js这个配置文件比较重要，可以根据需要配置一些选项


### 3.配置首页布局
`docs/REAMME.md`这个根级的markdown文件是默认的博客首页，可以添加默认主题快速体验一下：
```yaml
---
home: true
heroImage: /logo.png
heroText: Hero 标题
tagline: Hero 副标题
actionText: 快速上手 →
actionLink: /zh/guide/
features:
- title: 简洁至上
  details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
- title: Vue驱动
  details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
- title: 高性能
  details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
footer: MIT Licensed | Copyright © 2018-present Evan You
---
```
其中，静态资源例如图片等可以放到`.vuepress/public`目录下，引用这些资源用`/`作为根路径即可，热部署后重新查看浏览器会发现主页的样式变化了，但一般我还是会使用其他大神写好的主题文件


### 4.使用来自依赖的主题
从GitHub中找到自己喜欢的VuePress主题后使用npm安装即可，一般安装后都需要在`.vuepress/config.js`中配置相关参数，而我正在使用的主题是[vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/)，安装就很简单了，下面列出部分我正在使用的参数项：
```javascript
module.exports = {
  // 部署站点的基础路径，如果是根路径或者有域名映射这个可以不设
  // base: '/vuepress/',
  // 网站的标题
  title: 'BNU A503\'s Blog', 
  // 网站的描述
  description: '塔塔开，塔塔开', 
  // 额外的需要被注入到当前页面的 HTML <head> 中的标签
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  // 自定义主题的名称
  theme: 'reco',
  // 为当前主题提供的一些配置
  themeConfig: {
    // 作者
    author: '瑞士军刀废',
    // 作者头像
    authorAvatar: '/avatar.jpg',
    // 设置为博客风格
    type: 'blog',
    // 导航栏 Logo，默认从.vuepress/public目录下找
    logo: '/logo.png',
    // 导航栏链接
    nav: [
      { text: 'Home', link: '/', icon: 'reco-home' },
      { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' },
      { text: 'Message', link: '/message/', icon: 'reco-message' }
    ],
    // 博客配置
    blogConfig: {
      category: {
        location: 2,     // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认文案 “分类”
      },
      tag: {
        location: 3,     // 在导航栏菜单中所占的位置，默认3
        text: 'Tag'      // 默认文案 “标签”
      },
      socialLinks: [     // 信息栏展示社交信息
        { icon: 'reco-github', link: '' },
        { icon: 'reco-weibo', link: '' },
        { icon: 'reco-bilibili', link: '' }
      ]
    },
    // 友链
    friendLink: [
      {
        title: '',
        desc: '',
        logo: '',
        link: ''
      }
    ],
    // 自动生成侧栏，原生属性
    sidebar: 'auto',
    // 子侧边栏是否打开
    subSidebar: 'auto',
    // Valine评论配置
    valineConfig: {
      appId: '',
      appKey: ''
    }
  },
  plugins: {
    // 音乐播放器插件
    'meting': {
      meting: {
        // 歌单
        auto: 'https://music.163.com/#/playlist?id=2272706820'
      },
      aplayer: {
        // 随机播放
        order: 'random'
      }
    }
  }
}
```

我打开了评论的功能，是[Valine](https://valine.js.org/)的插件，主题已经内置安装好，开箱即用，但是需要在[LeanCloud](https://www.leancloud.cn/)上注册然后使用其中的appId以及appKey

另外一个非常好用的插件是音乐播放器，[vuepress-plugin-meting](https://github.com/moefyit/vuepress-plugin-meting)，这个需要另外安装，支持整个歌单播放，真的非常的nice


### 5.写下第一篇文章吧
为方便管理，我会把博文统一放进一个目录下，以我的博客为例，我会在docs目录下新建一个目录articles来归类文章 之后只需要在该目录下新建markdown文件即可，例如我的第一篇文章可以起名为hellovuepress.md，保存编辑之后首页会自动显示文章


### 6.个性化主题
如果想要对依赖的主题进行个性化修改，可以先将主题拷贝出来：
```shell
npx vuepress eject
```
这个指令会创建`docs/.vuepress/theme`目录，里面就是主题的组件等等，VuePress会优先读取这里面的内容，可以放心的改，不必担心依赖更新后带来的覆盖


### 7.部署到GitHub
#### 7.1 部署脚本的准备
官方给出了一个`deploy.sh`脚本，可以方便把项目部署到GitHub：
```shell
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
```
上面有两点需要注意：  
- 如果是放到GitHub Pages的根目录，则把`git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master`这句脚本的注释放开，把里面的`USERNAME`替换为自己的GitHub账户名  
- 如果是像我一样，已经在GitHub Pages的根路径部署过静态网页，则需要在GitHub中用另一个仓库发布，把`git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages`这行脚本的注释放开，其中，`REPO`是仓库的名称，这个可以在GitHub新建一个任意名称的仓库，`USERNAME`同上


#### 7.2 如果有域名绑定
我之前在阿里云注册了一个域名，我把默认的`www.bstrong.xyz`二级域名解析到了GitHub Pages的`<USERNAME>.github.io`中，现在我想把`<USERNAME>.github.io/<REPO>`的地址解析到另一个二级域名`vuepress`中，例如：`vuepress.bstrong.xyz`，那么就需要在阿里云新增一项域名解析，同时，在`deploy.sh`中的`echo 'www.example.com' > CNAME`注释打开，把新的域名替换掉即可，而`.vuepress/config.js`中的`base`就不需要设置路径了，否则静态资源会因为路径问题找不到

#### 7.3 执行deploy.sh
最后一步了，切换到`docs`目录下，控制台中执行：
```shell
sh deploy.sh
```
在这一步我还踩了一下坑，是SSH登陆GitHub的问题，我另写了一篇文章谈这个问题，[有报错才看哦](/githubssh)  如果一路都很顺利，那恭喜你了~