/**
 * Created by Jepson on 2017/12/4.
 */
$(function() {
  // 分页渲染
  var currentPage = 1;
  var pageSize = 5;
  var imgsArray = [];
  
  render();
  
  // 显示模态框
  $('#btn_add').on("click", function() {
    $('#addProductModal').modal();
    
    // 渲染下拉菜单
    // 1. 发送 ajax 请求, 获取到所有的二级分类
    // 2. 通过模板引擎, 渲染页面
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function( data ) {
        console.log( data );
        // 根据数据渲染二级列表
        var htmlStr = template("secondTypeTpl", data);
        $("#addProductModal .dropdown-menu").html( htmlStr );
      }
    })
  });
  
  // 事件委托, 选择二级列表
  $('#addProductModal .dropdown-menu').on("click", "a", function() {
    $('.dropdown-text').text( $(this).text() );
    
    // 获取当前 a 的 id 值, 设置给 categoryId
    $('[name="brandId"]').val( $(this).data("id") );
    
    // 修改成功, 手动的将 brandId 改成 验证通过 VALID
    $form.data('bootstrapValidator').updateStatus("brandId", "VALID");
  });
  
  
  // 表单校验
  var $form = $("form");
  $form.bootstrapValidator({
    excluded: [], // 排除不校验的内容
  
    // 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      // 商品尺码
      num: {
        validators: {
          notEmpty: {
            message: "请输入库存"
          },
          // 正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '请输入合法的库存'
          }
        }
      },
      // 商品尺码
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品的尺码"
          },
          // 正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '请输入合法的尺码, 例如: (32-46)'
          }
        }
      },
      // 原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品的原价"
          }
        }
      },
      // 商品价格
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品的价格"
          }
        }
      },
      productLogo : {
        validators: {
          notEmpty: {
            message: "请上传 3 张图片"
          }
        }
      }
    }
  });
  
  
  $('#bt_fileUpload').on("click", function() {
    $('#fileUpload').trigger("click");
  })

  // 图片上传
  // 上传图片初始化
  $('#fileUpload').fileupload({
    dataType: "json",
    done: function (e, data) {
      console.log( data.result );
      
      if (imgsArray.length >= 3 ) {
        return;
      }
      
      // 1. 上传图片成功了, 就把图片显示出来
      $(".imgBox").append('<img src="' + data.result.picAddr + '" height="100" alt="">');
  
      // 2. 将结果存储起来, 添加的时候使用
      imgsArray.push( data.result );
      
      // 3. 判断长度, 是 3, 手动校验成功, 如果不是 3, 校验失败
      if ( imgsArray.length === 3 ) {
        $form.data("bootstrapValidator").updateStatus("productLogo", "VALID");
      } else {
        $form.data("bootstrapValidator").updateStatus("productLogo", "INVALID");
      }
    }
  });
  
  // 添加商品, 给表单注册校验成功事件
  $form.on("success.form.bv", function( e ) {
    e.preventDefault();
    
    // 发送 ajax 请求
    var params = $form.serialize();
    
    params += "&picName1=" + imgsArray[0].picName + "&picAddr1=" + imgsArray[0].picAddr;
    params += "&picName2=" + imgsArray[1].picName + "&picAddr2=" + imgsArray[1].picAddr;
    params += "&picName3=" + imgsArray[2].picName + "&picAddr3=" + imgsArray[2].picAddr;
    
    $.post("/product/addProduct", params, function( data ) {
      if ( data.success ) {
        // 1. 关闭模态框
        $('#addProductModal').modal("hide");
        // 2. 重新渲染第一页
        currentPage = 1;
        render();
        // 3. 重置表单的内容和样式
        // reset() 清空内容, 不会将隐藏域清空掉
        $form[0].reset();
        $form.data("bootstrapValidator").resetForm();
        
        // 下拉菜单重置
        $('#addProductModal .dropdown-text').text("请选择");
        $('#addProductModal [name="brandId"]').val('');
        
        // 重置图片
        $('.imgBox img').remove();
        imgsArray = [];
      }
    });
    
  });
  
  
  // 页面渲染
  function render() {
    // 发送 ajax 请求, 获取商品数据
    $.get("/product/queryProductDetailList", { page: currentPage, pageSize: 5 }, function( data ) {
      console.log(data);
      $('tbody').html( template( "tpl", data ) );
      
      // 分页组件渲染
      $('#paginator').bootstrapPaginator({
        bootstrapMajorVersion: 3,
        currentPage: currentPage,
        itemTexts: function( type, page, current ) {
          switch( type ) {
            case "first":
              return "首页";
            case "prev":
              return "上一页";
            case "next":
              return "下一页";
            case "last":
              return "尾页";
            // 如果是 page, 说明就是数字, 只需要返回对应的数字即可
            default:
              return "第" + page + "页";
          }
        },
        tooltipTitles: function( type, page, current ) {
          switch( type ) {
            case "first":
              return "首页";
            case "prev":
              return "上一页";
            case "next":
              return "下一页";
            case "last":
              return "尾页";
            // 如果是 page, 说明就是数字, 只需要返回对应的数字即可
            default:
              return "第" + page + "页";
          }
        },
        useBootstrapTooltip: true,
        bootstrapTooltipOptions: {
          animation: false,
          placement: "bottom"
        },
        totalPages: Math.ceil(data.total / data.size),
        onPageClicked: function( a, b, c, page ) {
          currentPage = page;
          render();
        }
      })
    })
  };

});