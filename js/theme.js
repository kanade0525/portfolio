/**
 * あかるいテーマと くらいテーマの切り替え。
 *
 * 選んだものは localStorage に覚えるので、次に来たときも同じになる。
 * 何も選ばれていないときは くらい方 で始まる（headの先頭で当てている）。
 *
 * 表示に使える漢字はNuあんこもちの612字だけなので、
 * ボタンの文字はひらがなにしてある。
 */
(function () {
  'use strict';

  var KEY = 'theme';
  var root = document.documentElement;

  function save(theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {
      // プライベートモードなどで保存できなくても、
      // その場の切り替えだけは効くようにする
    }
  }

  function apply(theme, label, button) {
    var toDark = theme !== 'dark';
    root.setAttribute('data-theme', theme);
    if (label) label.textContent = toDark ? 'くらくする' : 'あかるくする';
    if (button) {
      button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      // 記号だけになるせまい画面でも、何のボタンか読み上げられるように
      button.setAttribute('aria-label', toDark ? 'くらくする' : 'あかるくする');
      var mark = button.querySelector('.theme-toggle-mark');
      // ●=いまくらい / ○=いまあかるい
      if (mark) mark.textContent = toDark ? '●' : '○';
    }
  }

  function init() {
    var button = document.getElementById('theme-toggle');
    var label = document.getElementById('theme-toggle-label');
    var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

    apply(current, label, button);
    if (!button) return;

    button.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      save(next);
      apply(next, label, button);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
