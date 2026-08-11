/**
 * メインビジュアルの「きょうの ようす」を埋める。
 *
 * 日づけと時こくは見ている人の端末から取る。
 * 天気は Open-Meteo (https://open-meteo.com/) から取得する。
 * APIキーは要らず、こちらから送るのは下の座標だけで、
 * 見ている人の位置は一切送っていない。
 *
 * 表示に使える漢字はNuあんこもちの612字だけなので、
 * 曜日(日月火水木金土)と「雨」以外はひらがなにしてある。
 */
(function () {
  'use strict';

  /** 天気を出す場所。東京駅のあたり */
  var PLACE = { lat: 35.681, lon: 139.767 };

  var WEEK = ['日', '月', '火', '水', '木', '金', '土'];

  /**
   * WMOの天気コードを言葉に直す。
   * https://open-meteo.com/en/docs にある区分をまとめたもの
   */
  function weatherText(code) {
    if (code === 0) return 'かいせい';
    if (code <= 2) return 'はれ';
    if (code === 3) return 'くもり';
    if (code <= 48) return 'きり';
    if (code <= 57) return 'きりさめ';
    if (code <= 67) return '雨';
    if (code <= 77) return 'ゆき';
    if (code <= 82) return 'にわか雨';
    if (code <= 86) return 'にわかゆき';
    return 'かみなり';
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function startClock() {
    var dateEl = byId('status-date');
    var timeEl = byId('status-time');
    if (!dateEl || !timeEl) return;

    function tick() {
      var d = new Date();
      dateEl.textContent =
        d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()) +
        ' (' + WEEK[d.getDay()] + ')';
      timeEl.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
  }

  function loadWeather() {
    var el = byId('status-weather');
    if (!el || typeof fetch !== 'function') return;

    var url = 'https://api.open-meteo.com/v1/forecast' +
      '?latitude=' + PLACE.lat + '&longitude=' + PLACE.lon +
      '&current=temperature_2m,weather_code&timezone=Asia%2FTokyo';

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('status ' + res.status);
        return res.json();
      })
      .then(function (json) {
        var cur = json && json.current;
        if (!cur) throw new Error('こたえの形がおかしい');
        el.textContent = weatherText(cur.weather_code) + '  ' + Math.round(cur.temperature_2m) + 'ど';
      })
      .catch(function () {
        // 取れなくてもページは動くので、静かに諦める
        el.textContent = 'わからない';
      });
  }

  function init() {
    startClock();
    loadWeather();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
