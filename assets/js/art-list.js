$(function (){
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    //定义一个全局变量，存储分页参数
    var q = {
        pagenum: 1, //页码值
        pagesize: 5, //每页显示多少条数据
        cate_id: "", //文章分类的id
        state: "", //文章的状态，可选值有：已发布，草稿
    }
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() +1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':'+ ss
    }
    
    initTable()
    initCate()
    // 获取文章数据列表的方法
    function initTable(){
        $.ajax({
            method: "GET",
            url: '/my/article/list',
            data: q,
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败！!')
                }
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    
    // 初始化文章分类的方法
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败!')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //
                form.render()
            }
        })
    }
    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n: '0' + n
    }

    //为筛选表单绑定submit事件
    $("#form-search").on('submit', function(e){
        e.preventDefault()
        //获取白哦吧中选择项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的帅选条件，重新渲染表格的数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total){
        // console.log(total)
        //调用laypage.render()方法来渲染分页的状态
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total,    //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum , //设置默认被选中的分页
            layout: ['cound','limit','prev','page','next','next','skip'],
            limits: [3,5,8,10,15],
            // 分页发生切换的时候,'，触发jump回调
            //触发jump回调的方式有两种：1点击页面的时候会触发jump回调
            // 2.只要调用了laypage.render()方法的时候就会触发jump回调
            // 解决方法可以通过first的值来判断是通过哪种方式触发的jump回调
            // 如果first的值为true，证明是方式2触发的，否则就是方式1触发的
            jump: function(obj, first) {
                // console.log(first)
                // console.log(obj.curr)
                //把最新的页码值赋值到q，这个查询参数对象中
                q.pagenum = obj.curr
                //根据最新的q获取对应的数据列表，并渲染表格
                // initTable()
                //把最新的条目数，赋值到q这个查询对象的pagesize属性中
                q.pagesize = obj.limit
                if(!first){
                    initTable()
                }
            }
        })
    }

    //4删除 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function(){
        // 获取删除按钮单独个数
        var len = $('.btn-delete').length
        //获取到文章的id
        var id = $(this).attr('data-id')
        //询问用户是否要删除数据
        layer.confirm('确认删除?',{icon: 3, title: '友情提醒!'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文件成功!')
                    //当数据删除完成后，需要判断当前这页中，是否还有剩余的数据
                    //如果没有剩余的数据了，则让页面值减一之后
                    //再重新调用initTable（方法
                    //4
                    // if(len === 1){
                    //     //如果len的值等于1，证明删除完毕之后，页面上就没有任何数据了
                    //     //页面值最小值必须为1
                    //     q.pagenum = q.pagenum === 1 ? 1: q.pagenum -1
                    // }
                    // 如果页面最后一条，且页码大于1，就查询之前的一页内容
                    $('.btn-delete').length===1 && p.pagenum > 1 && p.pagenum--;
                    initTable()
                }
            })
            layer.close(index)
        })
    })

})