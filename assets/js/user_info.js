$(function (){
    //
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if(value.length > 6) {
                return "昵称应该输入1··~6位之间"
            }
        }
    })

    //初始化用户信息
    initUserInfo()
    //初始化用户基本信息
    function initUserInfo(){
        //发送ajax
        $.ajax({
            url: '/my/userinfo',
            success: function(res){
                // console.log(res) 
                // 获取用户信息校验
                if(res.status !== 0) {
                    return layer.msg(res.message)
                }
                //展示用户信息
                form.val('formUserInfo', res.data)
            }
        })
    }

    //重置表单的数据
    var obj = null
    $("#btnReset").on('click', function(e){
        e.preventDefault()
        initUserInfo()
        // form.val('formUserInfo', obj)
        
    })

    //4.提交用户修改
    $(".layui-form").on("submit", function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg("用户信息更新失败！")
                } else {
                    layer.msg("用户信息更新成功！")
                    window.parent.getUserInfo()
                }
            }
        })
    })
})