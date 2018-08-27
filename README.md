###  项目说明


ssr项目是服务端渲染的单页应用（SSR+SPA），技术栈使用node、express、vue、vue-router、vuex。<br>
服务端渲染的单页应用技术特点：首次进入页面或刷新页面时，由server端调用接口、生成HTML输出给client（解决首屏显示速度和SEO问题），页面显示后再加载js；<br>
由ssr项目中某页面跳转 -> 至ssr项目中其他页面时，在client端调用接口构建HTML（此时client端js已经加载完成已具备渲染能力），这样做的好处是能够加快跳转速度、减少server端频繁渲染html压力；<br>
综合来说：一个全部由SSR+SPA页面组成的网站，只有打开网站第一个页面时是由server渲染页面，跳转其他页面都是在client端完成。同时解决了首屏打开速度、服务器压力、SEO问题。

###  项目本地开发方法

切换私有源，参考 http://wiki.bravetime.net/pages/viewpage.action?pageId=20381771

联系孙伟光开放注册功能

在项目根目录运行注册命令，注册（登录）统一使用：
```
npm login
```

输入姓名全拼、密码、公司邮箱

完成注册后安装npm模块：
```
npm install
```

安装完成后运行，即可构建代码
```
npm run server 构建server端运行代码
npm run client 构建client端运行代码
```

构建结束后，再打开一个新的终端，启动服务
```
npm run service
```

配置charles代理，才可在本地查看效果
配置方法 http://wiki.bravetime.net/pages/viewpage.action?pageId=20381779

Charles下载完成后，导入配置文件（项目根目录下Map Local.xml）
Tools -> Map Local -> Import，
导入后将[/Users/swg/code/v/ssr]改为ssr项目在自己电脑上的路径

修改DNS将对服务器端的请求代理到本地服务器，
导入配置文件（项目根目录下DNS Spoofing.xml）
Tools -> DNS Spoofing -> Import
导入后将[18686604386.davdian.com]改为浏览器上正在访问的域名

本项目使用6000号段，本地调试使用6001端口，
比如本地调试首页访问 http://18686604386.davdian.com:6001/

发布到服务器使用新的工单（自行申请）：releasefe_node_unprod_all、releasefe_node_prod_ops

恭喜配置完成!

```
开发中的小提示：vue生命周期beforeMount之后方法只在client端被调用，服务端最多只调用到created方法，这是最大的区别。
```

下面做一些其它记录，无须理会：
```
pm2启动命令:
sudo chmod 777 /data/logs/fe/
pm2 start pm2.start.config.js -- env=prod mini=true
pm2 restart ssr -- env=prod mini=true num=xx

启动编译:
npm start
cd /Users/swg/code/v/ssr/node_modules/dvd-base-build-node-ssr; npm run compile; cd /Users/swg/code/v/ssr; npm start;

启动服务：
sudo npm run server
cd /Users/swg/code/v/ssr/node_modules/dvd-base-build-node-ssr; npm run compile; cd /Users/swg/code/v/ssr; sudo mini=true npm run server;
```
