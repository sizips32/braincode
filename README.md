# 📖 성경 묵상 일기 (Bible Meditation Diary)

> **SDA(제칠일안식일예수재림교회) 성도들을 위한 통합 성경 묵상 및 기도 관리 시스템**

## 🎯 프로젝트 개요

성경 묵상, 기도, 교리 학습, 교회 일정을 통합 관리할 수 있는 웹 애플리케이션입니다. 개인 영성 생활과 교회 사역을 체계적으로 기록하고 관리할 수 있도록 설계되었습니다.

## ✨ 주요 기능

### 📅 **묵상 달력**
- 월간 달력 기반 묵상 기록 관리
- 날짜별 묵상 내용 조회 및 편집
- 성경 구절별 묵상 분류
- 날짜 클릭 시 성경 목록으로 이동

### 📖 **성경 목록**
- 구약/신약 66권 성경 구조화
- 성경별 묵상 기록 통계
- 성경 책별 묵상 목록 조회
- 새 묵상 작성 기능

### 🙏 **기도 관리**
- **묵상 기도**: 개인 영성 생활을 위한 기도
- **중보 기도**: 다른 사람을 위한 기도
- **대표 기도**: 교회 예배와 사역을 위한 기도
- 기도 응답 상태 관리
- 카테고리별 기도 분류

### 📚 **교리 학습**
- **28 기본교리**: SDA 핵심 교리 분류별 학습
- **예언의 신**: 예언 관련 글과 출처 기록
- 교리별 묵상 기도 연결
- 예언 글에서 묵상/기도 연결

### 🏛️ **교회 행사와 사역**
- 교회 일정 관리 (CRUD)
- 월간 달력 기반 일정 표시
- 교회 행사 분류 및 관리
- 기존 묵상 달력과 분리된 독립 시스템

### 🔍 **검색 기능**
- 묵상 내용 전체 검색
- 실시간 검색 결과 표시
- 최근 묵상 기록 조회

## 🛠️ 기술 스택

### **Frontend**
- **HTML5**: 시맨틱 마크업
- **CSS3**: 반응형 디자인, CSS Grid/Flexbox
- **Vanilla JavaScript (ES6+)**: 모듈화된 구조
- **Font Awesome**: 아이콘 시스템

### **Architecture**
- **모듈화 설계**: ES6 Modules
- **MVC 패턴**: Model-View-Controller 구조
- **컴포넌트 기반**: 재사용 가능한 UI 컴포넌트
- **이벤트 위임**: 성능 최적화된 이벤트 처리

### **Data Management**
- **LocalStorage**: 클라이언트 사이드 데이터 저장
- **JSON**: 데이터 직렬화
- **데이터 검증**: 입력 데이터 유효성 검사

### **Performance**
- **DocumentFragment**: DOM 조작 최적화
- **Debounce/Throttle**: 이벤트 처리 최적화
- **Lazy Loading**: 필요시 데이터 로딩
- **GPU 가속**: CSS transform 최적화

## 📁 프로젝트 구조

```
bible-meditation-apps/
├── app/
│   ├── components/          # UI 컴포넌트
│   │   ├── Calendar.js      # 묵상 달력 컴포넌트
│   │   └── ChurchEventCalendar.js  # 교회 일정 달력
│   ├── data/
│   │   └── bibleData.js     # 성경 구조 데이터
│   ├── lib/                 # 유틸리티 라이브러리
│   │   ├── utils.js         # 공통 유틸리티 함수
│   │   ├── notification.js  # 알림 시스템
│   │   └── performance.js   # 성능 최적화
│   ├── models/              # 데이터 모델
│   │   ├── MeditationModel.js      # 묵상 데이터 관리
│   │   ├── PrayerModel.js          # 기도 데이터 관리
│   │   ├── RepresentativePrayerModel.js  # 대표 기도 관리
│   │   ├── ChurchEventModel.js     # 교회 일정 관리
│   │   ├── DoctrineModel.js        # 교리 데이터 관리
│   │   └── ProphecyModel.js        # 예언 데이터 관리
│   └── App.js               # 메인 애플리케이션 클래스
├── public/                  # 정적 파일
│   └── logo.svg
├── index.html               # 메인 HTML 파일
├── script-new.js            # 애플리케이션 진입점
├── styles.css               # 메인 스타일시트
├── package.json             # 프로젝트 설정
└── README.md               # 프로젝트 문서
```

## 🚀 설치 및 실행

### **사전 요구사항**
- Node.js 14.0 이상
- npm 또는 yarn

### **설치**
```bash
# 저장소 클론
git clone [repository-url]
cd bible-meditation-apps

# 의존성 설치
npm install
```

### **실행**
```bash
# 개발 서버 시작
npm start

# 또는 다른 방법들
npm run dev      # http-server 사용
npm run serve    # Python HTTP 서버 사용
```

### **접속**
브라우저에서 `http://localhost:5001` 접속

## 📱 사용법

### **1. 묵상 작성**
1. **묵상 달력** 메뉴 클릭
2. 원하는 날짜 클릭
3. 성경 목록에서 책 선택
4. 묵상 내용 작성 (포착하기, 적용하기, 기도하기)
5. 저장

### **2. 기도 관리**
1. **기도** 메뉴 클릭
2. 탭 선택 (묵상 기도/중보 기도/대표 기도)
3. 새 기도 작성 또는 기존 기도 편집
4. 기도 응답 상태 관리

### **3. 교리 학습**
1. **교리** 메뉴 클릭
2. **28 기본교리** 탭에서 교리 학습
3. **예언의 신** 탭에서 예언 글 작성
4. 교리/예언에서 묵상 기도 연결

### **4. 교회 일정 관리**
1. **교회 행사와 사역** 메뉴 클릭
2. 달력에서 날짜 선택
3. 교회 일정 작성/편집
4. 일정 목록에서 관리

## 🔧 개발 가이드

### **새 기능 추가**
1. `app/models/`에 데이터 모델 생성
2. `app/components/`에 UI 컴포넌트 생성
3. `app/App.js`에 뷰 및 이벤트 핸들러 추가
4. `script-new.js`에 전역 이벤트 핸들러 추가
5. `styles.css`에 스타일 추가

### **코딩 컨벤션**
- **ES6+ 문법** 사용
- **모듈화** 구조 유지
- **이벤트 위임** 패턴 사용
- **반응형 디자인** 적용
- **접근성** 고려

### **성능 최적화**
- **DocumentFragment** 사용
- **이벤트 위임** 적용
- **Debounce/Throttle** 구현
- **Lazy Loading** 적용
- **CSS 최적화** (GPU 가속)

## 🛡️ 보안

### **클라이언트 사이드 보안**
- **XSS 방지**: `Utils.escapeHtml()` 사용
- **입력 검증**: 모든 사용자 입력 검증
- **데이터 검증**: JSON 파싱 안전성 확보

### **데이터 보호**
- **LocalStorage**: 브라우저 내 데이터 저장
- **데이터 백업**: JSON 형태로 내보내기/가져오기
- **데이터 무결성**: 저장 전 검증

## 📊 프로젝트 통계

- **총 코드 라인**: 4,177줄
- **JavaScript 파일**: 13개
- **CSS 파일**: 1개
- **HTML 파일**: 9개
- **보안 취약점**: 0개

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**개발자**: 성경 묵상 일기 개발팀  
**버전**: 2.0.0  
**최종 업데이트**: 2024년 12월
