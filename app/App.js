import { Utils } from './lib/utils.js';
import { notificationManager } from './lib/notification.js';
import { MeditationModel } from './models/MeditationModel.js';
import { PrayerModel } from './models/PrayerModel.js';
import { RepresentativePrayerModel } from './models/RepresentativePrayerModel.js';
import { ChurchEventModel } from './models/ChurchEventModel.js';
import { Calendar } from './components/Calendar.js';
import { ChurchEventCalendar } from './components/ChurchEventCalendar.js';
import { generateBibleListHTML } from './data/bibleData.js';

export class BibleMeditationApp {
  constructor() {
    this.currentView = 'home';
    this.meditationModel = new MeditationModel();
    this.meditationPrayerModel = new PrayerModel('meditation');
    this.intercessoryPrayerModel = new PrayerModel('intercessory');
    this.representativePrayerModel = new RepresentativePrayerModel();
    this.churchEventModel = new ChurchEventModel();
    this.calendar = null;
    this.churchCalendar = null;
    this.currentMeditation = null;
    this.currentPrayerTab = 'meditation'; // 기본 탭

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

    container.innerHTML = `
      <div class="meditation-calendar-container">
        <div class="meditation-calendar-header">
          <h2>📖 묵상 달력</h2>
          <p class="meditation-calendar-description">
            날짜를 클릭하면 성경 목록 페이지로 이동하여 해당 날짜의 묵상을 작성할 수 있습니다.
          </p>
        </div>
        <div class="meditation-calendar-actions">
          <button class="btn-new-meditation" onclick="handleHomeAction('new-meditation')">
            <i class="fas fa-plus"></i> 새 묵상 작성
          </button>
        </div>
      </div>
    `;
    calendarContainer.style.display = 'grid';

    // Calendar 인스턴스 생성 또는 업데이트
    if (!this.calendar) {
      this.calendar = new Calendar(calendarContainer, {
        onDateSelect: (date) => {
          // 날짜 클릭 시 성경 목록 페이지로 이동
          this.navigateToView('bible-list', null);
          // 잠시 후 해당 날짜의 묵상 폼 표시
          setTimeout(() => {
            this.showMeditationForm(date);
          }, 100);
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

    container.innerHTML = this.getChurchEventsViewHTML();
    calendarContainer.style.display = 'grid';
    calendarContainer.className = 'calendar'; // 기존 달력 스타일 적용

    // ChurchEventCalendar 인스턴스 생성 또는 업데이트
    if (!this.churchCalendar) {
      this.churchCalendar = new ChurchEventCalendar(calendarContainer, {
        onDateSelect: (date) => this.showChurchEventForm(date),
        onMonthChange: () => this.updateChurchCalendarEvents()
      });
    }

    this.updateChurchCalendarEvents();
  }

  // 묵상 폼 표시
  showMeditationForm(date = null, bookName = null) {
    const modal = document.querySelector('.meditation-modal');
    if (!modal) return;

    modal.style.display = 'flex';

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
    const meditationData = {
      date: formData.get('date'),
      bibleReference: formData.get('bibleReference'),
      title: formData.get('title'),
      capture: formData.get('capture'),
      organize: formData.get('organize'),
      distill: formData.get('distill'),
      express: formData.get('express')
    };

    if (this.meditationModel.saveMeditation(meditationData)) {
      this.closeMeditationForm();

      // 달력 업데이트
      if (this.calendar) {
        this.updateCalendarMeditations();
      }

      // 현재 뷰 새로고침
      this.refreshCurrentView();
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
  }

  // 교회 이벤트 폼 초기화
  clearChurchEventForm() {
    const form = document.getElementById('churchEventForm');
    if (form) form.reset();
  }

  // 교회 이벤트 제출 처리
  handleChurchEventSubmit(event) {
    const formData = new FormData(event.target);
    const eventData = {
      title: formData.get('title'),
      date: formData.get('date'),
      time: formData.get('time'),
      category: formData.get('category'),
      description: formData.get('description')
    };

    if (this.churchEventModel.saveEvent(eventData)) {
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
} 
