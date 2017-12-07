/**
 * Created by Jepson on 2017/12/6.
 */


mui(".mui-scroll-wrapper").scroll({
  indicators: false
});

//获得slider插件对象
mui('.mui-slider').slider({
  interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
});