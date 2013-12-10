# 离线Sebug

![image](https://raw.github.com/ChiChou/offlineSebug/master/screenshot.png)

这是一个可以整站抓取SEBUG漏洞库的脚本，并支持保存漏洞信息中的外链为PDF快照。
分为抓取和WEB展示两个组件。

## 配置
运行npm install安装所需组件
按需修改配置（默认也可）

## 抓取
* 修改config变量以设定抓取的区间（如只需要0~100页）
* 运行`node crawler.js`，程序将把抓取到的内容保存在result/sebug.db中
* 整个抓取时间取决于您的网络环境和抓取区间范围，如我在抓取整站内容的时候耗时约7小时

## WEB界面
抓取完成后，运行`node reader.js`即可。
