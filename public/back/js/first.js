/**
 * Created by Jepson on 2017/12/3.
 */

$(function() {
  // 去后台获取 1 级分类的数据
  var currentPage = 1;
  var pageSize = 5;
  
  render();
  
  $('#btn_add').on("click", function() {
    $('#addTypeModal').modal();
  });
  
  // 表单校验功能
  var $form = $('#form');
  $form.bootstrapValidator({
    // 反馈的图标
    // 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  
    // 配置校验的规则, 校验用户名和密码
    // 字段: 你想要校验哪些字段
    fields: {
      // 对应表单中 name 是 categoryName 的表单
      categoryName: {
        validators: {
          // 不能为空
          notEmpty: {
            message: "一级分类不能为空"
          }
        }
      }
    }
  });
  
  $form.on("success.form.bv", function( e ) {
    // 发送 ajax请求
    $.post( "/category/addTopCategory", $form.serialize(), function( data ) {
      if( data.success ) {
        // 如果成功
        $('#addTypeModal').modal("hide");
        // 重新渲染第一页面
        currentPage = 1;
        render();
        $form[0].reset();
        $form.data('bootstrapValidator').resetForm();
      }
    })
  })
  
  function render() {
    // 发送 ajax 请求, 获取数据
    $.get("/category/queryTopCategoryPaging", { page: currentPage, pageSize: pageSize }, function( data ) {
      var htmlStr = template("typeFirstTpl", data);
      $('.lt_content tbody').html( htmlStr );
  
      // 渲染分页
      $('#paginator').bootstrapPaginator({
        bootstrapMajorVersion: 3,
        currentPage: currentPage,
        totalPages: Math.ceil( data.total / data.size ),
        onPageClicked( a, b, c, page ) {
          currentPage = page;
          render();
        }
      });
    })
  }
})
