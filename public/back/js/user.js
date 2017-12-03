$(function () {
  
  // 发送 ajax 请求, 获取到用户的数据
  var currentPage = 1; // 当前页面
  var pageSize = 5; // 每页显示条数
  
  // 渲染
  render();
  
  // 页面一加载, 没有按钮, 动态生成的
  $('.lt_content tbody').on("click", '.btn', function() {
    // 显示模态框
    $('#userModel').modal();
    // 获取对应的 id
    var id = $(this).parent().data("id");
    
    // 判断是否是删除按钮
    // 如果有 btn-danger 就是要改成 0
    var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    
    $('#userModel .btn_confirm').off().on('click', function() {
      $.post("/user/updateUser", { id: id, isDelete: isDelete }, function( data ) {
        if( data.success ) {
          // 关闭模态框
          $('#userModel').modal("hide");
          
          // 重新渲染表格
          render();
        }
      });
    });
  })
  
  function render() {
    // 获取数据渲染
    $.get("/user/queryUser", {
        page: currentPage,
        pageSize: pageSize
      },
      function (data) {
        // 使用模板引擎渲染数据
        var htmlStr = template("myTpl", data);
        $('.lt_content tbody').html(htmlStr);
        
        // 计算总页数
        var totalPages = Math.ceil(data.total / data.size);
        
        // 初始化分页插件
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: currentPage,//当前页
          totalPages: totalPages,//总页数
          numberOfPages: 5,
          itemTexts: function (type, page, current) {
            switch (type) {
              case"first":
                return "首页";
              case"prev":
                return "上一页";
              case"next":
                return "下一页";
              case"last":
                return "底部";
              case"page":
                return page
            }
          },
          size: "small",//设置控件的大小，mini, small, normal,large
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            // 重新调用 render
            render();
          }
        });
      });
    
  }
  
})