### Function
根据抓包得到的bangumi直链是不能直接下载的, 但是加上`Reference`就可以访问了.
但是需要注意的是, 这个`Reference`不是你浏览器地址栏的, 必须是抓的包中的.

> 使用了多线程下载, 可以最大化下载速率.

### Modify
根据抓包得到的链接, 更改`data.txt`中的数据
 - 第一行是`Reference`
 - 后续都是视频分片地址 一个链接一行
 - (现在的`data.txt`是个示例, 它的链接会变动, 所以现在这个示例估计是早就没用了)

### Usage
`python dl.py`

### requirement
```
requests
threading
```

### Announcement
使用本脚本发生的一切问题由使用者承担
