(function () {
  'use strict';

  var opening = document.getElementById('opening');
  var password = document.getElementById('password');
  var gallery = document.getElementById('gallery');
  var dayPage = document.getElementById('day-page');
  var startBtn = document.getElementById('start-btn');
  var flash = document.getElementById('flash');
  var zoomLayer = document.getElementById('zoom-layer');
  var passwordForm = document.getElementById('password-form');
  var filmList = document.getElementById('film-list');
  var dayPageDate = document.getElementById('day-page-date');
  var dayBackBtn = document.getElementById('day-back-btn');
  var codeInputs = document.querySelectorAll('.code-dot__input');
  var codeDots = document.querySelectorAll('.code-dot');
  var unlockBtn = passwordForm.querySelector('.btn-unlock');

  var TRANSITION_MS = 900;
  var FLASH_MS = 520;
  var ZOOM_MS = 650;
  var ACCESS_CODE = '0510';
  var FILM_DAYS = 100;
  var FILM_START = new Date(2026, 4, 10);

  var audioCtx = null;
  var isTransitioning = false;

  function getAudioContext() {
    if (!audioCtx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        audioCtx = new Ctx();
      }
    }
    return audioCtx;
  }

  function playShutterSound() {
    var ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    var now = ctx.currentTime;

    var click = ctx.createOscillator();
    var clickGain = ctx.createGain();
    click.type = 'square';
    click.frequency.setValueAtTime(1800, now);
    click.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.exponentialRampToValueAtTime(0.12, now + 0.002);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    click.connect(clickGain);
    clickGain.connect(ctx.destination);
    click.start(now);
    click.stop(now + 0.06);

    var thump = ctx.createOscillator();
    var thumpGain = ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(120, now);
    thump.frequency.exponentialRampToValueAtTime(60, now + 0.08);
    thumpGain.gain.setValueAtTime(0.0001, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.18, now + 0.005);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    thump.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thump.start(now);
    thump.stop(now + 0.12);
  }

  function triggerFlash(callback) {
    flash.classList.remove('flash-overlay--active');
    void flash.offsetWidth;
    flash.classList.add('flash-overlay--active');

    setTimeout(function () {
      flash.classList.remove('flash-overlay--active');
      if (callback) callback();
    }, FLASH_MS);
  }

  function showScreen(target, current, onComplete) {
    current.classList.add('screen--exiting');
    current.classList.remove('screen--active');

    target.classList.add('screen--entering');
    target.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        target.classList.add('screen--active');
      });
    });

    setTimeout(function () {
      current.classList.remove('screen--exiting');
      target.classList.remove('screen--entering');
      current.setAttribute('aria-hidden', 'true');
      isTransitioning = false;
      if (onComplete) onComplete();
    }, TRANSITION_MS);
  }

  function formatDisplayDate(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return y + '.' + m + '.' + d;
  }

  function formatIsoDate(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  function buildFilmDates() {
    var dates = [];
    for (var i = 0; i < FILM_DAYS; i++) {
      var date = new Date(FILM_START);
      date.setDate(date.getDate() + i);
      dates.push({
        iso: formatIsoDate(date),
        display: formatDisplayDate(date)
      });
    }
    return dates;
  }

  function createFilmCard(entry) {
    var item = document.createElement('li');
    item.className = 'film-list__item';
    item.setAttribute('role', 'listitem');

    var divider = document.createElement('hr');
    divider.className = 'film-list__divider';
    divider.setAttribute('aria-hidden', 'true');

    var button = document.createElement('button');
    button.className = 'film-card';
    button.type = 'button';
    button.dataset.date = entry.iso;
    button.setAttribute('aria-label', entry.display);

    button.innerHTML =
      '<div class="film-card__frame">' +
        '<div class="film-card__inner">' +
          '<span class="film-card__icon" aria-hidden="true">🎞</span>' +
          '<time class="film-card__date" datetime="' + entry.iso + '">' + entry.display + '</time>' +
        '</div>' +
      '</div>';

    item.appendChild(divider);
    item.appendChild(button);
    return item;
  }

  function renderFilmList() {
    filmList.innerHTML = '';
    buildFilmDates().forEach(function (entry) {
      filmList.appendChild(createFilmCard(entry));
    });
  }

  function setActiveDot(index) {
    codeDots.forEach(function (dot, i) {
      dot.classList.toggle('code-dot--active', i === index);
    });
  }

  function updateDotStates() {
    codeDots.forEach(function (dot, i) {
      var input = codeInputs[i];
      dot.classList.toggle('code-dot--filled', input.value.length === 1);
    });
  }

  function updateUnlockState() {
    var allFilled = Array.from(codeInputs).every(function (input) {
      return input.value.length === 1;
    });
    unlockBtn.disabled = !allFilled;
  }

  function getEnteredCode() {
    return Array.from(codeInputs)
      .map(function (input) { return input.value; })
      .join('');
  }

  function clearCodeInputs() {
    codeInputs.forEach(function (input) {
      input.value = '';
    });
    codeDots.forEach(function (dot) {
      dot.classList.remove('code-dot--filled', 'code-dot--active');
    });
    unlockBtn.disabled = true;
  }

  function focusInput(index) {
    if (index >= 0 && index < codeInputs.length) {
      codeInputs[index].focus();
      setActiveDot(index);
    }
  }

  function goToPassword() {
    if (isTransitioning) return;
    isTransitioning = true;

    playShutterSound();

    triggerFlash(function () {
      showScreen(password, opening, function () {
        focusInput(0);
      });
    });
  }

  function goToGallery() {
    if (isTransitioning) return;
    isTransitioning = true;
    gallery.scrollTop = 0;
    showScreen(gallery, password);
  }

  function shakePasswordForm() {
    passwordForm.classList.remove('unlock-form--shake');
    void passwordForm.offsetWidth;
    passwordForm.classList.add('unlock-form--shake');
    setTimeout(function () {
      passwordForm.classList.remove('unlock-form--shake');
    }, 450);
  }

  function clearZoomLayer() {
    zoomLayer.classList.remove('zoom-layer--visible');
    zoomLayer.innerHTML = '';
    zoomLayer.removeAttribute('style');
    zoomLayer.setAttribute('aria-hidden', 'true');
  }

  function openDayPage(card, dateIso, displayDate) {
    if (isTransitioning) return;
    isTransitioning = true;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function revealDayPage() {
      dayPageDate.textContent = displayDate;
      dayPageDate.setAttribute('datetime', dateIso);

      gallery.classList.remove('screen--active');
      gallery.classList.add('screen--exiting');
      gallery.setAttribute('aria-hidden', 'true');

      dayPage.classList.add('screen--entering', 'screen--active');
      dayPage.setAttribute('aria-hidden', 'false');

      clearZoomLayer();
      card.style.visibility = '';

      setTimeout(function () {
        gallery.classList.remove('screen--exiting', 'screen--entering');
        dayPage.classList.remove('screen--entering');
        isTransitioning = false;
      }, TRANSITION_MS);
    }

    if (prefersReducedMotion) {
      revealDayPage();
      return;
    }

    var frame = card.querySelector('.film-card__frame');
    var rect = frame.getBoundingClientRect();

    zoomLayer.innerHTML = frame.outerHTML;
    zoomLayer.setAttribute('aria-hidden', 'false');
    zoomLayer.style.top = rect.top + 'px';
    zoomLayer.style.left = rect.left + 'px';
    zoomLayer.style.width = rect.width + 'px';
    zoomLayer.style.height = rect.height + 'px';
    zoomLayer.style.transform = 'scale(1)';
    zoomLayer.style.transformOrigin = 'center center';

    card.style.visibility = 'hidden';

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        zoomLayer.classList.add('zoom-layer--visible');

        var scaleX = window.innerWidth / rect.width * 0.88;
        var scaleY = window.innerHeight / rect.height * 0.55;
        var scale = Math.min(scaleX, scaleY, 1.35);

        zoomLayer.style.transform = 'scale(' + scale + ')';
        zoomLayer.style.opacity = '0.15';
      });
    });

    setTimeout(revealDayPage, ZOOM_MS);
  }

  function goBackToGallery() {
    if (isTransitioning) return;
    isTransitioning = true;
    showScreen(gallery, dayPage);
  }

  function handleCodeInput(e) {
    var input = e.target;
    var index = parseInt(input.dataset.index, 10);
    var value = input.value.replace(/\D/g, '');

    input.value = value.slice(-1);
    updateDotStates();

    if (input.value && index < codeInputs.length - 1) {
      focusInput(index + 1);
    } else if (input.value) {
      setActiveDot(index);
    }

    updateUnlockState();
  }

  function handleCodeKeydown(e) {
    var input = e.target;
    var index = parseInt(input.dataset.index, 10);

    if (e.key === 'Backspace') {
      if (!input.value && index > 0) {
        codeInputs[index - 1].value = '';
        updateDotStates();
        updateUnlockState();
        focusInput(index - 1);
      } else {
        input.value = '';
        updateDotStates();
        updateUnlockState();
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    }

    if (e.key === 'ArrowRight' && index < codeInputs.length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  }

  function handleCodePaste(e) {
    e.preventDefault();
    var pasted = (e.clipboardData || window.clipboardData)
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 4);

    pasted.split('').forEach(function (char, i) {
      if (codeInputs[i]) {
        codeInputs[i].value = char;
      }
    });

    updateDotStates();
    updateUnlockState();

    var focusIndex = Math.min(pasted.length, codeInputs.length - 1);
    focusInput(focusIndex);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (getEnteredCode() === ACCESS_CODE) {
      goToGallery();
    } else {
      shakePasswordForm();
      clearCodeInputs();
      focusInput(0);
    }
  }

  function handleFilmListClick(e) {
    var card = e.target.closest('.film-card');
    if (!card) return;

    var dateIso = card.dataset.date;
    var timeEl = card.querySelector('.film-card__date');
    var displayDate = timeEl ? timeEl.textContent : dateIso;

    openDayPage(card, dateIso, displayDate);
  }

  renderFilmList();

  startBtn.addEventListener('click', goToPassword);
  dayBackBtn.addEventListener('click', goBackToGallery);
  filmList.addEventListener('click', handleFilmListClick);

  codeInputs.forEach(function (input, index) {
    input.addEventListener('input', handleCodeInput);
    input.addEventListener('keydown', handleCodeKeydown);
    input.addEventListener('paste', handleCodePaste);
    input.addEventListener('focus', function () {
      setActiveDot(index);
    });
  });

  passwordForm.addEventListener('submit', handleFormSubmit);
})();
