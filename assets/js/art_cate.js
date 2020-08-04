$(function () {
    var layer = layui.layer
    var form = layui.form
    //1.文章分类列表渲染
    initArtCateList()
     //文章分类列表渲染函数封装
     function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 模板引擎渲染传递对象使用属性
                var htmlStr = template("tpl-table", res)
                $('tbody').html(htmlStr)
            }
        })
    }
    //2.为添加类别按钮绑定点击事件
    var indexAdd = null
    $("#btnAddCate").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        })
    })

    //3.文章分类添加
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // console.log('ok')
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败')
                }
                initArtCateList();
                layer.msg('恭喜大侠，新增文章分类成功')
                //关闭添加区域
                layui.layer.close(indexAdd)
            }

        })
    })

    //4.通过代理的方式为btn-edit按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '#btnEdit', function () {
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        })
        //发起请求获取对应分类的数据
        var Id = $(this).attr("data-id")
        $.ajax({
            // method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                console.log(res)
                layui.form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式为修改分类的表单绑定 SUBMIT1事件
    $('body').on('submit', '#form-edit', function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('很遗憾：更新分类数据失败了！')
                }
                layer.msg('恭喜您:更新分类数据成功了！')
            }
        })
    })

    //通过代理的形式为删除按钮添加事件
    $('tbody').on('click', '.btn-delete', function(){
        var id = $(this).attr('data-id')
        console.log(id)
        //
        layer.confirm('确认删除?', {icon: 3, title: '友情提醒'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res){
                    console.log(res)
                    if(res.status !== 0){
                    return layer.msg('删除分类失败!')
                    }
                    layer.msg('删除分类成功!')
                    layer.close(index)
                    initArtCateList()
                }
                
            })
        })
    })

   



})