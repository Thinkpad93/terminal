### 技术栈

vue + axios + swiper

> 项目结构

- css 样式文件
- html
- image images 文件夹下的图片是由后端生成的，主要是用于播放的图片访问该目录下的图片
- interaction 屏端底部互动区域所用到的图片
- js
  - mixin.js 业务实现
  - 其它的 js 文件都是第三方库文件
- local 当屏端出来网络断开的时候，显示要播放的图片
- theme layer.js 主题文件(暂时没有用到)
- video 后端生成的视频文件夹，用于播放视频的时候访问该目录下的视频
- child-default@2x.png 学生默认头像展示
- index.html 屏端播放主文件
- index.js 业务实现
- layer.js layer.js 弹出层文件
- punch-clock-success.png 学生打卡弹出用到的背景图片
- school_panel_content.js 后端后成的数据文件

> school_panel_content.js 是数据文件，后端启动项目后会定时生成这份文件，也就是说文件内容随时会改变
> school_panel_content.js 是要播放的内容数据
