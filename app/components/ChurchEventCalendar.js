import { Utils } from '../lib/utils.js';
import { notificationManager } from '../lib/notification.js';

export class ChurchEventCalendar {
    constructor(container, options = {}) {
        this.container = container;
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = [];
        this.options = {
            onDateSelect: null,
            onMonthChange: null,
            showEventIndicator: true,
            ...options
        };
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        this.container.innerHTML = `
            <div class="calendar-header">
                <button class="calendar-nav-btn prev-btn" onclick="handleCalendarNav('prev')">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h2 class="calendar-title">${year}년 ${month + 1}월</h2>
                <button class="calendar-nav-btn next-btn" onclick="handleCalendarNav('next')">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="calendar-body">
                <div class="calendar-weekdays">
                    <div class="weekday sunday">
                        <div class="weekday-main">일</div>
                    </div>
                    <div class="weekday">
                        <div class="weekday-main">월</div>
                    </div>
                    <div class="weekday">
                        <div class="weekday-main">화</div>
                        <div class="weekday-sub">삼일예배</div>
                    </div>
                    <div class="weekday">
                        <div class="weekday-main">수</div>
                    </div>
                    <div class="weekday">
                        <div class="weekday-main">목</div>
                    </div>
                    <div class="weekday">
                        <div class="weekday-main">금</div>
                        <div class="weekday-sub">안식일환영</div>
                    </div>
                    <div class="weekday saturday">
                        <div class="weekday-main">토</div>
                        <div class="weekday-sub">안식일</div>
                    </div>
                </div>
                <div class="calendar-days" id="churchCalendarDays">
                    ${this.generateDaysHTML(year, month)}
                </div>
            </div>
        `;
    }

        generateDaysHTML(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const currentDate = new Date(startDate);

        // 6주치 날짜 생성 (42일)
        for (let i = 0; i < 42; i++) {
            const dateStr = Utils.formatDate(currentDate);
            const isCurrentMonth = currentDate.getMonth() === month;
            const isToday = Utils.formatDate(new Date()) === dateStr;
            const isSelected = this.selectedDate === dateStr;
            const dayOfWeek = currentDate.getDay(); // 0: 일요일, 6: 토요일
            
            const dayEvents = this.events.filter(event => event.date === dateStr);
            const hasEvents = dayEvents.length > 0;

            const dayClass = [
                'calendar-day',
                isCurrentMonth ? 'current-month' : 'other-month',
                isToday ? 'today' : '',
                isSelected ? 'selected' : '',
                hasEvents ? 'has-events' : '',
                dayOfWeek === 0 ? 'sunday' : '',
                dayOfWeek === 6 ? 'saturday' : ''
            ].filter(Boolean).join(' ');

            days.push(`
                <div class="${dayClass}" data-date="${dateStr}" onclick="handleChurchCalendarDateClick('${dateStr}')">
                    <span class="day-number">${currentDate.getDate()}</span>
                    ${hasEvents ? `<div class="event-indicator">${dayEvents.length}</div>` : ''}
                </div>
            `);

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days.join('');
    }

    attachEventListeners() {
        // 이벤트 위임으로 날짜 클릭 처리
        Utils.delegateEvent(this.container, '.calendar-day', 'click', (event) => {
            const date = event.currentTarget.dataset.date;
            this.handleDateClick(date);
        });
    }

    handleDateClick(date) {
        this.selectedDate = date;
        this.updateSelectedState();

        if (this.options.onDateSelect) {
            this.options.onDateSelect(date);
        }
    }

    updateSelectedState() {
        // 모든 날짜에서 selected 클래스 제거
        this.container.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });

        // 선택된 날짜에 selected 클래스 추가
        if (this.selectedDate) {
            const selectedDay = this.container.querySelector(`[data-date="${this.selectedDate}"]`);
            if (selectedDay) {
                selectedDay.classList.add('selected');
            }
        }
    }

    goToDate(date) {
        const targetDate = new Date(date);
        this.currentDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        this.selectedDate = date;
        this.render();
        this.updateSelectedState();
    }

    goToMonth(year, month) {
        this.currentDate = new Date(year, month, 1);
        this.render();

        if (this.options.onMonthChange) {
            this.options.onMonthChange(year, month);
        }
    }

    updateEvents(events) {
        this.events = events;
        this.render();
        this.updateSelectedState();
    }

    getSelectedDate() {
        return this.selectedDate;
    }

    getCurrentDate() {
        return this.currentDate;
    }

    refresh() {
        this.render();
        this.updateSelectedState();
    }

    destroy() {
        this.container.innerHTML = '';
    }
} 
