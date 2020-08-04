$(function () {
    var layer = layui.layer
    var form = layui.form
    // 1定义加载文章分类的方法
    initCate()
    //2初始化富文本编辑器
    initEditor()

    //1定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章失败!')

                }
                //调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id').html(htmlStr)
                //一定要记得调用form.render()方法
                form.render()
            }
        })
    }

       // 1. 初始化图片裁剪器
       var $image = $('#image')

       // 2. 裁剪选项
       var options = {
           aspectRatio: 400 / 280,
           preview: '.img-preview'
       }
   
       // 3. 初始化裁剪区域
       $image.cropper(options)

    //为选择封面的按钮绑定点击事件处理函数
    $('#btnChooseImage').on('click', function(){
        $('#coverFile').click()
    })

    //监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e){
        //获取到文件的列表数组
        var files = e.target.files
        //判断用户是否选择了文件
        if(files.length === 0){
            return
        }
        //根据文件，创建对应的url地址
        var newImaURL = URL.createObjectURL(files[0])
        //为裁剪区域重新设置图片
        $image 
          .cropper('destroy') //销毁就的裁剪区域
          .attr('src', newImaURL) //重新设置图片路径
          .cropper(options) //重新初始化裁剪区域
    })
 //5.1锁定发布状态
 var state = '已发布'
 $('#btnSave2').click(function(){
     state = '草稿'
 })
//  5.2确定发布状态
// $('#btnSave1').click(function(){
//     state =  '已发布'
// })
// $('#btnSave2').click(function(){
//     state =  '草稿'
// })
// $('#form-add').on('submit', function(e){
//     e.preventDefault()
//     var fd = new FormData(this)
//     fd.append('state', state)
//     console.log(...fd)
// })
 $('#form-add').on('submit',function(e){
     e.preventDefault()
     var fd = new FormData($(this)[0])
     fd.append('state',state)
    //  fd.forEach(function(v,k){
    //      console.log(k,v)

    //  })
    //生成二进制图片文件
    $image
     .cropper('getCroppedCanvas', {
         //创建一个canvas画布
         width: 400,
         height: 280
     })
     //将canvas画布上的内容，转化为文件对象
     .toBlob(function (blob){
         //得到文件对象后进行后续操作
         fd.append('cover_img', blob)
         console.log(...fd)
         //ajax一定要放到回调函数里面
         //因为生成的文件是耗时操作。异步，所有必须保证发送ajax
         //的时候图片已经生成，所有必须写到回调函数中
        //  、、6发起ajax请求
        publishArticle(fd)
     })
 })

 function publishArticle(fd){
     $.ajax({
         method: 'POST',
         url: '/my/article/add',
         data: fd,
         //注意：如果向服务器提交的是FormData格式的数据
         //必须添加一下俩个配置项
         contentType: false,
         processData: false,
         success: function(res){
             if(res.status !== 0){
                 return layer.msg('发布文章失败!')
             }
             layer.msg('发布文章成功!')
             //发布文章成功后，跳转到文章列表页面
             location.href = '/second/article/art-list.html'
         }
     })
 }

})