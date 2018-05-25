# EGO
一个二次元绘画作品分享网站。<br> 
所有交互及AJAX请求均通过原生JavaScript实现，不使用第三方框架和库（如jQuery）。<br> 
PS：后端由网易云提供，限制了访问频率。因此部分AJAX请求会被挂起，导致页面渲染不完整、交互无法及时反馈。<br> 
主页demo：https://jouryfirst.github.io/EGO/public/html/index.html<br> 
上传作品页demo：https://jouryfirst.github.io/EGO/public/html/works/create.html<br> 
作品列表页demo：https://jouryfirst.github.io/EGO/public/html/works/list.html<br> 

实现功能：<br> 
    •	首页<br> 
      i	顶部tab<br> 
       a	有选中效果<br> 
       b	hover动画效果<br> 
ii	顶部搜索<br> 
a	输入非空进行搜索操作<br> 
b	回车和点击图标都可进行搜索操作<br> 
iii	登录后顶部展示用户信息<br> 
a	用户名很长…显示<br> 
b	hover出现下拉列表<br> 
c	点击“退出登录”退出，跳转到首页<br> 
iv	轮播图<br> 
a	图片垂直剧中<br> 
b	图片5s切换（500ms淡入淡出）<br> 
c	点击指示器定位到指定图片<br> 
d	hover上去轮播停止，hover退出轮播继续<br> 
e	图片可以通过鼠标拖动切换<br> 
v	明日之星<br> 
a	通过Ajax获取推荐关注列表<br> 
b	未登录时，点击关注，弹出登录弹窗<br> 
c	已登录时，关注和取消关注功能可用<br> 
vi	侧边热门话题2行显示，文字太多直接截断<br> 
•	登录<br> 
i	数据验证<br> 
a	手机号非空，11位数字<br> 
b	密码非空<br> 
c	验证失败，相应输入框变红<br> 
ii	登录<br> 
a	登录功能可用<br> 
b	登录成功后，如果在首页，首页的明日之星列表需要刷新数据<br> 
c	登录不成功，显示错误<br> 
iii	点击立即注册，关闭登录弹窗，弹出注册弹窗<br> 
iv	点击关闭图标，弹窗关闭<br> 
•	注册<br> 
i	级联选择器可用<br> 
a	地区数据正确<br> 
b	生日数据，大小月30/31日，闰年2月29日数据正确<br> 
ii	验证码<br> 
a	验证码显示正确<br> 
b	点击验证码更新<br> 
iii	表单验证<br> 
a	手机号非空，11位数字<br> <br> 
b	昵称中文英文数字均可，至少8个字符<br> 
c	密码长度6-16位字符<br> 
d	验证失败，相应输入框变红<br> 
iv	注册<br> 
a	注册功能可用<br> 
b	注册成功关闭注册弹窗，打开登录弹窗<br> 
c	注册不成功，显示错误<br> 
•	我的作品<br> 
i	年龄、星座、城市名计算正确。<br> 
ii	作品列表加载正常，加载列表期间要显示loading图标，没有作品时有文案提示。<br> 
iii	分页功能正常可用。<br> 
•	上传作品<br> 
i	表单元素行为正常：<br> 
a	作品分类按钮组状态互斥<br> 
b	权限设置按钮组状态互斥<br> 
c	作品授权的模拟下拉菜单<br> 
ii	图片上传功能可用：<br> 
a	实现上传图片本地预览<br> 
b	图片可以批量上传<br> 
c	上传过程中可以添加新图片、取消未上传完成的旧图片<br> 
d	每张图片上传过程中均有进度条<br> 
e	单张图片的大小小于1MB<br> 
f	每次最多选择10张图片，超过10张要有弹窗提示<br> 
g	设置封面功能正常<br> 
iii	标签组件功能可用：<br> 
a	加载系统推荐标签<br> 
b	标签可删除<br> 
c	标签可添加<br> 
iv	表单可正常提交<br> 
a	不丢失任何数据信息<br> 
b	提交前需要检查作品名称是否为空<br> 
