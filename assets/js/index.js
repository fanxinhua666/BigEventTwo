$(function(){
    getUserInfo()
     // 退出登录，2引入layer
     var layer = layui.layer

     $("#btnlogout").on("click", function(){
         //3..0提示
         layer.confirm('确定退出吗',{icon: 3,title: '提示'},function(index){
             // console.log('ok')
             // 0.关闭提示框
             layer.close(index)
             //1.清空本地存储中的token
             localStorage.removeItem('token')
             //2.重新跳转到登录页面
             location.href = './login.html'
             
         })
         
     })
})

//获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers 就是请求头的配置对象
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用renderAvatar（）渲染用户的头像
            renderAvatar(res.data)
        }
    })
}

//渲染用户的头像
function renderAvatar(user){
    //1获取用户名称
    var name = user.nickname || user.username
    //2设置欢迎文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
    // 3按需渲染用户头像
    if(user.user_pic !== null){
        //3.1渲染图片头像
        $(".layui-nav-img").attr('src', user.user_pic).show()
        $(".text-avatar").hide()
    } else {
        // 3.2渲染文本头像
        $(".layui-nav-img").hide()
        var first = name[0].toUpperCase()
        $(".text-avatar").html(first).show()
    }
}