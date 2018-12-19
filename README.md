<<<<<<< HEAD
# 小说cms，集手动上传TXT并自动分割、采集、对接追书api等功能为一体的独一无二的cms。
- 将网站运行目录设置为public目录
- 如果是NGINX，添加以下伪静态规则：
```
  if (!-e $request_filename) {  
      rewrite  ^(.*)$  /index.php?s=/$1  last;  
      break;  
	}  
```	
=======
# xiaoshuo
小说cms
>>>>>>> 0aa0a1a70474aa8f3ac81e9a844333173e82da8c
