/**
 * トップの「コマンド」窓。
 *
 * 原作の戦とう画面と同じで、右の窓で選んだものが左の窓に出る。
 * 選ばれているものには ▶ のカーソルが付く。
 *
 * 中身はHTMLに書いてあり、ここでは出し入れするだけ。
 * 表示に使える漢字はNuあんこもちの612字だけなので、
 * 見出しはひらがなにしてある。
 */
(function () {
  'use strict';

  /** data-panel の値 → 左の窓の見出し */
  var TITLES = {
    status: 'かなで',
    likes: 'すきなもの',
    today: 'きょうの ようす'
  };

  function select(name, items, titleEl) {
    var panels = document.querySelectorAll('.dq-panel');
    var i;

    for (i = 0; i < panels.length; i++) {
      panels[i].hidden = panels[i].id !== 'panel-' + name;
    }
    if (titleEl && TITLES[name]) titleEl.textContent = TITLES[name];

    for (i = 0; i < items.length; i++) {
      var on = items[i].getAttribute('data-panel') === name;
      items[i].classList.toggle('is-selected', on);
      items[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function init() {
    var items = document.querySelectorAll('.dq-menu-item');
    var titleEl = document.getElementById('dq-panel-title');
    if (!items.length) return;

    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('click', function () {
        select(this.getAttribute('data-panel'), items, titleEl);
      });
    }

    // 上下の矢印でも選べるようにする
    var list = items[0].closest('.dq-menu');
    if (list) {
      list.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        var now = document.activeElement;
        var at = -1;
        for (var i = 0; i < items.length; i++) {
          if (items[i] === now) at = i;
        }
        if (at < 0) return;
        e.preventDefault();
        var next = e.key === 'ArrowDown' ? (at + 1) % items.length
                                         : (at - 1 + items.length) % items.length;
        items[next].focus();
        items[next].click();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
