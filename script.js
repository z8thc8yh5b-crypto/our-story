(function () {
  'use strict';

  var opening = document.getElementById('opening');
  var password = document.getElementById('password');
  var gallery = document.getElementById('gallery');
  var dayPage = document.getElementById('day-page');
  var finalScreen = document.getElementById('final');
  var startBtn = document.getElementById('start-btn');
  var zoomLayer = document.getElementById('zoom-layer');
  var flashLayer = document.getElementById('flash-layer');
  var passwordForm = document.getElementById('password-form');
  var openBtn = document.getElementById('open-btn');
  var calendarMonth = document.getElementById('calendar-month');
  var calendarDates = document.getElementById('calendar-dates');
  var monthPrev = document.getElementById('month-prev');
  var monthNext = document.getElementById('month-next');
  var dayPageDate = document.getElementById('day-page-date');
  var dayPageTitle = document.getElementById('day-page-title');
  var dayPageBody = document.getElementById('day-page-body');
  var calendarBtn = document.getElementById('calendar-btn');
  var nextEntryBtn = document.getElementById('next-entry-btn');
  var photoCarousel = document.getElementById('photo-carousel');
  var photoTrack = document.getElementById('photo-track');
  var photoPrev = document.getElementById('photo-prev');
  var photoNext = document.getElementById('photo-next');
  var photoDots = document.getElementById('photo-dots');
  var codeInputs = document.querySelectorAll('.code-dot__input');
  var codeDots = document.querySelectorAll('.code-dot');
  var shutterSound = document.getElementById('shutter-sound');
  var bgMusic = document.getElementById('bg-music');
  var musicBtn = document.getElementById('music-btn');

  // ============================================================
  // ⚙️ 설정 변수
  // ============================================================
  var TRANSITION_MS = 500;           // 화면 전환 시간 (밀리초)
  var ACCESS_CODE = '0510';           // 비밀번호 (변경 가능)
  var FILM_START = new Date(2026, 4, 10); // 시작 날짜 (2026년 5월 10일)
  var FILM_DAYS = 100;                // 총 일수

  // ============================================================
  // 🔄 상태 변수
  // ============================================================
  var isTransitioning = false;        // 화면 전환 중인지 확인
  var currentEntryIndex = -1;         // 현재 보고 있는 일기 인덱스
  var currentPhotoIndex = 0;          // 현재 보고 있는 사진 인덱스
  var isMusicPlaying = false;         // 음악 재생 중인지 확인
  var currentCalendarDate = new Date(FILM_START); // 현재 달력이 보여주는 월

  // ============================================================
  // 📝 일기 데이터 관리 영역
  // ============================================================
  // 새로운 일기를 추가하려면 아래 배열에 객체를 추가하세요.
  //
  // 각 일기 객체의 구조:
  // {
  //   date: "YYYY.MM.DD",      // 👉 일기 날짜 (반드시 이 형식으로 작성)
  //   title: "일기 제목",       // 👉 일기 제목
  //   photos: [                // 👉 사진 경로 배열 (비어있어도 됨)
  //     "images/사진1.jpg",
  //     "images/사진2.jpg"
  //   ],
  //   content: `일기 내용`      // 👉 일기 본문 (백틱 \` \` 안에 작성)
  // }
  //
  // 📌 주의사항:
  // - date는 반드시 "YYYY.MM.DD" 형식으로 작성 (예: "2026.05.10")
  // - photos는 배열로, 사진이 없으면 빈 배열 [] 사용
  // - 사진 경로는 실제 파일 위치에 맞게 수정 (예: "images/day1-1.jpg")
  // - content는 백틱(\`) 안에 작성하면 여러 줄 가능
  // - 일기는 date 순서대로 정렬됨
  //
  // 💡 사용 예시:
  // {
  //   date: "2026.05.10",
  //   title: "처음 만난 날",
  //   photos: ["images/photo1.jpg", "images/photo2.jpg"],
  //   content: `오늘 우연히 카페에서 만났다.
  // 커피 향기가 좋은 날이었다.`
  // }
  // ============================================================

  const diaryEntries = [
    {
      date: "2026.05.10",
      title: "첫 만남",
      photos: [],
      content: `오늘은 오빠를 처음 만났던 이야기를 가장 먼저 남기고 싶다.

사실 처음부터 오빠와 만나기로 계획되어 있던 건 아니었다.
에스컬레이터를 타고 올라갈 땐 엄청나게 떨렸고, 오빠를 마주했을 때도 많이 어색하고 긴장됐지만 그렇지 않으려고 꾹꾹 참았다.

그러고서는 10분 정도 걸었을까.
술집 거리에 도착해서 오빠와 처음으로 한잔을 했다.
무슨 이야기를 했는지는 기억도 안 나는데, 한참을 이야기했고 오빠 집으로 가는 내내도 계속 이야기를 나눴다.

계획된 만남은 아니었지만,
이 하루 덕분에 최용기라는 사람을 알 수 있게 되었고,
2026년 중 아마 가장 행복한 하루가 아닐까 생각하게 된다.`
    },
    {
      date: "2026.05.16",
      title: "첫 데이트",
      photos: [
        "images/day02-1.jpg","images/day02-2.jpg"
      ],
      content: `오늘은 오빠와 사귀고 나서 정식으로 처음 만나는 날이다.

사실 일주일 만에 보는 거라 나도 꽤 긴장했다.
며칠 전부터는 무슨 옷을 입을지 엄청 고민했고, 오빠가 나를 데리러 와줬을 때는 예쁘다고 계속 말해줬다.

사실 누군가에게 예쁘다는 이야기를 들어본 게 처음이라 너무 낯간지럽기도 했지만, 그만큼 기분 좋은 말도 없는 것 같다.

오빠가 맛있다고 한 쪽갈비를 먹으러 갔는데 정말 맛있었다.
다만 매운맛이 생각보다 너무 매워서 오빠랑 나랑 둘 다 엄청 매워하면서 먹었다. ㅋㅋㅋ...

그러고 나서는 둘이 배스킨라빈스를 포장해서 고척돔을 구경할 겸 산책하면서 먹었다.
날도 선선해서 오빠와 함께하는 일분일초가 너무 소중하고 행복했다.

물론 집에 가는 길에는 택시를 반대편으로 잡는 바람에 기사님께 꾸중을 듣기도 했다.

오빠와 사귀고 나서 처음 만난 날이었는데,
조금은 어색했지만 그보다 훨씬 더 설레고 행복했던 하루였다.`
    },
    {
      date: "2026.05.19",
      title: "깜짝 방문",
      photos: [
        
      ],
      content: `오늘은 오빠가 깜짝 방문해 준 날이다.

사실 전날부터 마라엽떡이 너무 먹고 싶어서 계속 마라엽떡 노래를 불렀는데, 오빠가 퇴근하고 같이 먹으러 와줬다.

진짜 서프라이즈라 너무 당황하기도 했지만, 나만 오빠를 보고 싶은 게 아니라는 생각이 들어서 내심 기분이 좋았다.

오빠는 항상 뭘 먹을 때 내 접시에 먼저 덜어주곤 한다.
쪽갈비를 먹을 때도 그랬고, 그런 사소한 배려들이 나는 너무 좋다.

오빠랑 헤어지기 아쉬워서 남항근린공원에 가서 산책을 했는데, 자꾸 하수구 냄새가 나는 바람에 참... 당황스러웠다.
그래도 시간이 지나면 이것도 둘이 웃으면서 이야기할 수 있는 추억이 되지 않을까 생각한다.

사실 오늘은 오빠에게 너무너무 고마운 하루였다.
퇴근하고 오는 길이 결코 쉽지는 않았을 텐데도 나를 보기 위해 와준다는 게 너무 고맙고 감동이었다.

누군가에게 이렇게 사랑받는다는 감정이 처음이라, 이런 마음을 선물해 준 오빠에게 또 한 번 감사함을 느끼게 된 하루였다.`
    },
    {
      date: "2026.05.23",
      title: "한강 데이트",
      photos: [
        "images/day04-1.jpg","images/day04-2.jpg","images/day04-3.jpg","images/day04-4.jpg"
      ],
      content: `오늘도 오빠와 어김없이 데이트를 했다.

오늘은 오빠와 한강에 가기로 한 날이다.
제대로 한강에서 시간을 보내는 건 처음이라 너무너무 기대됐다.

한강에 가기 전에는 오빠와 첫 영화 데이트를 했다.
첫 영화는 <군체>였는데, 보기 전에 뭘 먹을지 고민하다가 내가 마라샹궈가 먹고 싶다고 해서 같이 마라샹궈를 먹었다.

오빠가 원래 마라샹궈를 별로 안 좋아한다고 해서 조금 미안했는데, 생각보다 잘 먹는 것 같아서 다행이었다.

영화를 보고 나와서는 오빠 집에 들러 한강 갈 준비를 했는데, 오빠가 생각보다 준비를 너무 열심히 해와줘서 또 한 번 감동했다.

혼자 캠핑 의자도 챙기고, 과일이랑 이것저것 다 준비해줬다는 게 너무 사랑스럽고 고마웠다.

말로는 고맙다는 표현을 많이 못 한 것 같아서 조금 후회스럽지만, 오빠와 함께한 한강에서의 시간도 너무 행복했고, 남한산성에 갔다가 다시 한강으로 돌아와 한적하게 라면을 먹었던 그 순간마저도 너무 좋았다.

오빠와 함께 있으면 항상 나를 위해 많은 걸 준비해주고, 사소한 것 하나까지도 세심하게 챙겨주는 것 같다.

그래서 고마운 게 셀 수 없이 많지만, 그 마음을 하나하나 다 표현하지 못하는 것 같아 미안하기도 하다.

나한테는 과분할 정도로 큰 사랑을 받고 있다는 생각이 들 만큼 요즘은 정말 행복한 하루하루를 보내고 있다.

나도 앞으로는 오빠에게 부끄럽지 않은 사람이 될 수 있도록 더 많이 노력해야겠다.`
    },
    {
      date: "2026.05.30",
      title: "이것저것 많이 한 하루",
      photos: [
        "images/day05-1.jpg",
        "images/day05-2.jpg", 
        "images/day05-3.jpg",
        "images/day05-4.jpg",
        "images/day05-5.jpg",
        "images/day05-6.jpg",
        "images/day05-7.jpg"
      ],
      content: `오늘은 오빠의 첫 훠궈 날이다.
그리고 참 이것저것 많이 한 하루이기도 했다.

오빠랑 구월동에 있는 용가훠궈에 갔다.
오빠는 훠궈가 처음이라 신기했는지 이것저것 사진을 찍어댔는데, 그 모습이 나한테는 너무 귀여웠다.

나는 너무 맛있게 먹었는데 오빠는 훠궈가 입맛에 별로 안 맞았는지 자꾸 사이드 메뉴만 먹었다.
그 모습을 보니까 내가 좋아하는 곳만 데려오는 것 같아서 조금 미안하기도 했다.

다 먹고 나서는 내가 몬치치에 한창 빠져버린 바람에 누리플러스에 가서 오빠랑 한참을 구경했다.
나는 이것저것 사고 싶은 게 많았는데 오빠가 말리는 바람에 결국 하나도 사지 않았다...

다 구경하고 나서는 영종도에 있는 더노벰버에 갔다.
들어간 순간 보이는 풍경이 너무 예쁘고 아름다웠다.

커피를 시키고 앉아서 오빠랑 하염없이 수다도 떨고, 고무줄을 가지고 계속 장난치면서 놀았다.
괜히 어릴 때로 돌아간 것 같아서 너무 웃기고 재미있었다.

그렇게 한참 떠드는 동안 노을이 졌는데, 그 순간을 오빠와 함께할 수 있다는 게 너무 좋았다.

이후에는 오빠랑 송도에 가서 산책을 했다.
그런데 오빠가 사슴한테 푹 빠져버리는 바람에 사슴한테까지 질투해야 하는 하루였다...
난 아직도 이 사슴이 너무 싫다. ㅋㅋㅋ
그래도 오빠와 송도에서 조용히 산책했던 그 순간만큼은 좋았다.

오늘은 오빠 덕분에 이곳저곳 정말 많이 다닌 하루였다.
예쁜 카페도 가고, 몬치치도 구경하고, 용가훠궈도 먹고...

오빠와 사귀면서 평범하게 지나갈 수도 있는 하루하루가 참 소중해지는 것 같다.
앞으로도 오빠와 오래오래 함께하면서 좋은 추억을 많이 만들고 싶다.`
    },
    {
      date: "2026.08.12",
      title: "여름 밤",
      photos: [
        "images/day6-1.jpg"
      ],
      content: `밤하늘의 별을 보며 이야기를 나누었다.`
    },
    {
      date: "2026.08.20",
      title: "사진 없는 일기 예시",
      photos: [],
      content: `이 일기는 사진이 없지만 정상적으로 표시됩니다. 제목과 내용만 보여집니다.`
    }
  ];

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

  // diaryEntries의 날짜 형식(YYYY.MM.DD)을 ISO 형식(YYYY-MM-DD)으로 변환
  function displayToIsoDate(displayDate) {
    return displayDate.replace(/\./g, '-');
  }

  // ISO 형식(YYYY-MM-DD)을 diaryEntries의 날짜 형식(YYYY.MM.DD)으로 변환
  function isoToDisplayDate(isoDate) {
    return isoDate.replace(/-/g, '.');
  }

  function formatMonthYear(date) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()] + ' ' + date.getFullYear();
  }

  function buildCalendar() {
    var dates = [];
    for (var i = 0; i < FILM_DAYS; i++) {
      var date = new Date(FILM_START);
      date.setDate(date.getDate() + i);
      dates.push({
        iso: formatIsoDate(date),
        display: formatDisplayDate(date),
        day: date.getDate(),
        hasEntry: diaryEntries.some(function (entry) {
          return displayToIsoDate(entry.date) === formatIsoDate(date);
        })
      });
    }
    return dates;
  }

  function renderCalendar() {
    calendarMonth.textContent = formatMonthYear(currentCalendarDate);
    calendarDates.innerHTML = '';

    var year = currentCalendarDate.getFullYear();
    var month = currentCalendarDate.getMonth();

    // Get first day of month and total days in month
    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    var startDay = firstDay.getDay();
    var daysInMonth = lastDay.getDate();

    // Add empty cells for days before the first day of month
    for (var i = 0; i < startDay; i++) {
      var emptyCell = document.createElement('div');
      emptyCell.className = 'calendar__date calendar__date--empty';
      emptyCell.setAttribute('aria-hidden', 'true');
      calendarDates.appendChild(emptyCell);
    }

    // Add date cells for the current month
    for (var day = 1; day <= daysInMonth; day++) {
      var currentDate = new Date(year, month, day);
      var isoDate = formatIsoDate(currentDate);
      var displayDate = formatDisplayDate(currentDate);
      var hasEntry = diaryEntries.some(function (entry) {
        return displayToIsoDate(entry.date) === isoDate;
      });

      var dateCell = document.createElement('button');
      dateCell.className = 'calendar__date';
      dateCell.textContent = day;
      dateCell.dataset.date = isoDate;
      dateCell.setAttribute('aria-label', displayDate);

      if (hasEntry) {
        dateCell.classList.add('calendar__date--has-entry');
        dateCell.setAttribute('aria-label', displayDate + ' - Has entry');
      } else {
        dateCell.classList.add('calendar__date--empty');
        dateCell.disabled = true;
      }

      calendarDates.appendChild(dateCell);
    }

    // Update navigation buttons
    updateMonthNavigation();

    // Add click handlers for dates with entries
    var dateButtons = calendarDates.querySelectorAll('.calendar__date--has-entry');
    dateButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dateIso = this.dataset.date;
        var entryIndex = diaryEntries.findIndex(function (entry) {
          return displayToIsoDate(entry.date) === dateIso;
        });
        if (entryIndex !== -1) {
          openDayPage(this, entryIndex);
        }
      });
    });
  }

  function updateMonthNavigation() {
    var year = currentCalendarDate.getFullYear();
    var month = currentCalendarDate.getMonth();

    // Calculate the range of months that contain diary entries
    var firstEntryDate = new Date(displayToIsoDate(diaryEntries[0].date));
    var lastEntryDate = new Date(displayToIsoDate(diaryEntries[diaryEntries.length - 1].date));

    // Disable previous button if we're at or before the first entry month
    monthPrev.disabled = (year < firstEntryDate.getFullYear()) ||
                         (year === firstEntryDate.getFullYear() && month <= firstEntryDate.getMonth());

    // Disable next button if we're at or after the last entry month
    monthNext.disabled = (year > lastEntryDate.getFullYear()) ||
                        (year === lastEntryDate.getFullYear() && month >= lastEntryDate.getMonth());
  }

  function goToPrevMonth() {
    if (monthPrev.disabled) return;
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
  }

  function goToNextMonth() {
    if (monthNext.disabled) return;
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
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

  function updateOpenState() {
    var allFilled = Array.from(codeInputs).every(function (input) {
      return input.value.length === 1;
    });
    openBtn.disabled = !allFilled;
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
    openBtn.disabled = true;
  }

  function focusInput(index) {
    if (index >= 0 && index < codeInputs.length) {
      codeInputs[index].focus();
      setActiveDot(index);
    }
  }

  function triggerFlash() {
    flashLayer.classList.add('flash-layer--active');
    setTimeout(function () {
      flashLayer.classList.remove('flash-layer--active');
    }, 150);
  }

  function playShutterSound() {
    shutterSound.volume = 0.1;
    shutterSound.currentTime = 0;
    shutterSound.play().catch(function () {
      // Audio play failed (likely due to browser autoplay policy)
    });
  }

  function goToPassword() {
    if (isTransitioning) return;
    isTransitioning = true;

    playShutterSound();
    triggerFlash();

    setTimeout(function () {
      showScreen(password, opening, function () {
        focusInput(0);
      });
    }, 200);
  }

  function goToGallery() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentCalendarDate = new Date(FILM_START);
    renderCalendar();
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

  function renderPhotoCarousel(photos) {
    photoTrack.innerHTML = '';
    photoDots.innerHTML = '';
    currentPhotoIndex = 0;

    // 사진이 없는 경우 사진 영역 숨김
    if (!photos || photos.length === 0) {
      photoCarousel.style.display = 'none';
      photoCarousel.setAttribute('aria-hidden', 'true');
      return;
    }

    // 사진이 있는 경우 사진 영역 표시
    photoCarousel.style.display = 'block';
    photoCarousel.setAttribute('aria-hidden', 'false');

    // Render each photo as a slide
    photos.forEach(function (photoSrc, index) {
      var slide = document.createElement('img');
      slide.className = 'photo-carousel__slide';
      slide.src = photoSrc;
      slide.alt = 'Photo ' + (index + 1);
      photoTrack.appendChild(slide);

      var dot = document.createElement('button');
      dot.className = 'photo-carousel__dot';
      if (index === 0) dot.classList.add('photo-carousel__dot--active');
      dot.setAttribute('aria-label', 'Go to photo ' + (index + 1));
      dot.addEventListener('click', function () {
        goToPhoto(index);
      });
      photoDots.appendChild(dot);
    });

    updatePhotoNav();
  }

  function goToPhoto(index) {
    var photos = diaryEntries[currentEntryIndex].photos;
    if (!photos || photos.length === 0) return;
    if (index < 0 || index >= photos.length) return;

    currentPhotoIndex = index;
    photoTrack.style.transform = 'translateX(-' + (index * 100) + '%)';

    var dots = photoDots.querySelectorAll('.photo-carousel__dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('photo-carousel__dot--active', i === index);
    });

    updatePhotoNav();
  }

  function updatePhotoNav() {
    var photos = diaryEntries[currentEntryIndex].photos;
    if (!photos || photos.length === 0) {
      photoPrev.disabled = true;
      photoNext.disabled = true;
      return;
    }
    photoPrev.disabled = currentPhotoIndex === 0;
    photoNext.disabled = currentPhotoIndex === photos.length - 1;
  }

  function openDayPage(button, entryIndex) {
    if (isTransitioning) return;
    isTransitioning = true;

    currentEntryIndex = entryIndex;
    var entry = diaryEntries[entryIndex];
    var displayDate = entry.date;
    var isoDate = displayToIsoDate(displayDate);

    dayPageDate.textContent = displayDate;
    dayPageDate.setAttribute('datetime', isoDate);
    dayPageTitle.textContent = entry.title;
    dayPageBody.textContent = entry.content;

    renderPhotoCarousel(entry.photos);
    updateNextButton();

    // Add scale animation to the button
    if (button) {
      button.classList.add('calendar__date--selected');
    }

    // Wait for scale animation, then transition
    setTimeout(function () {
      gallery.classList.remove('screen--active');
      gallery.classList.add('screen--exiting');
      gallery.setAttribute('aria-hidden', 'true');

      dayPage.classList.add('screen--entering', 'screen--active');
      dayPage.setAttribute('aria-hidden', 'false');

      if (button) {
        button.style.visibility = 'hidden';
        button.classList.remove('calendar__date--selected');
      }

      setTimeout(function () {
        gallery.classList.remove('screen--exiting', 'screen--entering');
        dayPage.classList.remove('screen--entering');
        isTransitioning = false;
      }, TRANSITION_MS);
    }, 150);
  }

  function goBackToCalendar() {
    if (isTransitioning) return;
    isTransitioning = true;

    // Set calendar to the current entry's month
    if (currentEntryIndex >= 0 && diaryEntries[currentEntryIndex]) {
      var entryDate = new Date(displayToIsoDate(diaryEntries[currentEntryIndex].date));
      currentCalendarDate = new Date(entryDate.getFullYear(), entryDate.getMonth(), 1);
    }

    renderCalendar();
    showScreen(gallery, dayPage);
  }

  function goToNextEntry() {
    if (isTransitioning) return;
    if (currentEntryIndex >= diaryEntries.length - 1) {
      goToFinalScreen();
      return;
    }

    isTransitioning = true;
    currentEntryIndex++;

    var entry = diaryEntries[currentEntryIndex];
    var displayDate = entry.date;
    var isoDate = displayToIsoDate(displayDate);

    dayPageDate.textContent = displayDate;
    dayPageDate.setAttribute('datetime', isoDate);
    dayPageTitle.textContent = entry.title;
    dayPageBody.textContent = entry.content;

    renderPhotoCarousel(entry.photos);
    updateNextButton();

    // Fade transition
    dayPage.style.opacity = '0';
    setTimeout(function () {
      dayPage.style.opacity = '1';
      isTransitioning = false;
    }, 300);
  }

  function updateNextButton() {
    nextEntryBtn.disabled = currentEntryIndex >= diaryEntries.length - 1;
    if (currentEntryIndex >= diaryEntries.length - 1) {
      nextEntryBtn.textContent = 'Finish →';
    } else {
      nextEntryBtn.textContent = '다음 이야기 →';
    }
  }

  function goToFinalScreen() {
    if (isTransitioning) return;
    isTransitioning = true;
    showScreen(finalScreen, dayPage);
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      bgMusic.pause();
      musicBtn.classList.remove('music-btn--playing');
    } else {
      bgMusic.volume = 0.3;
      bgMusic.play().catch(function () {
        // Audio play failed
      });
      musicBtn.classList.add('music-btn--playing');
    }
    isMusicPlaying = !isMusicPlaying;
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

    updateOpenState();
  }

  function handleCodeKeydown(e) {
    var input = e.target;
    var index = parseInt(input.dataset.index, 10);

    if (e.key === 'Backspace') {
      if (!input.value && index > 0) {
        codeInputs[index - 1].value = '';
        updateDotStates();
        updateOpenState();
        focusInput(index - 1);
      } else {
        input.value = '';
        updateDotStates();
        updateOpenState();
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
    var paste = (e.clipboardData || window.clipboardData).getData('text');
    var digits = paste.replace(/\D/g, '').slice(0, 4);

    digits.split('').forEach(function (digit, i) {
      if (i < codeInputs.length) {
        codeInputs[i].value = digit;
      }
    });

    updateDotStates();
    updateOpenState();

    var filledCount = digits.length;
    if (filledCount > 0 && filledCount < 4) {
      focusInput(filledCount);
    } else if (filledCount === 4) {
      setActiveDot(3);
    }
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (getEnteredCode() === ACCESS_CODE) {
      clearCodeInputs();
      goToGallery();
    } else {
      shakePasswordForm();
      clearCodeInputs();
      focusInput(0);
    }
  }

  // Event Listeners
  startBtn.addEventListener('click', goToPassword);

  codeInputs.forEach(function (input) {
    input.addEventListener('input', handleCodeInput);
    input.addEventListener('keydown', handleCodeKeydown);
    input.addEventListener('paste', handleCodePaste);
    input.addEventListener('focus', function () {
      setActiveDot(parseInt(this.dataset.index, 10));
    });
  });

  passwordForm.addEventListener('submit', handlePasswordSubmit);

  calendarBtn.addEventListener('click', goBackToCalendar);

  monthPrev.addEventListener('click', goToPrevMonth);
  monthNext.addEventListener('click', goToNextMonth);

  nextEntryBtn.addEventListener('click', goToNextEntry);

  photoPrev.addEventListener('click', function () {
    goToPhoto(currentPhotoIndex - 1);
  });

  photoNext.addEventListener('click', function () {
    goToPhoto(currentPhotoIndex + 1);
  });

  musicBtn.addEventListener('click', toggleMusic);

  // Check if music file exists and enable button
  bgMusic.addEventListener('canplaythrough', function () {
    musicBtn.disabled = false;
  });

  bgMusic.addEventListener('error', function () {
    musicBtn.disabled = true;
  });

  // Initialize
  musicBtn.disabled = true;

})();
