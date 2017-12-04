/**
 * Created by Jepson on 2017/12/3.
 */

$(function () {
  // 二级分类的渲染功能
  var currentPage = 1;
  var pageSize = 20;
  
  render();
  
  // 添加二级分类
  $('#btn_add').on("click", function () {
    // 显示模态框
    $('#addTypeModal').modal();
    
    // 发送 ajax 请求, 获取所有的一级分类数据, 渲染下面的页面
    $.get("/category/queryTopCategoryPaging", {page: 1, pageSize: 100}, function (data) {
      console.log(data);
      var htmlStr = template("firstTpl", data);
      $('#addTypeModal .dropdown-menu').html(htmlStr);
    });
    
  });
  
  
  // 注册委托事件, 选择一级列表
  $('#addTypeModal .dropdown-menu').on("click", "a", function () {
    $('.dropdown-text').text($(this).text());
    
    // 获取到当前 a 的id值, 设置给 categoryId
    $('[name=categoryId]').val( $(this).data('id') );
  
    //让categoryId的校验通过
    $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
  })
  
  // 上传图片按钮点击事件
  $('#bt_fileUpload').on("click", function () {
    // trigger file 控件的 click事件, 选择图片
    $('#fileUpload').trigger("click");
  })
  
  // 上传图片初始化
  $('#fileUpload').fileupload({
    dataType: "json",
    done: function (e, data) {
      console.log(e);
      console.log(data);
      
      $('#img_box').attr("src", data.result.picAddr);
      $('#brandLogo').val(data.result.picAddr);
      $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });
  
  var $form = $('#form');
  $form.bootstrapValidator({
    excluded: [], // 排除不校验的内容
    
    // 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    // 校验规则
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类的名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  });
  
  $form.on("success.form.bv", function( e ) {
    $.post("/category/addSecondCategory", $form.serialize(), function( data ) {
      console.log( data );
      if ( data.success ) {
        // 成功的操作
        // 1. 关闭模态框
        $('#addTypeModal').modal("hide");
        // 2. 渲染第一页
        currentPage = 1;
        render()
      }
    })
  })
  
  
  function render() {
    // 发送 ajax
    $.get("/category/querySecondCategoryPaging", {
      page: currentPage,
      pageSize: pageSize
    }, function (data) {
      console.log(data);
      var htmlStr = template("tpl", data);
      $('.lt_content tbody').html(htmlStr);
      
      // 初始化分页插件
      $('#paginator').bootstrapPaginator({
        bootstrapMajorVersion: 3,
        currentPage: currentPage,
        totalPages: Math.ceil(data.total / data.size),
        onPageClicked: function (a, b, c, page) {
          currentPage = page;
          render();
          // 重置表单
          $form[0].reset();
          $form.data("bootstrapValidator").resetForm();
          // 手动把 dropdown 重置, 把图片的地址重置
          $('.dropdown-text').text("请选择");
          $('#img_box').attr("src", "images/none.png")
        }
      });
      
    })
  }
})
