/**
 * Created by Jepson on 2017/11/29.
 */

// // 进度条功能
// // 禁用进度环
// NProgress.configure( { showSpinner: false } );
// // 开启进度条
// NProgress.start();
// setTimeout(function() {
//   // 完成进度条
//   NProgress.done();
// }, 2000);

// 禁用进度环
NProgress.configure( { showSpinner: false } );

// 给 document 注册, 全局事件
$( document ).ajaxStart(function() {
  // ajax 开始开启进度条
  NProgress.start();
});

$( document ).ajaxStop(function() {
  // ajax 结束, 关闭进度条
  setTimeout(function() {
    NProgress.done();
  }, 500);
})



