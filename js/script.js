$(function () {
  $(document).ready(function() {
    var fontUrl = 'font/NuAnkoMochi-v1.0.0-20200104/Nuあんこもち/NuAnkoMochi-Reg.otf';
    var fontName = 'MyFont';
  
    var fontFace = '@font-face {' +
      'font-family: "' + fontName + '";' +
      'src: url("' + fontUrl + '") format("truetype");' +
    '}';
  
    $('head').append('<style>' + fontFace + '</style>');
  
    $('body').css('font-family', '"' + fontName + '", sans-serif');
  });  

  //ページ内スクロール
  var navHeight = $(".header").outerHeight();

  $('a[href^="#"]').on("click", function () {
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? "html" : href);
    var position = target.offset().top - navHeight;
    $("html, body").animate({ scrollTop: position, }, 300, "swing");
    return false;
  });

  //ページトップ
  $("#js-page-top").on("click", function () {
    $("body,html").animate({ scrollTop: 0, }, 300);
    return false;
  });
});
