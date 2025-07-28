import { Utils } from '../lib/utils.js';
import { notificationManager } from '../lib/notification.js';

export class Calendar {
  constructor(container, options = {}) {
    this.container = container;
    this.currentDate = new Date();
    this.selectedDate = null;
    this.meditations = [];
    this.options = {
      onDateSelect: null,
      onMonthChange: null,
      showMeditationIndicator: true,
      ...options
    };

    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  // 달력 렌더링 (성능 최적화)
  render() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayIndex = firstDay.getDay();
    const lastDayDate = lastDay.getDate();

    // 템플릿 리터럴 대신 DocumentFragment 사용으로 성능 향상
    const fragment = document.createDocumentFragment();

    // 캘린더 컨테이너
    const calendarDiv = Utils.createElement('div', 'calendar');

    // 헤더
    const header = this.createHeader(year, month);
    calendarDiv.appendChild(header);

    // 요일 헤더
    const daysHeader = this.createDaysHeader();
    calendarDiv.appendChild(daysHeader);

    // 날짜 그리드
    const daysGrid = this.createDaysGrid(year, month, firstDayIndex, lastDayDate);
    calendarDiv.appendChild(daysGrid);

    fragment.appendChild(calendarDiv);

    // 기존 내용 제거 후 새 내용 추가
    this.container.innerHTML = '';
    this.container.appendChild(fragment);
  }

  // 헤더 생성
  createHeader(year, month) {
    const header = Utils.createElement('div', 'calendar-header');

    const prevBtn = Utils.createElement('button', 'prev-month');
    prevBtn.innerHTML = '&lt;';
    prevBtn.setAttribute('aria-label', '이전 달');

    const title = Utils.createElement('h2');
    title.textContent = `${year}년 ${month + 1}월`;

    const nextBtn = Utils.createElement('button', 'next-month');
    nextBtn.innerHTML = '&gt;';
    nextBtn.setAttribute('aria-label', '다음 달');

    header.appendChild(prevBtn);
    header.appendChild(title);
    header.appendChild(nextBtn);

    return header;
  }

  // 요일 헤더 생성
  createDaysHeader() {
    const daysHeader = Utils.createElement('div', 'calendar-weekdays');

    const dayConfigs = [
      { main: '일', sub: '', class: 'sunday' },
      { main: '월', sub: '', class: '' },
      { main: '화', sub: '삼일예배', class: '' },
      { main: '수', sub: '', class: '' },
      { main: '목', sub: '', class: '' },
      { main: '금', sub: '안식일환영', class: '' },
      { main: '토', sub: '안식일', class: 'saturday' }
    ];

    dayConfigs.forEach((config) => {
      const dayName = Utils.createElement('div', `weekday ${config.class}`);

      const mainText = Utils.createElement('div', 'weekday-main');
      mainText.textContent = config.main;
      dayName.appendChild(mainText);

      if (config.sub) {
        const subText = Utils.createElement('div', 'weekday-sub');
        subText.textContent = config.sub;
        dayName.appendChild(subText);
      }

      daysHeader.appendChild(dayName);
    });

    return daysHeader;
  }

  // 날짜 그리드 생성
  createDaysGrid(year, month, firstDayIndex, lastDayDate) {
    const daysGrid = Utils.createElement('div', 'calendar-days');

    // 이전 달의 마지막 날짜들
    for (let i = firstDayIndex; i > 0; i--) {
      const prevDate = new Date(year, month, -i + 1);
      const dayElement = this.createDayElement(prevDate, 'prev-month-day');
      daysGrid.appendChild(dayElement);
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= lastDayDate; i++) {
      const currentDate = new Date(year, month, i);
      const dayElement = this.createDayElement(currentDate, 'current-month-day');
      daysGrid.appendChild(dayElement);
    }

    // 다음 달의 시작 날짜들
    const remainingDays = 42 - (firstDayIndex + lastDayDate);
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dayElement = this.createDayElement(nextDate, 'next-month-day');
      daysGrid.appendChild(dayElement);
    }

    return daysGrid;
  }

  // 개별 날짜 요소 생성
  createDayElement(date, className) {
    const dayElement = Utils.createElement('div', `calendar-day ${className}`);

    const dateStr = Utils.formatDate(date);
    dayElement.dataset.date = dateStr;

    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isCurrentMonth = className === 'current-month-day';

    if (isToday) dayElement.classList.add('today');
    if (isCurrentMonth) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0) dayElement.classList.add('sunday');
      if (dayOfWeek === 6) dayElement.classList.add('saturday');
    }

    // 묵상 표시기 추가
    if (isCurrentMonth && this.options.showMeditationIndicator) {
      const hasMeditation = this.meditations.some(m => m.date === dateStr);
      if (hasMeditation) {
        dayElement.classList.add('has-meditation');
        const indicator = Utils.createElement('span', 'meditation-indicator');
        indicator.textContent = '✏️';
        dayElement.appendChild(indicator);
      }
    }

    const dateNumber = Utils.createElement('span', 'date-number');
    dateNumber.textContent = date.getDate();
    dayElement.appendChild(dateNumber);

    return dayElement;
  }

  // 이벤트 리스너 설정 (이벤트 위임 사용)
  attachEventListeners() {
    // 이벤트 위임을 사용하여 성능 최적화
    Utils.delegateEvent(this.container, '.prev-month', 'click', () => {
      this.prevMonth();
    });

    Utils.delegateEvent(this.container, '.next-month', 'click', () => {
      this.nextMonth();
    });

    Utils.delegateEvent(this.container, '.calendar-day.current-month-day', 'click', (event) => {
      this.handleDateClick(event);
    });
  }

  // 날짜 클릭 처리
  handleDateClick(event) {
    const dateStr = event.currentTarget.dataset.date;
    if (!dateStr) return;

    // 선택 상태 업데이트
    this.container.querySelectorAll('.calendar-day').forEach(day => {
      day.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    this.selectedDate = dateStr;

    // 콜백 호출 (App.js에서 처리)
    if (this.options.onDateSelect) {
      this.options.onDateSelect(dateStr);
    }
  }

  // 이전 달로 이동
  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();

    if (this.options.onMonthChange) {
      this.options.onMonthChange(this.currentDate);
    }
  }

  // 다음 달로 이동
  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();

    if (this.options.onMonthChange) {
      this.options.onMonthChange(this.currentDate);
    }
  }

  // 특정 날짜로 이동
  goToDate(date) {
    this.currentDate = new Date(date);
    this.render();
  }

  // 묵상 데이터 업데이트
  updateMeditations(meditations) {
    this.meditations = meditations || [];
    this.render();
  }

  // 선택된 날짜 가져오기
  getSelectedDate() {
    return this.selectedDate;
  }

  // 현재 날짜 가져오기
  getCurrentDate() {
    return new Date(this.currentDate);
  }

  // 달력 새로고침
  refresh() {
    this.render();
  }

  // 달력 파괴 (메모리 정리)
  destroy() {
    this.container.innerHTML = '';
    this.meditations = [];
    this.selectedDate = null;
  }
} 
