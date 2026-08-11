/**
 * works-data.js / skills-data.js の中身を、index.html の <template> に流し込む。
 *
 * HTML文字列を組み立てず textContent と setAttribute だけを使う。
 * 説明文の記号やURLの & で壊れる余地をなくすため。
 */
(function () {
  'use strict';

  /**
   * リンクの種類ごとのボタン表記。
   * データ側は type を書くだけでよく、文言はここ1箇所で決まる。
   */
  var LINK_TYPES = {
    demo:    { label: 'デモを見る',     className: 'nes-btn is-primary' },
    popup:   { label: 'デモを見る',     className: 'nes-btn is-primary' },
    repo:    { label: 'コードを見る',   className: 'nes-btn' },
    article: { label: '記事を読む',     className: 'nes-btn is-success' },
    video:   { label: 'ドウガを見る',   className: 'nes-btn is-error' },
    store:   { label: 'ストアで見る',   className: 'nes-btn is-primary' },
    npm:     { label: 'npm',            className: 'nes-btn is-warning' },
    paper:   { label: 'ロンブンを見る', className: 'nes-btn is-success' }
  };

  function byId(id) {
    return document.getElementById(id);
  }

  /** ダイアログのフッターに並ぶボタンを作る */
  function buildLink(link) {
    var def = LINK_TYPES[link.type];
    if (!def) {
      // 未知のtypeを黙って捨てるとリンクが消えた理由がわからなくなる
      if (window.console) console.warn('未知のリンク種別です: ' + link.type);
      return null;
    }

    var a = document.createElement('a');
    a.className = def.className;
    a.textContent = def.label;
    a.href = link.url;

    if (link.type === 'popup') {
      // スマホ幅で見せたいものは小さな別窓で開く
      var size = link.size || { w: 414, h: 896 };
      a.addEventListener('click', function (e) {
        e.preventDefault();
        window.open(link.url, '_blank', 'width=' + size.w + ',height=' + size.h);
      });
    } else {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    return a;
  }

  function renderWorks(works, listEl, dialogsEl, cardTpl, dialogTpl) {
    works.forEach(function (work) {
      var dialogId = 'dialog-' + work.id;

      /* ------- カード ------- */
      var card = cardTpl.content.cloneNode(true);
      var button = card.querySelector('.works-item');
      var cardImg = card.querySelector('.works-img img');

      cardImg.src = work.image;
      cardImg.alt = work.imageAlt || '';
      card.querySelector('.works-name').textContent = work.title;
      card.querySelector('.works-info').textContent = work.subtitle;

      // カードに全部並べると行が増えて高さが揃わないので、先頭だけ出す。
      // 残りはダイアログのdialog-metaに出る
      var tagsEl = card.querySelector('.works-tags');
      if (work.tags && work.tags.length) {
        tagsEl.textContent = work.tags.slice(0, 4).join(' / ');
      } else {
        tagsEl.parentNode.removeChild(tagsEl);
      }

      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', dialogId);
      listEl.appendChild(card);

      /* ------- ダイアログ ------- */
      var frag = dialogTpl.content.cloneNode(true);
      var dialog = frag.querySelector('dialog');
      dialog.id = dialogId;

      frag.querySelector('.dialog-title').textContent = work.title;
      frag.querySelector('.dialog-subtitle').textContent = work.subtitle;
      frag.querySelector('.dialog-text').textContent = work.description;

      var metaEl = frag.querySelector('.dialog-meta');
      var meta = [];
      if (work.period) meta.push(work.period);
      if (work.tags && work.tags.length) meta.push(work.tags.join(' / '));
      if (meta.length) {
        metaEl.textContent = meta.join('  |  ');
      } else {
        metaEl.parentNode.removeChild(metaEl);
      }

      // ダイアログは閉じていてもDOM上にあるので、srcを入れたままだと
      // 開く前から8枚ぶん読み込まれる。開いたときに初めて読ませる
      var dialogImg = frag.querySelector('.dialog-img-wrapper img');
      dialogImg.setAttribute('data-src', work.detailImage || work.image);
      dialogImg.alt = work.imageAlt || '';

      var menu = frag.querySelector('.dialog-menu');
      (work.links || []).forEach(function (link) {
        var el = buildLink(link);
        if (el) menu.appendChild(el);
      });

      var closeBtn = document.createElement('button');
      closeBtn.className = 'nes-btn';
      closeBtn.textContent = 'とじる';   // 「閉」はNuあんこもちに無い
      menu.appendChild(closeBtn);

      dialogsEl.appendChild(frag);

      button.addEventListener('click', function () {
        if (dialogImg.getAttribute('data-src')) {
          dialogImg.src = dialogImg.getAttribute('data-src');
          dialogImg.removeAttribute('data-src');
        }
        dialog.showModal();
      });

      // 背景（ダイアログ自身の余白）をクリックしたら閉じる
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog) dialog.close();
      });
    });
  }

  function renderSkills(skills, listEl, tpl) {
    skills.forEach(function (skill) {
      var frag = tpl.content.cloneNode(true);

      var name = frag.querySelector('.skill-name');
      name.textContent = skill.name;
      if (skill.colorClass) name.classList.add(skill.colorClass);

      var progress = frag.querySelector('.nes-progress');
      progress.value = skill.level;
      if (skill.progressClass) progress.classList.add(skill.progressClass);
      progress.setAttribute('aria-label', skill.name);

      frag.querySelector('.skill-text').textContent = skill.text;

      var notesEl = frag.querySelector('.skill-notes');
      if (skill.notes && skill.notes.length) {
        skill.notes.forEach(function (note) {
          var li = document.createElement('li');
          li.textContent = note;
          notesEl.appendChild(li);
        });
      } else {
        notesEl.parentNode.removeChild(notesEl);
      }

      listEl.appendChild(frag);
    });
  }

  function init() {
    var worksList = byId('works-list');
    var worksDialogs = byId('works-dialogs');
    var cardTpl = byId('tpl-works-card');
    var dialogTpl = byId('tpl-works-dialog');

    if (worksList && worksDialogs && cardTpl && dialogTpl && window.WORKS) {
      renderWorks(window.WORKS, worksList, worksDialogs, cardTpl, dialogTpl);
    }

    var skillList = byId('skill-list');
    var skillTpl = byId('tpl-skill');
    if (skillList && skillTpl && window.SKILLS) {
      renderSkills(window.SKILLS, skillList, skillTpl);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
