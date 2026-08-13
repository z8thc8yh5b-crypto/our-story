(function () {
  'use strict';

  try {
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
  var endingNext = document.getElementById('ending-next');

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
  var currentMediaIndex = 0;          // 현재 보고 있는 미디어 인덱스
  var currentMediaItems = [];         // 현재 일기의 미디어 아이템들
  var isMusicPlaying = false;         // 음악 재생 중인지 확인
  var musicStarted = false;           // 음악이 한 번이라도 시작되었는지
  var currentCalendarDate = new Date(FILM_START); // 현재 달력이 보여주는 월
  var endingLineIndex = 0;            // 현재 엔딩 문장 인덱스

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
      date: "2026.05.31",
      title: "예고 없이 찾아온 하루",
      photos: [
        "images/day06-1.jpg"
      ],
      content: `오늘도 오빠가 깜짝 방문을 했다.

시험이 얼마 남지 않아서 60주년에서 공부를 하고 있었는데, 오빠가 갑자기 학교 사진을 대뜸 보내왔다.
전날에 봤었기 때문에 오빠가 올 거라고는 생각도 못 해서 너무 놀랐다.

그래서 얼른 준비하고 나갔는데, 학교 벤치에 오빠가 앉아서 나를 기다리고 있었다.
그 모습을 보니까 괜히 마음이 너무 좋았다.

그렇게 오빠랑 같이 나가서 요아정을 먹고, 근처를 한참 산책하다가 헤어졌다.

계획하지 않았던 만남이라 그런지 오빠를 만나는 순간부터 괜히 더 떨리고 행복했다.
바쁜데도 항상 나를 보러 와주는 오빠가 너무너무 고맙다.

오늘도 또 한 번 오빠에게 푹 빠진 것 같다. 🤍`
    },
    {
      date: "2026.06.02",
      title: "시험기간에",
      photos: [
        "images/day07-1.jpg",
        "images/day07-2.jpg",
        "images/day07-3.jpg",
        "images/day07-4.jpg"
      ],
      content: `오늘은 시험이 진짜 진짜 얼마 남지 않은 관계로 오빠랑 밥만 먹고 헤어지기로 했다.

그리고 오늘도 역시 오빠가 나를 데리러 와줬다.
그렇게 차를 타고 주안에 있는 족발을 먹으러 가기로 했다.

오빠가 이 날 족발이랑 삼겹살 중에 뭐 먹을 거냐고 물어봤는데, 항상 삼겹살집을 찾을 때마다 내 생각해서 파채 있는 집으로 찾아주는 게 너무 귀엽다..

족발은 정말 너무너무×100 맛있었다.
사실 족발보다 막국수가 정말 맛있었다!!

원래대로라면 밥만 먹고 이대로 헤어졌어야 했는데, 막상 오빠를 보니까 너무 좋아서 하루만 더 같이 있으면 안 되냐고 물어봤다.
오빠도 좋다고 해서 결국 가산으로 갔다.
그러고선 구디에서 술을 마시기로 했다.

구디에 가니까 사람이 엄청나게 많아서 술집도 두 번이나 헤맸다.
그렇게 겨우 술집을 찾아서 술을 마시고 있는데 오빠가 갑자기 나한테 휴지 반지를 만들어줬다.
뭐지? 결혼하자는 건가ㅡㅡ??

술을 마신 뒤에는 오빠랑 인생네컷도 찍고 집으로 돌아갔다.

비록 시험기간이라 오래 함께하지는 못했지만, 결국 오빠랑 하루를 더 같이 보낼 수 있어서 너무 행복했다.
역시 오빠를 만나면 계획대로 되는 게 하나도 없는 것 같다.
그래도 나는 그런 하루들이 너무 좋다.`
    },
    {
      date: "2026.06.05",
      title: "감동 폭발",
      photos: [
        "images/day08-1.jpg"
      ],
      content: `오늘은 사실 다음 날 오빠랑 만나기로 해서 오늘은 안 만날 줄 알았는데, 오빠가 보고 싶다고 해줘서 볼 수 있었던 날이다.

체용기가 자꾸 보고 싶다고 할 때마다 귀여워 죽겠다 아주… ㅋㅋㅋ

오빠가 신전 먹고 싶다고 했는데 마땅한 곳이 없어서 고봉민김밥으로 갔다.
김밥집에서 밥을 먹는 게 정말 오랜만이라 괜히 감회가 새로웠다.
그리고 여기 아주머니들도 너무 친절하시고 돈까스도 완전 맛있었다. 최고..

그러고 나서는 메가커피에 가서 음료를 테이크아웃하고 한참을 수다 떨다가 헤어졌다.

그리고 오빠가 시험 볼 때 당 충전하라고 마카롱을 사다 줬는데, 진짜 상상도 못했던 일이라서 감동이 폭발했다 🥹🥹

오빠한테 매번 고마운 일만 생기는 것 같다.
나도 오빠한테 더 잘해줘야겠다.

다음 날 만나기로 했는데도 보고 싶다고 찾아와준 오빠 덕분에, 짧게 만났지만 더 특별하고 행복했던 하루였다.`
    },
    {
      date: "2026.06.06",
      title: "평범한 하루",
      photos: [
        "images/day11-1.jpg"
      ],
      videos: [
        "images/day11-2.mov"
      ],
      content: `오늘은 오빠랑 카공을 하기로 했다.

시험이 얼마 안 남은 관계로 오빠랑 닭갈비를 먹고 같이 카공하기로 했는데, 투썸에 가는 길에 선배를 만나버리는 바람에 괜히 민망해져버렸다… ㅋㅋㅋ

투썸에서 나는 계속 공부를 하고 오빠는 계속 책을 읽었다.
그런데 집중력 이슈 때문인지 오빠는 책을 읽다가 갑자기 유튜브를 보기 시작했다.. ㅋㅋㅋ

그렇게 한참 공부하다가 나도 이제 집중이 안 돼서 오빠랑 나가서 인형뽑기를 하러 갔다.
한 번 시작하면 뽑을 때까지 계속 돈을 쓸 것 같아서 오빠를 말렸는데, 오빠가 바로 뽑아버려서 나도 당황하고 오빠도 당황했다 ㅋㅋㅋㅋ

그러고 나서는 수봉공원 스카이워크에 산책하러 갔다.
생각보다 너무 예쁘고 한적해서 좋았다.
강아지 산책하러 오시는 분들도 많아서 강아지 구경도 실컷 할 수 있었다.

이것저것 하는 것도 좋지만 오빠랑 이렇게 한적한 곳을 산책할 때 기분이 좋은 것 같다.
오늘처럼 별거 아닌 것 같은 하루가 나중에는 제일 기억에 오래 남을 것 같다는 생각이 들었다.`
    },
    {
      date: "2026.06.12",
      title: "한정선 먹빵",
      photos: [
        "images/day09-1.JPG",
        "images/day09-2.JPG",
        "images/day09-3.JPG",
        "images/day09-4.JPG"
      ],
      content: `오늘은 한정선 먹었다아 ~~~..

내가 한정선 먹고 싶다고 쫄라서 오빠랑 같이 더현대에 갔다.
두 개만 먹기로 해놓고 오빠가 플렉스 해줘서 네 개나 푸파했다 ㅋㅋㅋㅋ

사실 바이럴 된 거에 비해서는 별로라서 좀 실망했다..
근데 두바이는 또 먹고 싶다…

그렇게 하고서는 문래동에 갔다.
나도 첫 문래동이라서 두근듀근 했는데 생각보다 별로였다.
뭔가 제2의 행궁동? 뭐 이런 느낌이였다..
그래도 다시 한 번 오빠랑 가보고 싶다.

그러고 나서는 처음으로 오빠 친구를 봤다.
사실 너무너무너무 떨렸는데 생각보다 대화도 잘 이끌어주셔서 참으로 다행이였다.

근데 내가 너무!!! 취해버리는 바람에 죄송하고 죄송하고.. 또 죄송한 하루였다 ㅜㅜ 오빠한테도..

집에 와서는 취해서 오빠랑 또 다퉜다.
오빠가 자꾸 나를 연수빈이라고 불러서 내가 속상했나보다..
지금 생각해보니까 취해서 괜히 더 예민하게 굴었던 것 같아서 참 오빠한테 미안하네ㅜ..

그래도 오빠한테 내가 친구를 소개시켜줄 수 있을 정도로 부끄러운 사람이 아니라는 점에서 괜히 뿌듯하고 좋았다!

오빠는 내가 먹고 싶다고 쫄라대면 다 먹으러 가주고, 가고 싶은 곳이 있으면 같이 가주는 게 참 좋은 남자친구인 거 같닷! ㅎㅎ..

오늘은 이것저것 정신없는 일도 많았지만 그래도 오빠랑 새로운 곳도 가보고, 처음으로 오빠 친구도 만나보고, 또 하나의 추억이 생긴 것 같다.`
    },
    {
      date: "2026.06.13",
      title: "안국동에서의 하루",
      photos: [
        "images/day10-1.JPG",
        "images/day10-2.JPG",
        "images/day10-3.JPG",
        "images/day10-4.JPG",
        "images/day10-5.JPG",
        "images/day10-6.JPG",
        "images/day10-7.JPG",
        "images/day10-8.JPG"
      ],
      content: `오늘은 아침에 일어나서 오빠랑 안국동에 가기로 했다.

오빠가 만나기 전부터 열심히 찾아봤던 미쉐린 라멘집에 갔는데, 기대를 많이 해서 그런지 괜히 먹기 전부터 어떤 맛일지 궁금했다.
막상 먹어보니까 맛있긴 했는데 생각보다 조금 짰다.. 이게 미쉐린의 맛인가.. ㅋㅋㅋ
오빠가 시킨 라멘은 별로 안 짜고 맛있었는데 내 것만 쫌 짰다.
그래도 계란장은 진짜 맛있었다.

밥을 먹고 나서는 카페에서 음료를 테이크아웃해서 감자밭에 갔다.
오빠가 찾아준 곳이라 같이 구경해보고 싶었는데, 가보니까 가게가 생각보다 컨셉에 너무 충실했다.
들어가자마자 뭔가 둘 다 감당하기 힘든 느낌이 들어서 결국 제대로 구경도 못 하고 바로 나왔다 ㅋㅋㅋㅋ

그다음에는 창덕궁을 구경하러 갔다.
날씨가 너무 덥고 땡볕이라 돌아다니는 동안에는 진짜 너무 힘들었다 ㅠㅠ
그때는 더워서 빨리 어디 들어가고 싶다는 생각밖에 안 들었는데, 나중에 사진을 다시 보니까 생각보다 풍경이 너무 예쁘게 찍혀 있었다.
힘들었던 기억까지 같이 있어서 그런지 오히려 사진을 보니까 그날이 더 오래 기억에 남을 것 같다.

그리고 내가 좋아하는 청계천에도 가기로 했다.
나한테 청계천은 그냥 걷기만 해도 괜히 기분이 좋아지는 공간이라 오빠랑 같이 가는 걸 꽤 기대하고 있었다.

그런데 도착하고 보니 웬놈의 퀴어축제?? 때문에 사람이 엄청 많고 시끄러워서 정신이 하나도 없었다.
결국 제대로 구경도 못 하고 혼이 쏙 빠진 채로 빨리 집으로 돌아왔다. ㅋㅋㅋ

청계천에서 여유롭게 산책하려고 했는데 생각지도 못하게 이렇게 끝나버려서 조금 아쉬웠다.

집에 돌아와서는 아쉬운 마음을 달래듯 교촌을 먹었다.

오늘은 날이 너무 덥기도 하고 청계천도 너무 시끄러워서 아쉬웠지만, 오빠랑 같이 맛있는 것도 먹고 여기저기 돌아다니면서 생각보다 많은 이야기를 나눴다.

항상 생각하지만 오빠는 내가 좋아할 만한 곳이나 맛있는 곳을 찾아서 같이 가주는 것 같다.
내가 아무렇지 않게 지나가는 것들도 오빠가 하나씩 찾아보고 데려가주는 게 참 고맙다.

청계천은 다음에 꼭 다시 가야겠다.
그때는 사람도 별로 없고 날씨도 조금 선선해서 오빠랑 천천히 걸을 수 있었으면 좋겠다.`
    },
    {
      date: "2026.07.03",
      title: "첫 여행",
      photos: [
        "images/day12-1.JPG",
        "images/day12-2.JPG",
        "images/day12-3.JPG",
        "images/day12-4.JPG",
        "images/day12-5.JPG",
        "images/day12-6.JPG",
        "images/day12-7.JPG"
      ],
      content: `출발하기 전부터 괜히 설레기도 했고, 조금은 긴장도 됐다.
막상 차에 타서는 잠이 들어버려 운전은 오빠 혼자 다 했는데, 얼마나 미안했는지 모른다.
그래도 항상 오빠는 나한테 괜찮다고 말해준다.. 오빠 미안...

도착해서 먹은 물회는 기대했던 것보다 조금 아쉬웠지만, 오히려 아무 기대 없이 먹었던 게살산도가 더 맛있었다.
덕분에 다음에는 더 맛있는 물회를 먹어볼 수 있겠다.

숙소에서 나와선 바다에서 놀면서 한참을 웃었다.
어린아이처럼 신나게 놀았고, 그 순간만큼은 아무 걱정도 없었다.
다음에는 물 안에 들어가서 놀고 싶다.

그렇게 실컷 놀고 회를 사러 갔는데 50분이나 걸린다고 해서 얌전히 앉아 이야기를 나누고 있었다.
그런데 20분도 채 지나지 않아 준비됐다는 말이 너무 어이없어서 웃겼다..
지금 생각해 보면 여행은 특별한 장소보다도 이런 사소한 순간들이 더 오래 기억에 남는 것 같다.

숙소로 돌아와 함께 회를 먹고, 밤공기를 마시며 잠시 산책했던 시간도 참 좋았다.
조용한 길을 나란히 걷던 그 순간이 유난히 기억에 남는다.
다만 내가 너무 취해버린 건 조금 아쉽다..ㅋㅋ

처음 함께 떠난 여행이라 긴장도 꽤 됐지만, 하루를 마무리하고 가장 크게 남은 감정은 역시 행복이었다.
어디를 갔는지보다 누구와 함께였는지가 더 중요하다는 걸 알게 된 하루였던 것 같다.

우리의 첫 여행이 오빠와 함께여서 참 다행이다.
앞으로도 이렇게 평범한 하루들을 하나씩 소중한 추억으로 만들어 갔으면 좋겠다.`
    },
    {
      date: "2026.07.04",
      title: "내 생일",
      photos: [
        "images/day13-1.JPG"
      ],
      content: `남자친구와 함께 보내는 첫 생일이었고, 그 처음을 오빠와 함께한다는 사실만으로도 참 특별한 하루였다.

전날 술을 너무 많이 마시는 바람에 하루 종일 속이 좋지 않았다.
해장을 해도 쉽게 괜찮아지지 않아서 괜히 스스로를 원망하기도 했다.

속초를 나가기 전에 갔던 카페는 조용하고 평화로웠다.
특별한 일을 하지 않아도 같은 공간에서 같은 풍경을 바라보고 있다는 것만으로 충분히 좋았다.
다음에는 겨울 바다도 함께 보러 가고 싶다.
같은 바다라도 계절이 달라지면 또 다른 추억이 생길 테니까.

집으로 돌아오는 길에도 나는 또 잠이 들었다.
사실 침까지 흘렸지만 끝까지 말하지 않았다.
그만큼 편안했고, 오빠 옆에서는 아무 걱정 없이 쉴 수 있었던 것 같다.

조금 쉬다가 치킨도 먹으러 갔는데, 속은 여전히 좋지 않았다.
그리고 나서 마리오 아울렛 구경한 건 참 재밌었다.
나는 백화점이나 아울렛이나 쇼핑몰 같은 거 구경하는 걸 참 좋아하는 거 같다.
비록 오빠는 아니지만..

생일은 늘 가족들과 외식하고 케이크를 불며 보내는 것이 익숙했는데, 올해는 전혀 다른 방식으로 하루를 보냈다.
케이크는 없었지만, 대신 오래도록 기억할 추억이 생겼다.
어쩌면 올해 생일은 그 어느 때보다도 특별했던 생일이 아닐까 싶다.

앞으로도 생일이 찾아올 때마다 자연스럽게 오빠와 함께하는 하루를 떠올릴 수 있었으면 좋겠다.
올해보다 내년이, 내년보다 그다음 해가 더 행복했으면 좋겠다.`
    },
    {
      date: "2026.07.11",
      title: "용산에서의 하루",
      photos: [
        "images/day14-1.JPG",
        "images/day14-2.JPG",
        "images/day14-3.JPG",
        "images/day14-4.JPG",
        "images/day14-5.JPG"
      ],
      content: `오빠랑 용산에 간 날이다.

사실 나는 아이파크몰에 자주 왔지만 오빠는 처음이라고 해서 가기 전까지만 해도 오빠가 되게 만족할 줄 알았는데..
내가 여태껏 가본 아이파크 중에 사람이 제일 많은 날이었다.

레고 만들고 싶어서 처음으로 레고를 보러 갔는데 오빠가 별로 흥미를 못 느껴하는 것 같아서 하자고 말을 못 했다..

그러고 나서 우리 둘이 젠틀몬스터에 푹 빠져서 젠틀몬스터 구경을 한참 했다.

그렇게 구경을 하고선 오코노미야끼를 먹으러 갔는데 자꾸 사진 찍고 싶은데 오빠가 계란말이를 한 개씩 먹어버리는 바람에 정작 사진 찍을 땐 세 개밖에 안 남았다..
그래도 맛있게 먹고 젤라또 먹으면서 다시 아이파크몰에 가서 무신사 구경하고 싶었는데 오빠가 너무 힘들어해서 대충 구경하고 집으로 왔다.

오빠랑 쇼핑하면 재밌을 거 같은데 너무 아숩다 항상.
다음번에는 오빠랑 꼭 몬자야끼두 먹으러 가야겠다!`
    },
    {
      date: "2026.08.02",
      title: "대전에서 함께한 하루",
      photos: [
        "images/day15-1.JPG",
        "images/day15-2.JPG",
        "images/day15-3.JPG",
        "images/day15-4.JPG",
        "images/day15-5.JPG",
        "images/day15-6.JPG",
        "images/day15-7.jpeg"
      ],
      content: `오늘은 오빠랑 거의 2주만에 보는 날이다..

오빠랑 사귀고선 이렇게까지 떨어져있던 적이 없는데 본가로 내려온 바람에 멀리 떨어지게 됐다.
오빠가 대전으로 오기로 했다.

사실 오빠가 오기 전까지 대전에 어딜 데려가야 될지 계속계속 고민하고 또 고민했었다.
오빠가 대전이 처음이라고 해서 만족시켜주고 싶었던 마음이 컸나보다.

오빠가 막상 우리 동네에 오니까 실감도 안 날 뿐더러 기분이 너무 이상하기도 했다.

오빠랑 처음에 근현대사전시관을 구경했는데 생각보다 잘해놓기도 했고 특히 추억의 문방구가 너무 재밌었다.

그리곤 내가 좋아하는 떡볶이집을 데려갔는데 오빠가 먹고 자꾸 속이 안 좋다고 해서 사실 눈치가 보이기도 하고 너무 미안했다..

날이 너무 더워서 밖을 도무지 돌아다닐 수가 없어서 카페에 들어가서 한참 수다를 떨었다.
날이 좋았으면 더 좋았을텐데 너무 더워서 걷기도 힘든 날씨였다.

그렇게 돌아다니다가 저녁으로 농민뜨끈이를 먹었는데, 나는 사실 내가 전에 먹었던 거보다도 너무 퍽퍽하고 별로였어서 걱정했는데 오빠가 너무 맛있게 먹어서 다행이었다..

그러고 와서는 숙소로 와서 오빠랑 빙수를 먹다가 누워있었는데 오빠랑 붙어있으니까 새삼 그렇게 좋을 수가 없었다..

거의 2주 만에 다시 만난 날이라 그런지, 오늘은 특별히 뭘 하지 않아도 오빠와 함께 있다는 것 자체가 참 좋았다.
멀리 떨어져 있는 동안 보고 싶었던 만큼 다시 만났을 때의 행복도 더 크게 느껴졌던 것 같다.

날씨도 너무 덥고 계획대로 되지 않은 순간도 있었지만, 결국 오늘 하루에서 가장 기억에 남는 건 오빠와 다시 함께할 수 있었다는 것이다.
오랜만에 만난 만큼 더 오래 기억에 남을 하루가 된 것 같다.`
    },
    {
      date: "2026.08.03",
      title: "상상도 못한 하루",
      photos: [
        "images/day16-1.JPG",
        "images/day16-2.JPG",
        "images/day16-3.JPG",
        "images/day16-4.JPG",
        "images/day16-5.JPG"
      ],
      content: `오늘은 오빠에게 정말 뜻밖의 선물을 받은 날이다.

밥을 먹으러 가려고 이동하고 있었는데 오빠가 갑자기 차 트렁크를 열더니 나한테 꽃을 건네줬다.
정말 상상도 못했던 순간이라 너무 놀랐고, 한동안 얼떨떨했던 것 같다.

꽃을 받을 거라고는 전혀 생각하지 못했는데 오빠가 이렇게 준비해줬다는 게 너무 고맙고 감동이었다.

그리고 오빠가 좋아할 것 같은 집을 찾아놨는데 하필 휴무일이라 먹으러 가지 못해서 그것도 조금 속상했다.
그래서 초밥을 먹으러 갔는데, 거기서 먹은 고등어 초밥이 생각보다 정말 맛있었다.

원래는 본점에 가서 성심당도 가려고 했는데 사람이 너무 많아서 결국 롯데백화점으로 갔다.
그런데 거기서도 줄을 한참 서야 해서 역시 성심당은 성심당인가 싶었다.. ㅋㅋㅋ

오늘은 생각하지도 못했던 꽃도 받고, 맛있는 것도 먹고, 오빠와 또 하나의 추억을 만들었다.

무엇보다 아무렇지 않은 것처럼 준비해서 갑자기 꽃을 건네준 오빠가 너무 고마웠다.
아마 오늘 받은 꽃은 그냥 꽃이라기보다, 오빠가 나를 생각하면서 준비해줬다는 마음 때문에 더 오래 기억에 남을 것 같다.`
    },
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

      // Check if it's the ending date (2026.08.17)
      var isEndingDate = displayDate === '2026.08.17';

      var dateCell = document.createElement('button');
      dateCell.className = 'calendar__date';
      dateCell.textContent = day;
      dateCell.dataset.date = isoDate;
      dateCell.setAttribute('aria-label', displayDate);

      if (hasEntry) {
        dateCell.classList.add('calendar__date--has-entry');
        dateCell.setAttribute('aria-label', displayDate + ' - Has entry');

        // Add heart icon for entries (not for ending date)
        if (!isEndingDate) {
          var heart = document.createElement('span');
          heart.className = 'calendar__heart';
          heart.innerHTML = '♥';
          heart.setAttribute('aria-hidden', 'true');
          dateCell.appendChild(heart);
        }
      } else if (isEndingDate) {
        dateCell.classList.add('calendar__date--ending');
        dateCell.setAttribute('aria-label', displayDate + ' - Ending');
      } else {
        dateCell.classList.add('calendar__date--empty');
        dateCell.disabled = true;
      }

      calendarDates.appendChild(dateCell);
    }

    // Update navigation buttons
    updateMonthNavigation();

    // Add click handlers for dates with entries and ending date
    var entryButtons = calendarDates.querySelectorAll('.calendar__date--has-entry');
    entryButtons.forEach(function (btn) {
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

    // Add click handler for ending date
    var endingButton = calendarDates.querySelector('.calendar__date--ending');
    if (endingButton) {
      endingButton.addEventListener('click', function () {
        goToEndingScreen();
      });
    }
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
    if (isTransitioning) {
      isTransitioning = false;
    }
    isTransitioning = true;

    playShutterSound();
    triggerFlash();

    setTimeout(function () {
      showScreen(password, opening, function () {
        focusInput(0);
        isTransitioning = false;
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

  function renderPhotoCarousel(photos, videos) {
    photoTrack.innerHTML = '';
    photoDots.innerHTML = '';
    currentMediaIndex = 0;
    currentMediaItems = [];

    // Combine photos and videos into a single media array
    var mediaItems = [];
    if (photos && photos.length > 0) {
      photos.forEach(function (photoSrc) {
        mediaItems.push({ type: 'image', src: photoSrc });
      });
    }
    if (videos && videos.length > 0) {
      videos.forEach(function (videoSrc) {
        mediaItems.push({ type: 'video', src: videoSrc });
      });
    }

    // 미디어가 없는 경우 미디어 영역 숨김
    if (mediaItems.length === 0) {
      photoCarousel.style.display = 'none';
      photoCarousel.setAttribute('aria-hidden', 'true');
      return;
    }

    // 미디어가 있는 경우 미디어 영역 표시
    photoCarousel.style.display = 'block';
    photoCarousel.setAttribute('aria-hidden', 'false');
    currentMediaItems = mediaItems;

    // Render each media item as a slide
    mediaItems.forEach(function (mediaItem, index) {
      var slide;
      if (mediaItem.type === 'image') {
        slide = document.createElement('img');
        slide.className = 'photo-carousel__slide';
        slide.src = mediaItem.src;
        slide.alt = 'Photo ' + (index + 1);
        slide.onerror = function() {
          console.error('Image load error:', mediaItem.src);
        };
      } else if (mediaItem.type === 'video') {
        slide = document.createElement('video');
        slide.className = 'photo-carousel__slide';
        slide.src = mediaItem.src;
        slide.controls = true;
        slide.playsInline = true; // iPhone Safari 지원
        slide.alt = 'Video ' + (index + 1);
        slide.onerror = function() {
          console.error('Video load error:', mediaItem.src);
        };
      }
      photoTrack.appendChild(slide);

      var dot = document.createElement('button');
      dot.className = 'photo-carousel__dot';
      if (index === 0) dot.classList.add('photo-carousel__dot--active');
      dot.setAttribute('aria-label', 'Go to media ' + (index + 1));
      dot.addEventListener('click', function () {
        goToMedia(index);
      });
      photoDots.appendChild(dot);
    });

    updatePhotoNav();
  }

  function goToMedia(index) {
    if (!currentMediaItems || currentMediaItems.length === 0) return;

    // Infinite loop: wrap around
    if (index < 0) {
      index = currentMediaItems.length - 1;
    } else if (index >= currentMediaItems.length) {
      index = 0;
    }

    currentMediaIndex = index;
    photoTrack.style.transform = 'translateX(-' + (index * 100) + '%)';

    var dots = photoDots.querySelectorAll('.photo-carousel__dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('photo-carousel__dot--active', i === index);
    });

    updatePhotoNav();
  }

  function updatePhotoNav() {
    if (!currentMediaItems || currentMediaItems.length === 0) {
      photoPrev.disabled = true;
      photoNext.disabled = true;
      return;
    }
    // No disabling for infinite loop
    photoPrev.disabled = false;
    photoNext.disabled = false;
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

    renderPhotoCarousel(entry.photos, entry.videos || []);
    updateNextButton();

    // Start music on first diary entry open
    if (!musicStarted) {
      tryPlayBackgroundMusic();
      musicStarted = true;
    }

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
      goToEndingScreen();
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

    renderPhotoCarousel(entry.photos, entry.videos || []);
    updateNextButton();

    // Fade transition
    dayPage.style.opacity = '0';
    setTimeout(function () {
      dayPage.style.opacity = '1';
      dayPage.scrollTop = 0;
      window.scrollTo(0, 0);
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

  function goToEndingScreen() {
    if (isTransitioning) return;
    isTransitioning = true;

    // Reset ending line index
    endingLineIndex = 0;
    showEndingLine(0);

    // Keep music playing
    showScreen(finalScreen, dayPage, function () {
      isTransitioning = false;
    });
  }

  function showEndingLine(index) {
    var lines = document.querySelectorAll('.ending-screen__line');
    lines.forEach(function (line, i) {
      line.classList.remove('ending-screen__line--active');
      if (i === index) {
        line.classList.add('ending-screen__line--active');
      }
    });

    // Hide next button on last line
    if (index >= lines.length - 1) {
      endingNext.disabled = true;
    } else {
      endingNext.disabled = false;
    }
  }

  function goToNextEndingLine() {
    var lines = document.querySelectorAll('.ending-screen__line');
    if (endingLineIndex < lines.length - 1) {
      endingLineIndex++;
      showEndingLine(endingLineIndex);
    }
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      bgMusic.pause();
      musicBtn.classList.remove('music-btn--playing');
    } else {
      tryPlayBackgroundMusic();
    }
    isMusicPlaying = !isMusicPlaying;
  }

  function tryPlayBackgroundMusic() {
    bgMusic.volume = 0.3;
    bgMusic.play().then(function () {
      isMusicPlaying = true;
      musicBtn.classList.add('music-btn--playing');
    }).catch(function () {
      // Audio play failed, keep current state
    });
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
    goToMedia(currentMediaIndex - 1);
  });

  photoNext.addEventListener('click', function () {
    goToMedia(currentMediaIndex + 1);
  });

  musicBtn.addEventListener('click', toggleMusic);

  endingNext.addEventListener('click', goToNextEndingLine);

  // Check if music file exists and enable button
  bgMusic.addEventListener('canplaythrough', function () {
    musicBtn.disabled = false;
  });

  bgMusic.addEventListener('error', function () {
    musicBtn.disabled = true;
  });

  // Initialize
  musicBtn.disabled = true;

  } catch (error) {
    console.error('JavaScript initialization error:', error);
  }
})();
