/**
 * Created by Jepson on 2017/11/29.
 */

$(function() {
  // 表单校验的功能
  // 1. 用户名不能为空
  // 2. 用户名密码不能为空
  // 3. 用户名密码的长度为 6-12 位
  
  // 如何使用表单校验插件
  // 1. 引包
  // 2. 调用 bootstrapValidator
  var $form = $('form');
  
  // 表单校验配置规则
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
      // 对应表单中 name 是 username 的表单
      username: {
        // username 的规则
        // validators
        validators: {
          // 不能为空
          notEmpty: {
            message: "用户名不能为空"
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        // password 的规则
        validators: {
          notEmpty: {
            message: "用户密码不能为空"
          },
          // 长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度为 6-12 位"
          },
          callback: {
            message: "密码填写错误"
          }
        }
      }
    }
  });
  
  // 需要给表单注册一个校验成功的事件 success.form.bv
  $form.on("success.form.bv", function( e ) {
    // 阻止浏览器默认行为
    e.preventDefault();
    
    // 发送 ajax
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $form.serialize(),
      dataType: "json",
      success: function( data ) {
        // 如果成功就跳转到主页
        if ( data.success ) {
          location.href = "index.html";
        }
        
        if ( data.error === 1000 ) {
          // alert( "用户名不存在" );
          // 手动调用方法, updateStatus 让 username 校验失败即可
          // 参数1: 改变哪个字段
          // 参数2: VALID 通过 INVALID 不通过的
          // 参数3: 选择提示的信息
          $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
        }
        
        if ( data.error === 1001 ) {
          // alert( "密码错误" );
          $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
        }
      }
    })
  });
  
  // 重置功能, 重置
  $('[type="reset"]').on("click", function( e ) {
    // 重置表单样式
    $form.data("bootstrapValidator").resetForm();
  })
})
