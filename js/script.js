// フォントの読み込みは css/style.css の @font-face に移した。
// jQuery が届かなくても字が当たるようにするため。
$(function () {
  //ページ内スクロール
  $('a[href^="#"]').on("click", function () {
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? "html" : href);
    // 行き先が無いときは、何もせずブラウザに任せる（offset()がundefinedで落ちるため）
    if (!target.length) return true;
    // ヘッダーの高さはせまい画面で変わるので、押されたときに測る
    var navHeight = $(".header").outerHeight();
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
