import { Utils } from './lib/utils.js';
import { notificationManager } from './lib/notification.js';
import { MeditationModel } from './models/MeditationModel.js';
import { PrayerModel } from './models/PrayerModel.js';
import { RepresentativePrayerModel } from './models/RepresentativePrayerModel.js';
import { ChurchEventModel } from './models/ChurchEventModel.js';
import { Calendar } from './components/Calendar.js';
import { ChurchEventCalendar } from './components/ChurchEventCalendar.js';
import { generateBibleListHTML } from './data/bibleData.js';
import { DoctrineModel } from './models/DoctrineModel.js';
import { ProphecyModel } from './models/ProphecyModel.js';

export class BibleMeditationApp {
  constructor() {
    this.currentView = 'home';
    this.meditationModel = new MeditationModel();
    this.meditationPrayerModel = new PrayerModel('meditation');
    this.intercessoryPrayerModel = new PrayerModel('intercessory');
    this.representativePrayerModel = new RepresentativePrayerModel();
    this.churchEventModel = new ChurchEventModel();
    this.doctrineModel = new DoctrineModel();
    this.prophecyModel = new ProphecyModel();
    this.calendar = null;
    this.churchCalendar = null;
    this.currentMeditation = null;
    this.currentPrayerTab = 'meditation'; // 기본 탭
    this.currentDoctrineTab = 'doctrines'; // 기본 탭

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.showHomeView();

    // 초기 활성 상태 설정
    const homeLink = document.querySelector('.nav-link[data-view="home"]');
    if (homeLink) {
      homeLink.classList.add('active');
    }
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    // 네비게이션 이벤트는 script-new.js에서 처리됨
    console.log('App.js 이벤트 리스너 설정 완료');

    // 묵상 폼 제출
    const meditationForm = document.getElementById('meditationForm');
    if (meditationForm) {
      meditationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleMeditationSubmit(event);
      });
    }

    // 교회 이벤트 폼 제출
    const churchEventForm = document.getElementById('churchEventForm');
    if (churchEventForm) {
      churchEventForm.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleChurchEventSubmit(event);
      });
    }

    // 폼 닫기 버튼
    Utils.delegateEvent(document.body, '.btn-close', 'click', () => {
      this.closeMeditationForm();
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeMeditationForm();
        this.closePrayerForm();
      }
    });
  }

  // 뷰 네비게이션
  navigateToView(view, event) {
    if (!view) return;

    console.log('navigateToView 호출됨:', view);

    // 네비게이션 활성화 상태 업데이트
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // 클릭된 링크에 active 클래스 추가
    if (event && event.currentTarget) {
      event.currentTarget.classList.add('active');
    }

    this.currentView = view;

    switch (view) {
      case 'home':
        console.log('홈 뷰로 이동');
        this.showHomeView();
        break;
      case 'calendar':
        console.log('달력 뷰로 이동');
        this.showCalendarView();
        break;
      case 'bible-list':
        console.log('성경 목록 뷰로 이동');
        this.showBibleListView();
        break;
      case 'prayer':
        console.log('기도 뷰로 이동');
        this.showPrayerView();
        break;
      case 'search':
        console.log('검색 뷰로 이동');
        this.showSearchView();
        break;
      case 'church-events':
        console.log('교회 행사와 사역 뷰로 이동');
        this.showChurchEventsView();
        break;
      case 'doctrine':
        console.log('교리 뷰로 이동');
        this.showDoctrineView();
        break;
      default:
        console.log('알 수 없는 뷰:', view);
    }
  }

  // 홈 뷰 표시
  showHomeView() {
    console.log('showHomeView 실행됨');
    const container = document.querySelector('.meditation-container');
    const calendar = document.querySelector('.calendar');

    if (calendar) calendar.style.display = 'none';

    container.innerHTML = this.getHomeViewHTML();
    this.attachHomeViewEvents();
    console.log('홈 뷰 표시 완료');
  }

  // 묵상 달력 뷰 표시
  showCalendarView() {
    const container = document.querySelector('.meditation-container');
    const calendarContainer = document.querySelector('.calendar');

    // 기존 교회 캘린더 숨기기
    if (this.churchCalendar) {
      this.churchCalendar.destroy();
      this.churchCalendar = null;
    }

    container.innerHTML = `
      <div class="meditation-calendar-container">
        <div class="meditation-calendar-header">
          <h2>📖 묵상 달력</h2>
          <p class="meditation-calendar-description">
            날짜를 클릭하면 해당 날짜의 묵상을 바로 작성할 수 있습니다.
          </p>
        </div>
        <div class="meditation-calendar-actions">
          <button class="btn-new-meditation" onclick="handleHomeAction('new-meditation')">
            <i class="fas fa-plus"></i> 새 묵상 작성
          </button>
        </div>
        <div class="meditation-list-section">
          <h3>📝 등록된 묵상 목록</h3>
          <div class="meditation-list" id="calendarMeditationList">
            ${this.getCalendarMeditationListHTML()}
          </div>
        </div>
      </div>
    `;
    calendarContainer.style.display = 'grid';

    // Calendar 인스턴스 생성 또는 업데이트
    if (!this.calendar) {
      this.calendar = new Calendar(calendarContainer, {
        onDateSelect: (date) => {
          console.log('묵상 달력 날짜 클릭:', date);
          // 날짜 클릭 시 해당 날짜의 묵상 폼 바로 표시 (새 묵상 작성과 동일)
          this.showMeditationForm(date);
        },
        onMonthChange: () => this.updateCalendarMeditations()
      });
    }

    this.updateCalendarMeditations();
  }

  // 성경 목록 뷰 표시
  showBibleListView() {
    const container = document.querySelector('.meditation-container');
    const calendar = document.querySelector('.calendar');

    if (calendar) calendar.style.display = 'none';

    container.innerHTML = this.getBibleListViewHTML();
    this.attachBibleListEvents();
  }

  // 성경별 상세 뷰 표시
  showBibleDetailView(bookName) {
    const container = document.querySelector('.meditation-container');
    container.innerHTML = this.getBibleDetailViewHTML(bookName);
    this.currentView = 'bible-detail';
    this.attachBibleDetailEvents();
  }

  // 성경별 묵상 관리 페이지 HTML 생성
  getBibleDetailViewHTML(bookName) {
    const meditations = this.meditationModel.getByBook(bookName);
    const totalMeditations = meditations.length;

    // 통계 계산
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // 이번 달 묵상 수
    const monthlyMeditations = meditations.filter(m => {
      const meditationDate = new Date(m.date);
      return meditationDate.getMonth() === thisMonth && meditationDate.getFullYear() === thisYear;
    }).length;

    // 최근 7일 묵상 수
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recent7Days = meditations.filter(m => {
      const meditationDate = new Date(m.date);
      return meditationDate >= sevenDaysAgo;
    }).length;

    // 월평균 계산 (최근 3개월 기준)
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const recent3Months = meditations.filter(m => {
      const meditationDate = new Date(m.date);
      return meditationDate >= threeMonthsAgo;
    });
    const monthlyAverage = recent3Months.length > 0 ? Math.round(recent3Months.length / 3) : 0;

    return `
      <div class="bible-detail-container">
        <div class="bible-detail-header">
          <button class="btn-back" onclick="handleBibleDetailBack()">
            <i class="fas fa-arrow-left"></i> 성경 목록으로
          </button>
          <div class="bible-detail-title">
            <div class="book-icon">📖</div>
            <h1>${bookName}</h1>
            <p class="bible-detail-subtitle">묵상과 말씀을 나누는 공간</p>
          </div>
          <button class="btn-new-meditation-primary" onclick="handleBibleMeditation('${bookName}')">
            <i class="fas fa-plus"></i> 새 묵상 작성
          </button>
        </div>

        <div class="bible-stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <div class="stat-number">${totalMeditations}</div>
                <div class="stat-label">총 묵상</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-content">
                <div class="stat-number">${monthlyMeditations}</div>
                <div class="stat-label">이번 달</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔥</div>
              <div class="stat-content">
                <div class="stat-number">${recent7Days}</div>
                <div class="stat-label">최근 7일</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-content">
                <div class="stat-number">${monthlyAverage}</div>
                <div class="stat-label">월평균</div>
              </div>
            </div>
          </div>
        </div>

        <div class="meditation-list-section">
          <div class="meditation-list-header">
            <h3>≡ 묵상 목록</h3>
            <div class="meditation-sort">
              <select class="sort-select">
                <option value="newest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="title">제목순</option>
              </select>
            </div>
          </div>
          
          <div class="meditation-list-content">
            ${this.getMeditationListContentHTML(meditations, bookName)}
          </div>
        </div>
      </div>
    `;
  }

  // 묵상 목록 내용 HTML 생성
  getMeditationListContentHTML(meditations, bookName) {
    if (meditations.length === 0) {
      return `
        <div class="empty-meditation-state">
          <div class="empty-illustration">
            <div class="paper-icon">📄</div>
            <div class="pencil-icon">✏️</div>
          </div>
          <h4>아직 묵상이 없습니다</h4>
          <p>${bookName}에 대한 첫 번째 묵상을 작성해보세요!</p>
          <button class="btn-first-meditation" onclick="handleBibleMeditation('${bookName}')">
            <i class="fas fa-plus"></i> 첫 묵상 작성하기
          </button>
        </div>
      `;
    }

    return `
      <div class="meditation-items">
        ${meditations.map(meditation => `
          <div class="meditation-item" onclick="handleMeditationEdit(${meditation.id})">
            <div class="meditation-item-header">
              <div class="meditation-date">
                <i class="fas fa-calendar"></i>
                ${this.formatDate(meditation.date)}
              </div>
              <div class="meditation-actions">
                <button class="btn-edit" onclick="event.stopPropagation(); handleMeditationEdit(${meditation.id})">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="event.stopPropagation(); handleMeditationDelete(${meditation.id})">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="meditation-item-content">
              <h4 class="meditation-title">${meditation.title || '제목 없음'}</h4>
              <p class="meditation-reference">${meditation.bibleReference || '성경 구절 없음'}</p>
              <p class="meditation-summary">${meditation.capture ? meditation.capture.substring(0, 100) + (meditation.capture.length > 100 ? '...' : '') : '내용 없음'}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 최근 묵상 목록 HTML 생성
  getRecentMeditationsHTML(meditations, bookName) {
    if (meditations.length === 0) {
      return `
        <div class="no-meditations">
          <div class="no-meditations-icon">📖</div>
          <h4>아직 ${bookName}에 대한 묵상이 없습니다</h4>
          <p>첫 번째 묵상을 작성해보세요!</p>
          <button class="btn-new-meditation" onclick="handleBibleMeditation('${bookName}')">
            <i class="fas fa-plus"></i> 새 묵상 작성
          </button>
        </div>
      `;
    }

    return `
      <div class="recent-meditations-list">
        ${meditations.map(meditation => `
          <div class="meditation-card" onclick="handleMeditationEdit(${meditation.id})">
            <div class="meditation-card-header">
              <div class="meditation-date">
                <i class="fas fa-calendar"></i>
                ${this.formatDate(meditation.date)}
              </div>
              <div class="meditation-actions">
                <button class="btn-edit" onclick="event.stopPropagation(); handleMeditationEdit(${meditation.id})">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="event.stopPropagation(); handleMeditationDelete(${meditation.id})">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="meditation-card-content">
              <h4 class="meditation-title">${meditation.title || '제목 없음'}</h4>
              <p class="meditation-reference">${meditation.reference || '성경 구절 없음'}</p>
              <p class="meditation-summary">${meditation.content.substring(0, 100)}${meditation.content.length > 100 ? '...' : ''}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 가장 많이 묵상한 구절 찾기
  getMostMeditatedVerse(meditations) {
    if (meditations.length === 0) return '아직 묵상이 없습니다';

    const verseCount = {};
    meditations.forEach(m => {
      if (m.reference) {
        verseCount[m.reference] = (verseCount[m.reference] || 0) + 1;
      }
    });

    const mostFrequent = Object.entries(verseCount)
      .sort(([, a], [, b]) => b - a)[0];

    return mostFrequent ? mostFrequent[0] : '성경 구절 정보 없음';
  }

  // 묵상 패턴 분석
  getMeditationPattern(meditations) {
    if (meditations.length === 0) return '아직 묵상이 없습니다';

    const monthlyCounts = {};
    meditations.forEach(m => {
      const date = new Date(m.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    });

    const recentMonths = Object.entries(monthlyCounts)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 3);

    if (recentMonths.length === 0) return '패턴 분석 불가';

    const avgPerMonth = recentMonths.reduce((sum, [, count]) => sum + count, 0) / recentMonths.length;
    return `월 평균 ${Math.round(avgPerMonth)}회 묵상`;
  }

  // 날짜 포맷팅
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // 검색 뷰 표시
  showSearchView() {
    const container = document.querySelector('.meditation-container');
    const calendar = document.querySelector('.calendar');

    if (calendar) calendar.style.display = 'none';

    container.innerHTML = this.getSearchViewHTML();
    this.attachSearchViewEvents();
    this.displayRecentMeditations();
  }

  // 통합 기도 뷰 표시
  showPrayerView() {
    const container = document.querySelector('.meditation-container');
    const calendar = document.querySelector('.calendar');

    if (calendar) calendar.style.display = 'none';

    container.innerHTML = this.getUnifiedPrayerViewHTML();
    this.attachUnifiedPrayerViewEvents();
    this.showPrayerTab(this.currentPrayerTab);
  }

  // 통합 기도 뷰 이벤트 연결
  attachUnifiedPrayerViewEvents() {
    // 모달 외부 클릭시 닫기
    const modal = document.querySelector('.prayer-modal');
    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          this.closePrayerForm();
        }
      });
    }

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const modal = document.querySelector('.prayer-modal');
        if (modal && modal.style.display === 'flex') {
          this.closePrayerForm();
        }
      }
    });
  }

  // 기도 탭 전환
  showPrayerTab(tabName) {
    this.currentPrayerTab = tabName;

    // 탭 버튼 활성화 상태 업데이트
    document.querySelectorAll('.prayer-tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // 탭 내용 업데이트
    const tabContent = document.getElementById('prayerTabContent');
    if (!tabContent) return;

    let prayers = [];
    let title = '';
    let description = '';

    switch (tabName) {
      case 'meditation':
        prayers = this.meditationPrayerModel.getAll();
        title = '묵상 기도';
        description = '성경 말씀을 통해 깨달은 것을 기도로 표현합니다.';
        break;
      case 'intercessory':
        prayers = this.intercessoryPrayerModel.getAll();
        title = '중보 기도';
        description = '다른 사람을 위해 드리는 기도입니다.';
        break;
      case 'representative':
        prayers = this.representativePrayerModel.getAll();
        title = '대표 기도';
        description = '교회 예배와 사역을 위한 대표 기도입니다.';
        break;
    }

    tabContent.innerHTML = this.getPrayerTabContentHTML(tabName, prayers, title, description);
    this.attachPrayerTabEvents(tabName);
  }

  // 교회 행사와 사역 뷰 표시
  showChurchEventsView() {
    const container = document.querySelector('.meditation-container');
    const calendarContainer = document.querySelector('.calendar');

    // 기존 묵상 캘린더 숨기기
    if (this.calendar) {
      this.calendar.destroy();
      this.calendar = null;
    }

    container.innerHTML = this.getChurchEventsViewHTML();
    calendarContainer.style.display = 'grid';
    calendarContainer.className = 'calendar'; // 기존 달력 스타일 적용

    // ChurchEventCalendar 인스턴스 생성 또는 업데이트
    if (!this.churchCalendar) {
      this.churchCalendar = new ChurchEventCalendar(calendarContainer, {
        onDateSelect: (date) => {
          console.log('교회 달력 날짜 클릭:', date);
          this.showChurchEventForm(date);
        },
        onMonthChange: () => this.updateChurchCalendarEvents()
      });
    }

    this.updateChurchCalendarEvents();
  }

  // 교리 뷰 표시
  showDoctrineView() {
    const container = document.querySelector('.meditation-container');
    const calendar = document.querySelector('.calendar');

    if (calendar) calendar.style.display = 'none';

    container.innerHTML = this.getDoctrineViewHTML();
    this.showDoctrineTab(this.currentDoctrineTab);
  }

  // 교리 탭 전환
  showDoctrineTab(tabName) {
    this.currentDoctrineTab = tabName;

    // 탭 버튼 활성화 상태 업데이트
    document.querySelectorAll('.doctrine-tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // 탭 내용 업데이트
    const tabContent = document.getElementById('doctrineTabContent');
    if (!tabContent) return;

    switch (tabName) {
      case 'doctrines':
        tabContent.innerHTML = this.getDoctrinesTabHTML();
        break;
      case 'prophecy':
        tabContent.innerHTML = this.getProphecyTabHTML();
        break;
    }
  }

  // 묵상 폼 표시
  showMeditationForm(date = null, bookName = null, doctrineId = null, prophecyId = null, meditationId = null) {
    const modal = document.querySelector('.meditation-modal');
    if (!modal) return;

    modal.style.display = 'flex';

    // 기존 묵상 편집인 경우
    if (meditationId) {
      const meditation = this.meditationModel.getById(meditationId);
      if (meditation) {
        document.getElementById('meditationDate').value = meditation.date;
        this.populateMeditationForm(meditation);
        // 숨겨진 필드에 ID 저장
        const hiddenIdField = document.getElementById('meditationId');
        if (hiddenIdField) {
          hiddenIdField.value = meditationId;
        }
        return;
      }
    }

    if (date) {
      document.getElementById('meditationDate').value = date;

      // 기존 데이터 불러오기
      const existingMeditation = this.meditationModel.getByDate(date);
      if (existingMeditation) {
        this.populateMeditationForm(existingMeditation);
      } else {
        this.clearMeditationForm();
      }
    } else {
      document.getElementById('meditationDate').value = Utils.formatDate(new Date());
      this.clearMeditationForm();
    }

    if (bookName) {
      document.getElementById('bibleReference').value = bookName;
    }

    // 숨겨진 필드 초기화
    const hiddenIdField = document.getElementById('meditationId');
    if (hiddenIdField) {
      hiddenIdField.value = '';
    }
  }

  // 묵상 폼 닫기
  closeMeditationForm() {
    const modal = document.querySelector('.meditation-modal');
    if (modal) {
      modal.style.display = 'none';
      this.clearMeditationForm();
    }
  }

  // 묵상 폼 데이터 채우기
  populateMeditationForm(meditation) {
    document.getElementById('bibleReference').value = meditation.bibleReference || '';
    document.getElementById('title').value = meditation.title || '';
    document.getElementById('capture').value = meditation.capture || '';
    document.getElementById('organize').value = meditation.organize || '';
    document.getElementById('distill').value = meditation.distill || '';
    document.getElementById('express').value = meditation.express || '';
  }

  // 묵상 폼 초기화
  clearMeditationForm() {
    const form = document.getElementById('meditationForm');
    if (form) form.reset();
  }

  // 묵상 제출 처리
  handleMeditationSubmit(event) {
    const formData = new FormData(event.target);
    const meditationId = formData.get('meditationId');

    const meditationData = {
      date: formData.get('date'),
      bibleReference: formData.get('bibleReference'),
      title: formData.get('title'),
      capture: formData.get('capture'),
      organize: formData.get('organize'),
      distill: formData.get('distill'),
      express: formData.get('express')
    };

    let success = false;

    if (meditationId) {
      // 기존 묵상 수정
      success = this.meditationModel.updateMeditation(parseInt(meditationId), meditationData);
    } else {
      // 새 묵상 저장
      success = this.meditationModel.saveMeditation(meditationData);
    }

    if (success) {
      this.closeMeditationForm();

      // 달력 업데이트
      if (this.calendar) {
        this.updateCalendarMeditations();
      }

      // 현재 뷰 새로고침
      this.refreshCurrentView();
    }
  }

  // 묵상 액션 처리 (수정/삭제)
  handleMeditationAction(action, meditationId) {
    const meditation = this.meditationModel.getById(meditationId);
    if (!meditation) {
      notificationManager.error('묵상을 찾을 수 없습니다.');
      return;
    }

    switch (action) {
      case 'edit':
        this.showMeditationForm(meditation.date, null, null, null, meditationId);
        break;
      case 'delete':
        if (confirm('정말로 이 묵상을 삭제하시겠습니까?')) {
          if (this.meditationModel.deleteMeditationById(meditationId)) {
            // 달력 업데이트
            if (this.calendar) {
              this.updateCalendarMeditations();
            }
            // 현재 뷰 새로고침
            this.refreshCurrentView();
          }
        }
        break;
    }
  }

  // 달력 묵상 데이터 업데이트
  updateCalendarMeditations() {
    if (this.calendar) {
      const meditations = this.meditationModel.getAll();
      this.calendar.updateMeditations(meditations);
    }
  }

  // 교회 달력 이벤트 데이터 업데이트
  updateChurchCalendarEvents() {
    if (this.churchCalendar) {
      const events = this.churchEventModel.getAll();
      this.churchCalendar.updateEvents(events);
    }
  }

  // 현재 뷰 새로고침
  refreshCurrentView() {
    switch (this.currentView) {
      case 'calendar':
        this.showCalendarView();
        break;
      case 'bible-list':
        this.showBibleListView();
        break;
      case 'search':
        this.showSearchView();
        break;
      case 'meditation-prayer':
        this.showMeditationPrayerView();
        break;
      case 'intercessory-prayer':
        this.showIntercessoryPrayerView();
        break;
    }
  }

  // 검색 실행
  performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.trim();
    const results = this.meditationModel.search(query);
    this.displaySearchResults(results);
  }

  // 검색 결과 표시
  displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <p>검색 결과가 없습니다.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <h3>검색 결과 (${results.length}개)</h3>
      <div class="meditation-list">
        ${results.map(meditation => this.getMeditationListItemHTML(meditation)).join('')}
      </div>
    `;
  }

  // 최근 묵상 표시
  displayRecentMeditations() {
    const container = document.getElementById('recentMeditations');
    if (!container) return;

    const recentMeditations = this.meditationModel.getRecent(5);

    if (recentMeditations.length === 0) {
      container.innerHTML = `
        <div class="no-meditations">
          <p>아직 작성된 묵상이 없습니다.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <table class="recent-meditations-table">
        <thead>
          <tr>
            <th class="date-cell">날짜</th>
            <th class="bible-cell">성경 구절</th>
            <th class="title-cell">제목</th>
            <th class="preview-cell">내용 미리보기</th>
          </tr>
        </thead>
        <tbody>
          ${recentMeditations.map(meditation => this.getMeditationTableRowHTML(meditation)).join('')}
        </tbody>
      </table>
    `;
  }

  // HTML 템플릿 메서드들
  getHomeViewHTML() {
    return `
      <div class="home-container">
        <div class="welcome-section">
          <h2>📖 성경 CODE 묵상법</h2>
          <p class="welcome-text">
            말씀을 더 깊이 이해하고 삶에 적용하기 위한 체계적인 묵상 방법입니다.
          </p>
        </div>

        <div class="code-method-grid">
          <div class="code-card">
            <div class="code-header">
              <span class="code-emoji">📝</span>
              <h3>Capture<br>(포착하기)</h3>
            </div>
            <div class="code-content">
              <p>말씀을 읽으며 마음에 와닿는 구절이나 단어를 포착합니다.</p>
            </div>
          </div>

          <div class="code-card">
            <div class="code-header">
              <span class="code-emoji">🔍</span>
              <h3>Organize<br>(조직화하기)</h3>
            </div>
            <div class="code-content">
              <p>포착한 말씀의 문맥을 살피고, 관련 구절들을 연결하여 의미를 정리합니다.</p>
            </div>
          </div>

          <div class="code-card">
            <div class="code-header">
              <span class="code-emoji">💡</span>
              <h3>Distill<br>(압축하기)</h3>
            </div>
            <div class="code-content">
              <p>말씀을 통해 깨달은 핵심 진리를 한 문장으로 정리합니다.</p>
            </div>
          </div>

          <div class="code-card">
            <div class="code-header">
              <span class="code-emoji">🙏</span>
              <h3>Express<br>(표현하기)</h3>
            </div>
            <div class="code-content">
              <p>깨달은 진리를 기도로 표현하고, 구체적인 적용점을 찾습니다.</p>
            </div>
          </div>
        </div>

        <div class="action-section">
          <h3>🌟 지금 바로 시작해보세요!</h3>
          <div class="action-buttons">
                    <button class="action-btn calendar-btn" data-action="calendar" onclick="handleHomeAction('calendar')">
          <span>📅</span>
          <span>묵상 달력으로 시작하기</span>
        </button>
            <button class="action-btn bible-btn" data-action="bible-list" onclick="handleHomeAction('bible-list')">
              <span>📚</span>
              <span>성경으로 시작하기</span>
            </button>
            <button class="action-btn meditation-btn" data-action="new-meditation" onclick="handleHomeAction('new-meditation')">
              <span>✏️</span>
              <span>새 묵상 작성하기</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getBibleListViewHTML() {
    const meditations = this.meditationModel.getAll();
    return `
      <div class="bible-container">
        ${generateBibleListHTML(meditations)}
      </div>
    `;
  }

  getSearchViewHTML() {
    return `
      <div class="search-container">
        <div class="search-form">
          <input type="text" id="searchInput" placeholder="묵상 내용이나 성경 구절을 검색하세요..." onkeypress="handleSearchKeyPress(event)">
          <button id="searchBtn" onclick="handleSearch()">🔍 검색</button>
        </div>
        <div id="searchResults"></div>
        
        <div class="recent-meditations">
          <h3>📝 최근 묵상</h3>
          <div id="recentMeditations"></div>
        </div>
      </div>
    `;
  }

  // 교회 행사와 사역 뷰 HTML
  getChurchEventsViewHTML() {
    const events = this.churchEventModel.getAll();
    const stats = this.churchEventModel.getStats();

    return `
      <div class="church-events-container">
        <div class="church-events-header">
          <h2>⛪ 교회 행사와 사역</h2>
          <p class="church-events-description">
            교회의 다양한 행사와 사역 일정을 관리하고 기록하세요.
          </p>
        </div>
        
        <div class="church-events-stats">
          <div class="stat-item">
            <div class="stat-number">${stats.total}</div>
            <div class="stat-title">전체 일정</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${stats.thisMonth}</div>
            <div class="stat-title">이번 달</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${stats.upcoming}</div>
            <div class="stat-title">예정된 일정</div>
          </div>
        </div>
        
        <div class="church-events-actions">
          <button class="btn-new-event" onclick="handleChurchEventAction('new-event')">
            <i class="fas fa-plus"></i> 새 일정 작성
          </button>
        </div>
        
        <div class="church-events-list" id="churchEventsList">
          ${this.getChurchEventListHTML(events)}
        </div>
      </div>
    `;
  }

  // 통합된 기도 뷰 HTML
  getUnifiedPrayerViewHTML() {
    const meditationStats = this.meditationPrayerModel.getStats();
    const intercessoryStats = this.intercessoryPrayerModel.getStats();
    const representativeStats = this.representativePrayerModel.getStats();

    const totalStats = {
      total: meditationStats.total + intercessoryStats.total + representativeStats.total,
      ongoing: meditationStats.ongoing + intercessoryStats.ongoing + representativeStats.ongoing,
      answered: meditationStats.answered + intercessoryStats.answered + representativeStats.answered
    };

    return `
      <div class="prayer-container">
        <div class="prayer-header">
          <h2>🙏 기도</h2>
          <p class="prayer-description">
            개인 묵상, 중보 기도, 교회 대표 기도를 체계적으로 관리하고 기록하세요.
          </p>
        </div>
        
        <div class="prayer-stats">
          <div class="prayer-stat-item">
            <div class="stat-number">${totalStats.total}</div>
            <div class="stat-title">전체 기도</div>
          </div>
          <div class="prayer-stat-item">
            <div class="stat-number">${totalStats.ongoing}</div>
            <div class="stat-title">진행 중</div>
          </div>
          <div class="prayer-stat-item">
            <div class="stat-number">${totalStats.answered}</div>
            <div class="stat-title">답변됨</div>
          </div>
        </div>
        
        <div class="prayer-tabs">
          <button class="prayer-tab-btn active" data-tab="meditation" onclick="handlePrayerTabChange('meditation')">
            <i class="fas fa-book-open"></i> 묵상 기도
            <span class="tab-count">${meditationStats.total}</span>
          </button>
          <button class="prayer-tab-btn" data-tab="intercessory" onclick="handlePrayerTabChange('intercessory')">
            <i class="fas fa-hands"></i> 중보 기도
            <span class="tab-count">${intercessoryStats.total}</span>
          </button>
          <button class="prayer-tab-btn" data-tab="representative" onclick="handlePrayerTabChange('representative')">
            <i class="fas fa-church"></i> 대표 기도
            <span class="tab-count">${representativeStats.total}</span>
          </button>
        </div>
        
        <div id="prayerTabContent">
          <!-- 탭 내용이 여기에 동적으로 로드됩니다 -->
        </div>
      </div>
    `;
  }

  // 기도 탭 내용 HTML
  getPrayerTabContentHTML(tabName, prayers, title, description) {
    let stats;
    switch (tabName) {
      case 'meditation':
        stats = this.meditationPrayerModel.getStats();
        break;
      case 'intercessory':
        stats = this.intercessoryPrayerModel.getStats();
        break;
      case 'representative':
        stats = this.representativePrayerModel.getStats();
        break;
    }

    return `
      <div class="prayer-tab-content">
        <div class="prayer-tab-header">
          <h3>${title}</h3>
          <p class="prayer-tab-description">${description}</p>
        </div>
        
        <div class="prayer-tab-stats">
          <div class="prayer-stat-item">
            <div class="stat-number">${stats.total}</div>
            <div class="stat-title">전체</div>
          </div>
          <div class="prayer-stat-item">
            <div class="stat-number">${stats.ongoing}</div>
            <div class="stat-title">진행 중</div>
          </div>
          <div class="prayer-stat-item">
            <div class="stat-number">${stats.answered}</div>
            <div class="stat-title">답변됨</div>
          </div>
        </div>
        
        <div class="prayer-actions">
          <button class="btn-new-prayer" onclick="handlePrayerAction('new-prayer', '${tabName}')">
            <i class="fas fa-plus"></i> 새 기도 작성
          </button>
        </div>
        
        <div class="prayer-filters">
          <button class="filter-btn active" data-filter="all">전체</button>
          <button class="filter-btn" data-filter="ongoing">진행 중</button>
          <button class="filter-btn" data-filter="answered">답변됨</button>
        </div>
        
        <div class="prayer-items" id="prayerItems">
          ${this.getPrayerListHTML(prayers, tabName)}
        </div>
      </div>
    `;
  }

  getPrayerListHTML(prayers, type) {
    if (prayers.length === 0) {
      return `
        <div class="no-prayers">
          <p>아직 작성된 기도가 없습니다.</p>
          <button class="btn-new-prayer" data-action="new-prayer" data-type="${type}" onclick="handlePrayerAction('new-prayer', '${type}')">
            <i class="fas fa-plus"></i> 새 기도 작성하기
          </button>
        </div>
      `;
    }

    return prayers.map(prayer => `
      <div class="prayer-item ${prayer.answered ? 'prayer-answered' : ''}" data-id="${prayer.id}">
        <div class="prayer-item-header">
          <div class="prayer-item-title">
            <h4>${Utils.escapeHtml(prayer.title)}</h4>
            <div class="prayer-meta">
              ${type === 'intercessory' ? `<span class="prayer-target">🙏 ${Utils.escapeHtml(prayer.target)}</span>` : ''}
              <span class="prayer-date">📅 ${Utils.formatDate(prayer.createdAt)}</span>
              <span class="prayer-status ${prayer.answered ? 'answered' : 'ongoing'}">
                ${prayer.answered ? '✨ 응답됨' : '🙏 진행중'}
              </span>
            </div>
          </div>
          <div class="prayer-item-actions">
            <button class="btn-edit" data-action="edit-prayer" data-id="${prayer.id}" data-type="${type}" onclick="handlePrayerAction('edit-prayer', '${type}', ${prayer.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-delete" data-action="delete-prayer" data-id="${prayer.id}" data-type="${type}" onclick="handlePrayerAction('delete-prayer', '${type}', ${prayer.id})">
              <i class="fas fa-trash"></i>
            </button>
            <button class="btn-answer" data-action="toggle-prayer" data-id="${prayer.id}" data-type="${type}" onclick="handlePrayerAction('toggle-prayer', '${type}', ${prayer.id})">
              <i class="fas ${prayer.answered ? 'fa-times-circle' : 'fa-check-circle'}"></i>
            </button>
          </div>
        </div>
        <div class="prayer-item-content">
          ${Utils.escapeHtml(prayer.content)}
        </div>
      </div>
    `).join('');
  }

  getMeditationListItemHTML(meditation) {
    return `
      <div class="meditation-list-item" data-date="${meditation.date}" onclick="handleMeditationItemClick('${meditation.date}')">
        <div class="meditation-list-date">${Utils.formatDate(meditation.date)}</div>
        <div class="meditation-list-content">
          <div class="meditation-list-title">${Utils.escapeHtml(meditation.title)}</div>
          <div class="meditation-list-bible">📖 ${Utils.escapeHtml(meditation.bibleReference)}</div>
          <div class="meditation-list-preview">
            <strong>포착하기:</strong> ${Utils.truncateText(meditation.capture, 100)}
          </div>
        </div>
      </div>
    `;
  }

  getMeditationTableRowHTML(meditation) {
    return `
      <tr data-date="${meditation.date}" onclick="handleMeditationItemClick('${meditation.date}')" style="cursor: pointer;">
        <td class="date-cell">${Utils.formatDate(meditation.date)}</td>
        <td class="bible-cell">${Utils.escapeHtml(meditation.bibleReference)}</td>
        <td class="title-cell">${Utils.escapeHtml(meditation.title)}</td>
        <td class="preview-cell">${Utils.truncateText(meditation.capture, 50)}</td>
      </tr>
    `;
  }

  // 묵상 달력용 묵상 리스트 HTML 생성
  getCalendarMeditationListHTML() {
    const meditations = this.meditationModel.getAll();

    if (meditations.length === 0) {
      return '<div class="no-meditations">등록된 묵상이 없습니다.</div>';
    }

    // 최근 순으로 정렬
    const sortedMeditations = meditations.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 최대 10개만 표시
    const limitedMeditations = sortedMeditations.slice(0, 10);
    const totalCount = meditations.length;
    const displayedCount = limitedMeditations.length;

    let html = limitedMeditations.map(meditation => `
      <div class="meditation-item" data-id="${meditation.id}">
        <div class="meditation-header">
          <div class="meditation-date">${Utils.formatDate(meditation.date)}</div>
          <div class="meditation-actions">
            <button class="btn-edit" onclick="handleMeditationAction('edit', ${meditation.id})">
              <i class="fas fa-edit"></i> 수정
            </button>
            <button class="btn-delete" onclick="handleMeditationAction('delete', ${meditation.id})">
              <i class="fas fa-trash"></i> 삭제
            </button>
          </div>
        </div>
        <div class="meditation-content">
          <div class="meditation-title">${Utils.escapeHtml(meditation.title)}</div>
          <div class="meditation-reference">📖 ${Utils.escapeHtml(meditation.bibleReference)}</div>
          <div class="meditation-summary">${Utils.truncateText(meditation.capture, 100)}</div>
        </div>
      </div>
    `).join('');

    // 전체 개수 표시 및 더보기 안내
    if (totalCount > 10) {
      html += `
        <div class="meditation-list-footer">
          <div class="meditation-count-info">
            <span class="displayed-count">최근 ${displayedCount}개</span>
            <span class="total-count">전체 ${totalCount}개</span>
          </div>
          <div class="meditation-list-note">
            <i class="fas fa-info-circle"></i>
            더 많은 묵상을 보려면 '검색' 메뉴를 이용하세요.
          </div>
        </div>
      `;
    }

    return html;
  }

  // 교회 이벤트 목록 HTML
  getChurchEventListHTML(events) {
    if (events.length === 0) {
      return `
        <div class="no-events">
          <p>아직 등록된 교회 일정이 없습니다.</p>
          <button class="btn-new-event" onclick="handleChurchEventAction('new-event')">
            <i class="fas fa-plus"></i> 새 일정 작성하기
          </button>
        </div>
      `;
    }

    return events.map(event => `
      <div class="church-event-item" data-id="${event.id}">
        <div class="church-event-header">
          <div class="church-event-title">
            <h4>${Utils.escapeHtml(event.title)}</h4>
            <div class="church-event-meta">
              <span class="event-category">🏷️ ${Utils.escapeHtml(event.category)}</span>
              <span class="event-date">📅 ${Utils.formatDate(event.date)}</span>
              <span class="event-time">🕐 ${event.time || '시간 미정'}</span>
            </div>
          </div>
          <div class="church-event-actions">
            <button class="btn-edit" onclick="handleChurchEventAction('edit-event', ${event.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-delete" onclick="handleChurchEventAction('delete-event', ${event.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="church-event-content">
          <p>${Utils.escapeHtml(event.description || '설명 없음')}</p>
        </div>
      </div>
    `).join('');
  }

  // 교리 뷰 HTML 생성
  getDoctrineViewHTML() {
    return `
      <div class="doctrine-container">
        <div class="doctrine-header">
          <h1><i class="fas fa-book-open"></i> 교리</h1>
          <p>SDA(제칠일안식일예수재림교회)의 기본 교리를 학습하고 예언의 신을 기록하세요.</p>
        </div>

        <div class="doctrine-tabs">
          <button class="doctrine-tab-btn active" data-tab="doctrines" onclick="handleDoctrineTabChange('doctrines')">
            <i class="fas fa-list"></i> 28 기본교리
            <span class="tab-count">28</span>
          </button>
          <button class="doctrine-tab-btn" data-tab="prophecy" onclick="handleDoctrineTabChange('prophecy')">
            <i class="fas fa-eye"></i> 예언의 신
            <span class="tab-count">${this.prophecyModel.getAll().length}</span>
          </button>
        </div>

        <div id="doctrineTabContent" class="doctrine-tab-content">
          <!-- 탭 내용이 여기에 동적으로 로드됩니다 -->
        </div>
      </div>
    `;
  }

  // 28 기본교리 탭 HTML 생성
  getDoctrinesTabHTML() {
    const doctrines = this.doctrineModel.getAll();

    return `
      <div class="doctrines-tab">
        <div class="doctrines-header">
          <h2>📖 SDA 28개 기본교리</h2>
          <p>제칠일안식일예수재림교회의 핵심 교리를 분류별로 학습하세요.</p>
        </div>

        <div class="doctrines-list">
          ${doctrines.map(doctrine => {
      const hasUrl = this.doctrineModel.getDoctrineUrl(doctrine.id);
      return `
              <div class="doctrine-section">
                <div class="doctrine-category-line">
                  <span class="doctrine-category-title">${doctrine.category}</span>
                </div>
                <div class="doctrine-item-new">
                  <div class="doctrine-number-badge">${doctrine.order}</div>
                  <div class="doctrine-content-new">
                    <h4 class="doctrine-title-new">${doctrine.title}</h4>
                    <p class="doctrine-summary-new">${doctrine.content.substring(0, 200)}...</p>
                    <div class="doctrine-actions-new">
                      <button class="btn-detail-new ${hasUrl ? 'btn-detail-has-url' : ''}" onclick="handleDoctrineDetail(${doctrine.id}, event)">
                        <i class="fas fa-file-alt"></i> 상세 내용
                        ${hasUrl ? '<span class="url-indicator">✓</span>' : ''}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;
  }

  // 예언의 신 탭 HTML 생성
  getProphecyTabHTML() {
    const prophecies = this.prophecyModel.getAll();
    const stats = this.prophecyModel.getStats();

    return `
      <div class="prophecy-tab">
        <div class="prophecy-header">
          <h2>👁️ 예언의 신</h2>
          <p>예언과 관련된 글과 출처를 기록하고 관리하세요.</p>
          
          <div class="prophecy-stats">
            <div class="stat-item">
              <i class="fas fa-file-alt"></i>
              <span class="stat-number">${stats.total}</span>
              <span class="stat-label">총 글</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-folder"></i>
              <span class="stat-number">${stats.categories.length}</span>
              <span class="stat-label">카테고리</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-clock"></i>
              <span class="stat-number">${stats.recentCount}</span>
              <span class="stat-label">최근 7일</span>
            </div>
          </div>

          <button class="btn-new-prophecy" onclick="handleProphecyAction('new-prophecy')">
            <i class="fas fa-plus"></i> 새 글 작성
          </button>
        </div>

        <div class="prophecy-list" id="prophecyList">
          ${this.getProphecyListHTML(prophecies)}
        </div>
      </div>
    `;
  }

  // 예언 글 목록 HTML 생성
  getProphecyListHTML(prophecies) {
    if (!prophecies || prophecies.length === 0) {
      return `
        <div class="no-prophecies">
          <i class="fas fa-eye-slash"></i>
          <p>등록된 예언 글이 없습니다.</p>
          <button class="btn-new-prophecy" onclick="handleProphecyAction('new-prophecy')">
            <i class="fas fa-plus"></i> 첫 글 작성하기
          </button>
        </div>
      `;
    }

    return prophecies.map(prophecy => `
      <div class="prophecy-item" data-id="${prophecy.id}">
        <div class="prophecy-header">
          <h3 class="prophecy-title">${Utils.escapeHtml(prophecy.title)}</h3>
          <div class="prophecy-actions">
            <button class="btn-edit" onclick="handleProphecyAction('edit-prophecy', ${prophecy.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-delete" onclick="handleProphecyAction('delete-prophecy', ${prophecy.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="prophecy-meta">
          <span class="prophecy-author"><i class="fas fa-user"></i> ${Utils.escapeHtml(prophecy.author || '저자 미상')}</span>
          <span class="prophecy-category"><i class="fas fa-tag"></i> ${prophecy.category}</span>
          <span class="prophecy-date"><i class="fas fa-calendar"></i> ${Utils.formatDate(new Date(prophecy.createdAt))}</span>
        </div>
        <div class="prophecy-content">
          <p>${Utils.escapeHtml(prophecy.content.substring(0, 200))}${prophecy.content.length > 200 ? '...' : ''}</p>
        </div>
        <div class="prophecy-source">
          <strong>출처:</strong> ${Utils.escapeHtml(prophecy.source)}
        </div>
        ${prophecy.tags && prophecy.tags.length > 0 ? `
          <div class="prophecy-tags">
            ${prophecy.tags.map(tag => `<span class="tag">${Utils.escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
        <div class="prophecy-actions-bottom">
          <button class="btn-meditation" onclick="handleProphecyMeditation(${prophecy.id})">
            <i class="fas fa-pen"></i> 묵상하기
          </button>
          <button class="btn-prayer" onclick="handleProphecyPrayer(${prophecy.id})">
            <i class="fas fa-pray"></i> 기도하기
          </button>
        </div>
      </div>
    `).join('');
  }

  // 이벤트 리스너 메서드들
  attachHomeViewEvents() {
    Utils.delegateEvent(document.body, '.action-btn', 'click', (event) => {
      const action = event.currentTarget.dataset.action;
      this.handleHomeAction(action);
    });
  }

  attachBibleListEvents() {
    // 성경 목록 이벤트
    Utils.delegateEvent(document.body, '.bible-book', 'click', (event) => {
      const bookName = event.currentTarget.dataset.book;
      console.log('성경 책 클릭됨:', bookName);
      this.showMeditationForm(null, bookName);
    });
  }

  attachSearchViewEvents() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.performSearch());
    }

    if (searchInput) {
      searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          this.performSearch();
        }
      });
    }

    // 검색 결과 클릭 이벤트
    Utils.delegateEvent(document.body, '.meditation-list-item', 'click', (event) => {
      const date = event.currentTarget.dataset.date;
      this.showMeditationForm(date);
    });
  }

  attachPrayerViewEvents(type) {
    Utils.delegateEvent(document.body, '[data-action="new-prayer"]', 'click', (event) => {
      const prayerType = event.currentTarget.dataset.type;
      this.showPrayerForm(prayerType);
    });

    Utils.delegateEvent(document.body, '[data-action="edit-prayer"]', 'click', (event) => {
      const id = parseInt(event.currentTarget.dataset.id);
      const prayerType = event.currentTarget.dataset.type;
      this.editPrayer(id, prayerType);
    });

    Utils.delegateEvent(document.body, '[data-action="delete-prayer"]', 'click', (event) => {
      const id = parseInt(event.currentTarget.dataset.id);
      const prayerType = event.currentTarget.dataset.type;
      this.deletePrayer(id, prayerType);
    });

    Utils.delegateEvent(document.body, '[data-action="toggle-prayer"]', 'click', (event) => {
      const id = parseInt(event.currentTarget.dataset.id);
      const prayerType = event.currentTarget.dataset.type;
      this.togglePrayerAnswered(id, prayerType);
    });
  }

  // 기도 탭 이벤트 연결
  attachPrayerTabEvents(tabName) {
    // 필터 버튼 이벤트
    Utils.delegateEvent(document, '.filter-btn', 'click', (event) => {
      const filter = event.currentTarget.dataset.filter;
      this.filterPrayers(filter, tabName);
    });
  }

  // 기도 필터링
  filterPrayers(filter, tabName) {
    // 필터 버튼 활성화 상태 업데이트
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // 기도 목록 필터링
    let prayers = [];
    switch (tabName) {
      case 'meditation':
        prayers = this.meditationPrayerModel.getAll();
        break;
      case 'intercessory':
        prayers = this.intercessoryPrayerModel.getAll();
        break;
      case 'representative':
        prayers = this.representativePrayerModel.getAll();
        break;
    }

    let filteredPrayers = [];
    switch (filter) {
      case 'all':
        filteredPrayers = prayers;
        break;
      case 'ongoing':
        filteredPrayers = prayers.filter(prayer => !prayer.answered);
        break;
      case 'answered':
        filteredPrayers = prayers.filter(prayer => prayer.answered);
        break;
    }

    // 필터링된 기도 목록 표시
    const prayerItems = document.getElementById('prayerItems');
    if (prayerItems) {
      prayerItems.innerHTML = this.getPrayerListHTML(filteredPrayers, tabName);
    }
  }

  // 액션 핸들러들
  handleHomeAction(action) {
    console.log('홈 액션 실행:', action);
    switch (action) {
      case 'calendar':
        this.navigateToView('calendar');
        break;
      case 'bible-list':
        this.navigateToView('bible-list');
        break;
      case 'new-meditation':
        this.showMeditationForm();
        break;
      default:
        console.log('알 수 없는 액션:', action);
    }
  }

  // 기도 관련 메서드들
  showPrayerForm(type) {
    const modal = document.querySelector('.prayer-modal');
    if (!modal) return;

    modal.style.display = 'flex';

    // 폼 제목 설정
    const formTitle = modal.querySelector('.prayer-form h2');
    if (formTitle) {
      switch (type) {
        case 'meditation':
          formTitle.textContent = '🙏 묵상 기도 작성';
          break;
        case 'intercessory':
          formTitle.textContent = '🤲 중보 기도 작성';
          break;
        case 'representative':
          formTitle.textContent = '⛪ 대표 기도 작성';
          break;
      }
    }

    // 대표 기도인 경우 중보 기도 대상 필드 숨기기
    const targetField = modal.querySelector('.prayer-target-field');
    if (targetField) {
      targetField.style.display = type === 'intercessory' ? 'block' : 'none';
    }

    // 카테고리 옵션 설정
    const categorySelect = modal.querySelector('#prayerCategory');
    if (categorySelect) {
      categorySelect.innerHTML = this.getPrayerCategoryOptions(type);
    }
  }

  // 기도 카테고리 옵션 생성
  getPrayerCategoryOptions(type) {
    const commonOptions = '<option value="">카테고리를 선택하세요</option>';

    switch (type) {
      case 'meditation':
        return commonOptions + `
          <option value="감사">감사</option>
          <option value="회개">회개</option>
          <option value="간구">간구</option>
          <option value="찬양">찬양</option>
          <option value="기도">기도</option>
        `;
      case 'intercessory':
        return commonOptions + `
          <option value="가족">가족</option>
          <option value="친구">친구</option>
          <option value="교회">교회</option>
          <option value="선교">선교</option>
          <option value="치유">치유</option>
          <option value="구원">구원</option>
        `;
      case 'representative':
        return commonOptions + `
          <option value="삼일예배">삼일예배</option>
          <option value="안식일환영교과공부예배">안식일환영교과공부예배</option>
          <option value="안식일예배">안식일예배</option>
          <option value="선교사역">선교사역</option>
          <option value="교회봉사">교회봉사</option>
        `;
      default:
        return commonOptions;
    }
  }

  editPrayer(id, type) {
    let prayer;
    switch (type) {
      case 'meditation':
        prayer = this.meditationPrayerModel.getById(id);
        break;
      case 'intercessory':
        prayer = this.intercessoryPrayerModel.getById(id);
        break;
      case 'representative':
        prayer = this.representativePrayerModel.getById(id);
        break;
    }

    if (prayer) {
      this.showPrayerForm(type);
      this.populatePrayerForm(prayer, type);
    }
  }

  deletePrayer(id, type) {
    if (!confirm('이 기도를 삭제하시겠습니까?')) return;

    let success = false;
    switch (type) {
      case 'meditation':
        success = this.meditationPrayerModel.deletePrayer(id);
        break;
      case 'intercessory':
        success = this.intercessoryPrayerModel.deletePrayer(id);
        break;
      case 'representative':
        success = this.representativePrayerModel.deletePrayer(id);
        break;
    }

    if (success) {
      this.refreshCurrentView();
    }
  }

  togglePrayerAnswered(id, type) {
    let success = false;
    switch (type) {
      case 'meditation':
        success = this.meditationPrayerModel.toggleAnswered(id);
        break;
      case 'intercessory':
        success = this.intercessoryPrayerModel.toggleAnswered(id);
        break;
      case 'representative':
        success = this.representativePrayerModel.toggleAnswered(id);
        break;
    }

    if (success) {
      this.refreshCurrentView();
    }
  }

  // 기도 폼 제출 처리
  handlePrayerSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const prayerData = {
      title: formData.get('title'),
      content: formData.get('content'),
      category: formData.get('category'),
      target: formData.get('target') || null
    };

    // 기존 기도 수정인지 확인
    const prayerId = formData.get('prayerId');
    if (prayerId) {
      prayerData.id = parseInt(prayerId);
    }

    // 현재 활성 탭에 따라 적절한 모델에 저장
    let success = false;
    switch (this.currentPrayerTab) {
      case 'meditation':
        success = this.meditationPrayerModel.savePrayer(prayerData);
        break;
      case 'intercessory':
        success = this.intercessoryPrayerModel.savePrayer(prayerData);
        break;
      case 'representative':
        success = this.representativePrayerModel.savePrayer(prayerData);
        break;
    }

    if (success) {
      this.closePrayerForm();
      this.refreshCurrentView();
    }
  }

  // 기도 폼 데이터 채우기
  populatePrayerForm(prayer, type) {
    const form = document.getElementById('prayerForm');
    if (!form) return;

    form.querySelector('#prayerTitle').value = prayer.title || '';
    form.querySelector('#prayerContent').value = prayer.content || '';
    form.querySelector('#prayerCategory').value = prayer.category || '';

    // 중보 기도인 경우 대상 필드 설정
    const targetField = form.querySelector('#prayerTarget');
    if (targetField) {
      targetField.value = prayer.target || '';
    }

    // 숨겨진 필드에 기도 ID 설정
    const prayerIdField = form.querySelector('#prayerId');
    if (prayerIdField) {
      prayerIdField.value = prayer.id || '';
    }
  }

  // 기도 폼 초기화
  clearPrayerForm() {
    const form = document.getElementById('prayerForm');
    if (form) {
      form.reset();
      const prayerIdField = form.querySelector('#prayerId');
      if (prayerIdField) {
        prayerIdField.value = '';
      }
    }
  }

  closePrayerForm() {
    const modal = document.querySelector('.prayer-modal');
    if (modal) {
      modal.style.display = 'none';
      this.clearPrayerForm();
    }
  }

  // 교회 이벤트 폼 표시
  showChurchEventForm(date = null, eventId = null) {
    const modal = document.querySelector('.church-event-modal');
    if (!modal) return;

    modal.style.display = 'flex';

    if (date) {
      document.getElementById('eventDate').value = date;
    } else {
      document.getElementById('eventDate').value = Utils.formatDate(new Date());
    }

    if (eventId) {
      // 기존 이벤트 수정
      const event = this.churchEventModel.getAll().find(e => e.id === eventId);
      if (event) {
        this.populateChurchEventForm(event);
      }
    } else {
      this.clearChurchEventForm();
    }
  }

  // 교회 이벤트 폼 닫기
  closeChurchEventForm() {
    const modal = document.querySelector('.church-event-modal');
    if (modal) {
      modal.style.display = 'none';
      this.clearChurchEventForm();
    }
  }

  // 교회 이벤트 폼 데이터 채우기
  populateChurchEventForm(event) {
    document.getElementById('eventTitle').value = event.title || '';
    document.getElementById('eventDate').value = event.date || '';
    document.getElementById('eventTime').value = event.time || '';
    document.getElementById('eventCategory').value = event.category || '';
    document.getElementById('eventDescription').value = event.description || '';

    // 숨겨진 필드에 이벤트 ID 설정
    const eventIdField = document.getElementById('eventId');
    if (eventIdField) {
      eventIdField.value = event.id || '';
    }
  }

  // 교회 이벤트 폼 초기화
  clearChurchEventForm() {
    const form = document.getElementById('churchEventForm');
    if (form) {
      form.reset();
      // 숨겨진 필드 초기화
      const eventIdField = document.getElementById('eventId');
      if (eventIdField) {
        eventIdField.value = '';
      }
    }
  }

  // 교회 이벤트 제출 처리
  handleChurchEventSubmit(event) {
    const formData = new FormData(event.target);
    const eventId = formData.get('eventId');

    const eventData = {
      title: formData.get('title'),
      date: formData.get('date'),
      time: formData.get('time'),
      category: formData.get('category'),
      description: formData.get('description')
    };

    let success = false;

    if (eventId) {
      // 기존 이벤트 수정
      success = this.churchEventModel.updateEvent(parseInt(eventId), eventData);
    } else {
      // 새 이벤트 저장
      success = this.churchEventModel.saveEvent(eventData);
    }

    if (success) {
      this.closeChurchEventForm();
      this.updateChurchCalendarEvents();
      this.refreshCurrentView();
    }
  }

  // 교회 이벤트 액션 처리
  handleChurchEventAction(action, eventId = null) {
    switch (action) {
      case 'new-event':
        this.showChurchEventForm();
        break;
      case 'edit-event':
        this.showChurchEventForm(null, eventId);
        break;
      case 'delete-event':
        if (confirm('이 교회 일정을 삭제하시겠습니까?')) {
          if (this.churchEventModel.deleteEvent(eventId)) {
            this.updateChurchCalendarEvents();
            this.refreshCurrentView();
          }
        }
        break;
    }
  }

  // 교리 관련 액션 핸들러
  handleDoctrineAction(action, doctrineId = null) {
    switch (action) {
      case 'view-doctrine':
        this.showDoctrineDetail(doctrineId);
        break;
      case 'meditation-from-doctrine':
        this.showMeditationForm(null, null, doctrineId);
        break;
      case 'prayer-from-doctrine':
        this.showPrayerForm('meditation', doctrineId);
        break;
    }
  }

  // 예언 관련 액션 핸들러
  handleProphecyAction(action, prophecyId = null) {
    switch (action) {
      case 'new-prophecy':
        this.showProphecyForm();
        break;
      case 'edit-prophecy':
        this.showProphecyForm(prophecyId);
        break;
      case 'delete-prophecy':
        if (confirm('이 예언 글을 삭제하시겠습니까?')) {
          if (this.prophecyModel.deleteProphecy(prophecyId)) {
            this.refreshCurrentView();
          }
        }
        break;
      case 'meditation-from-prophecy':
        this.showMeditationForm(null, null, null, prophecyId);
        break;
      case 'prayer-from-prophecy':
        this.showPrayerForm('meditation', null, prophecyId);
        break;
    }
  }

  // 교리 상세 보기
  showDoctrineDetail(doctrineId) {
    const doctrine = this.doctrineModel.getById(doctrineId);
    if (!doctrine) return;

    const urlList = this.doctrineModel.getDoctrineUrlList(doctrineId);
    const hasUrls = urlList && urlList.length > 0;

    const modal = document.createElement('div');
    modal.className = 'doctrine-detail-modal';
    modal.innerHTML = `
      <div class="doctrine-detail-content">
        <div class="doctrine-detail-header">
          <h2>${doctrine.title}</h2>
          <button class="btn-close" onclick="this.closest('.doctrine-detail-modal').remove()">×</button>
        </div>
        <div class="doctrine-detail-body">
          <div class="doctrine-category">카테고리: ${doctrine.category}</div>
          <div class="doctrine-content">${doctrine.content}</div>
          <div class="doctrine-reference">성경 구절: ${doctrine.reference}</div>
          ${hasUrls ? `
          <div class="doctrine-url-info">
            <i class="fas fa-link"></i> 
            <span>저장된 상세 자료 (${urlList.length}개)</span>
          </div>
          <div class="doctrine-url-list">
            ${urlList.map(urlItem => `
              <div class="doctrine-url-item">
                <a href="${urlItem.url}" target="_blank" class="doctrine-url-link">
                  <i class="fas fa-external-link-alt"></i>
                  ${urlItem.title}
                </a>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
        <div class="doctrine-detail-actions">
          <button class="btn-detail ${hasUrls ? 'btn-detail-has-url' : ''}" 
                  onclick="handleDoctrineDetail(${doctrine.id})"
                  oncontextmenu="handleDoctrineDetailEdit(${doctrine.id}); return false;"
                  title="${hasUrls ? '클릭: 첫 번째 URL로 이동 | 우클릭: URL 관리' : '클릭: URL 입력 모달 열기'}">
            <i class="fas fa-file-alt"></i> 상세 내용
            ${hasUrls ? '<span class="url-indicator">✓</span>' : ''}
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // 교리 상세 내용 URL 입력 모달 표시
  showDoctrineUrlModal(doctrineId) {
    const doctrine = this.doctrineModel.getById(doctrineId);
    if (!doctrine) return;

    const urlList = this.doctrineModel.getDoctrineUrlList(doctrineId);

    const modal = document.createElement('div');
    modal.className = 'doctrine-url-modal';
    modal.innerHTML = `
      <div class="doctrine-url-content">
        <div class="doctrine-url-header">
          <h2>교리 상세 내용 URL 설정</h2>
          <button class="btn-close" onclick="this.closest('.doctrine-url-modal').remove()">×</button>
        </div>
        <div class="doctrine-url-body">
          <div class="doctrine-info">
            <h3>${doctrine.title}</h3>
            <p>${doctrine.category}</p>
          </div>
          <div class="url-input-group">
            <label for="doctrineUrl">교리 상세 내용 URL:</label>
            <input type="url" id="doctrineUrl" placeholder="https://example.com" value="" />
            <small>교리와 관련된 상세 자료의 URL을 입력하세요. 저장 후에는 목록에서 클릭하여 해당 페이지로 이동할 수 있습니다.</small>
          </div>
          <div class="url-list-container">
            <h4>저장된 URL 목록</h4>
            <div class="url-list" id="urlList-${doctrineId}">
              ${this.getUrlListHTML(doctrineId, urlList)}
            </div>
          </div>
        </div>
        <div class="doctrine-url-actions">
          <button class="btn-secondary" onclick="this.closest('.doctrine-url-modal').remove()">취소</button>
          <button class="btn-primary" id="saveUrlBtn" data-doctrine-id="${doctrineId}">저장</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // 저장 버튼에 이벤트 리스너 추가
    const saveButton = modal.querySelector('#saveUrlBtn');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        console.log('저장 버튼 클릭됨, doctrineId:', doctrineId);
        this.handleDoctrineUrlSave(doctrineId);
      });
    }
  }

  // URL 목록 HTML 생성
  getUrlListHTML(doctrineId, urlList) {
    if (!urlList || urlList.length === 0) {
      return '<div class="no-urls">저장된 URL이 없습니다.</div>';
    }

    return urlList.map(urlItem => `
      <div class="url-item" data-url-id="${urlItem.id}">
        <div class="url-content">
          <div class="url-title">${urlItem.title}</div>
          <div class="url-link">
            <a href="${urlItem.url}" target="_blank" onclick="event.stopPropagation();">
              ${urlItem.url}
            </a>
          </div>
          <div class="url-date">${this.formatDate(urlItem.addedAt)}</div>
        </div>
        <div class="url-actions">
          <button class="btn-url-delete" onclick="handleDoctrineUrlItemDelete('${doctrineId}', '${urlItem.id}')" title="삭제">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // 교리 상세 내용 URL 저장 처리
  handleDoctrineUrlSave(doctrineId) {
    // doctrineId를 숫자로 변환
    const numericDoctrineId = parseInt(doctrineId, 10);
    
    const urlInput = document.getElementById('doctrineUrl');
    const url = urlInput.value.trim();

    if (!url) {
      notificationManager.showError('URL을 입력해주세요.');
      return;
    }

    // URL 유효성 검사
    try {
      new URL(url);
    } catch (e) {
      notificationManager.showError('올바른 URL 형식을 입력해주세요.');
      return;
    }

    console.log('URL 저장 시도:', { doctrineId: numericDoctrineId, url });

    if (this.doctrineModel.saveDoctrineUrl(numericDoctrineId, url)) {
      // 입력 필드 초기화
      urlInput.value = '';
      
      // 잠시 대기 후 URL 목록 업데이트 (DOM 업데이트 보장)
      setTimeout(() => {
        this.updateUrlList(numericDoctrineId);
      }, 100);
      
      // 성공 메시지 표시
      notificationManager.showSuccess('URL이 저장되었습니다.');
      
      console.log('URL 저장 완료, 목록 업데이트 예약됨');
    } else {
      console.log('URL 저장 실패');
    }
  }

  // URL 목록 업데이트
  updateUrlList(doctrineId) {
    console.log('URL 목록 업데이트 시작:', doctrineId);
    
    // 여러 방법으로 컨테이너 찾기 시도
    let urlListContainer = document.getElementById(`urlList-${doctrineId}`);
    
    if (!urlListContainer) {
      // querySelector로도 시도
      urlListContainer = document.querySelector(`[id="urlList-${doctrineId}"]`);
    }
    
    console.log('URL 목록 컨테이너 찾음:', !!urlListContainer);
    console.log('찾고 있는 컨테이너 ID:', `urlList-${doctrineId}`);
    
    if (urlListContainer) {
      const urlList = this.doctrineModel.getDoctrineUrlList(doctrineId);
      console.log('현재 URL 목록:', urlList);
      
      const newHTML = this.getUrlListHTML(doctrineId, urlList);
      console.log('새로운 HTML 생성됨');
      
      // innerHTML 업데이트
      urlListContainer.innerHTML = newHTML;
      
      // 업데이트 확인
      console.log('URL 목록 업데이트 완료');
      console.log('업데이트된 컨테이너 내용:', urlListContainer.innerHTML.substring(0, 200) + '...');
    } else {
      console.error('URL 목록 컨테이너를 찾을 수 없음:', `urlList-${doctrineId}`);
      // DOM에서 모든 urlList-로 시작하는 요소들을 찾아서 로그
      const allUrlLists = document.querySelectorAll('[id^="urlList-"]');
      console.log('현재 페이지의 모든 URL 목록 컨테이너:', Array.from(allUrlLists).map(el => el.id));
      
      // 모달 내부의 모든 div 요소들도 확인
      const modal = document.querySelector('.doctrine-url-modal');
      if (modal) {
        const modalDivs = modal.querySelectorAll('div');
        console.log('모달 내부의 div 요소들:', Array.from(modalDivs).map(el => ({ id: el.id, className: el.className })));
      }
    }
  }

  // 교리 상세 내용 URL 삭제 처리
  handleDoctrineUrlDelete(doctrineId) {
    if (confirm('저장된 URL을 삭제하시겠습니까?')) {
      if (this.doctrineModel.removeDoctrineUrl(doctrineId)) {
        // 모달 닫기
        const modal = document.querySelector('.doctrine-url-modal');
        if (modal) {
          modal.remove();
        }

        // 교리 목록 새로고침
        this.refreshCurrentView();
      }
    }
  }

  // 예언 폼 표시
  showProphecyForm(prophecyId = null) {
    const modal = document.querySelector('.prophecy-modal');
    if (!modal) return;

    modal.style.display = 'flex';

    if (prophecyId) {
      // 기존 예언 수정
      const prophecy = this.prophecyModel.getById(prophecyId);
      if (prophecy) {
        this.populateProphecyForm(prophecy);
      }
    } else {
      this.clearProphecyForm();
    }
  }

  // 예언 폼 데이터 채우기
  populateProphecyForm(prophecy) {
    const form = document.getElementById('prophecyForm');
    if (!form) return;

    form.querySelector('#prophecyTitle').value = prophecy.title || '';
    form.querySelector('#prophecyAuthor').value = prophecy.author || '';
    form.querySelector('#prophecyCategory').value = prophecy.category || '일반';
    form.querySelector('#prophecyContent').value = prophecy.content || '';
    form.querySelector('#prophecySource').value = prophecy.source || '';
    form.querySelector('#prophecyTags').value = prophecy.tags ? prophecy.tags.join(', ') : '';

    const prophecyIdField = form.querySelector('#prophecyId');
    if (prophecyIdField) {
      prophecyIdField.value = prophecy.id || '';
    }
  }

  // 예언 폼 초기화
  clearProphecyForm() {
    const form = document.getElementById('prophecyForm');
    if (form) {
      form.reset();
      const prophecyIdField = form.querySelector('#prophecyId');
      if (prophecyIdField) {
        prophecyIdField.value = '';
      }
    }
  }

  // 예언 폼 닫기
  closeProphecyForm() {
    const modal = document.querySelector('.prophecy-modal');
    if (modal) {
      modal.style.display = 'none';
      this.clearProphecyForm();
    }
  }

  // 예언 폼 제출 처리
  handleProphecySubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const prophecyData = {
      title: formData.get('title'),
      author: formData.get('author'),
      category: formData.get('category'),
      content: formData.get('content'),
      source: formData.get('source'),
      tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };

    // 기존 예언 수정인지 확인
    const prophecyId = formData.get('prophecyId');
    let success = false;

    if (prophecyId) {
      success = this.prophecyModel.updateProphecy(parseInt(prophecyId), prophecyData);
    } else {
      success = this.prophecyModel.saveProphecy(prophecyData);
    }

    if (success) {
      this.closeProphecyForm();
      this.refreshCurrentView();
    }
  }
} 
