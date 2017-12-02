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

// 加载顶部topbar
$('.m_topbar').load('m_topbar.html');

// 加载退出模态框
$('.m_logoutModal').load('m_logoutModal.html');

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