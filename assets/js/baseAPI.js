//注意：每次调用$.get()|$.post()|$.ajax()的时候
//会先调用ajaxprofilter（这个函数）
//在这个函数中，可以拿到我们给ajax提供的配置对象
baseURL='http://ajax.frontend.itheima.net'
$.ajaxPrefilter(function(options){
  
  //在发起真正的ajax请求之前，统一拼接请求的根路径
  options.url = 'http://ajax.frontend.itheima.net' + options.url
//   console.log(options.url)
   // 统一为有权限的接口设置headers请求头
   if(options.url.indexOf('/my/') !== -1){
    options.headers = {
        Authorization: localStorage.getItem('token') || ''
    }
}
//全局统一挂载complete 回调函数
options.complete = function(res){
    var data = res.responseJSON
    // console.log('complete回调了')
    // console.log(data)
    if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        localStorage.removeItem('token')
        location.href = './login.html'
    }
}
})