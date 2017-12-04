/**
 * Created by Jepson on 2017/11/29.
 */
// // 进度条功能
// 禁用进度环
NProgress.configure({
  showSpinner: false
});

// 给 document 注册, 全局事件
$(document).ajaxStart(function () {
  // ajax 开始开启进度条
  NProgress.start();
});

$(document).ajaxStop(function () {
  // ajax 结束, 关闭进度条
  setTimeout(function () {
    NProgress.done();
  }, 500);
});

// 退出功能
// 弹出退出提示框
$('.icon_logout').on('click', function () {
  $('#logoutModal').modal();
});

// 侧边栏显示隐藏功能
$('.icon_menu').on("click", function () {
  $('.lt_aside').toggleClass("now");
  $('.lt_main').toggleClass("now");
});

// http 是无状态的协议
// 给退出按钮注册退出事件
$('#logoutModal .btn_logout').on("click", function () {
  // 发送 ajax 请求, 要退出系统
  $.get('/employee/employeeLogout', function (data) {
    if (data.success) {
      location.href = "login.html";
    }
  })
});

// 二级分类, 显示隐藏功能
$('.lt_aside .classify').on("click", function () {
  $(this).next().stop().slideToggle();
});

// 非登陆的每个页面都需要判断当前用户是否是登陆, 如果登陆了, 就继续, 
// 如果没登陆, 就需要跳转到登陆页
if (location.href.indexOf("login.html") === -1) {
  $.get("/employee/checkRootLogin", function (data) {
    console.log(data);
    if (data.error) {
      location.href = "login.html";
    }
  });
}