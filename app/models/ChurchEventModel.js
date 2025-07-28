import { Utils } from '../lib/utils.js';
import { notificationManager } from '../lib/notification.js';

export class ChurchEventModel {
    constructor() {
        this.storageKey = 'churchEvents';
        this.events = [];
        this.load();
    }

    // 데이터 로드
    load() {
        this.events = Utils.storage.get(this.storageKey, []);
    }

    // 데이터 저장
    save() {
        return Utils.storage.set(this.storageKey, this.events);
    }

    // 모든 이벤트 가져오기
    getAll() {
        return this.events;
    }

    // 특정 날짜의 이벤트 가져오기
    getByDate(date) {
        return this.events.filter(event => event.date === date);
    }

    // 특정 월의 이벤트 가져오기
    getByMonth(year, month) {
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        return this.events.filter(event => event.date.startsWith(monthStr));
    }

    // 이벤트 저장/수정
    saveEvent(eventData) {
        if (!this.validateEvent(eventData)) {
            return false;
        }

        if (eventData.id) {
            // 수정
            const index = this.events.findIndex(event => event.id === eventData.id);
            if (index !== -1) {
                this.events[index] = {
                    ...this.events[index],
                    ...eventData,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            // 새 이벤트
            const newEvent = {
                id: Date.now(),
                ...eventData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.events.push(newEvent);
        }

        if (this.save()) {
            notificationManager.success('교회 일정이 저장되었습니다.');
            return true;
        } else {
            notificationManager.error('저장 중 오류가 발생했습니다.');
            return false;
        }
    }

    // 이벤트 삭제
    deleteEvent(id) {
        const index = this.events.findIndex(event => event.id === id);
        if (index !== -1) {
            this.events.splice(index, 1);
            if (this.save()) {
                notificationManager.success('교회 일정이 삭제되었습니다.');
                return true;
            } else {
                notificationManager.error('삭제 중 오류가 발생했습니다.');
                return false;
            }
        }
        return false;
    }

    // 이벤트 수정
    updateEvent(id, eventData) {
        if (!this.validateEvent(eventData)) {
            return false;
        }

        const index = this.events.findIndex(event => event.id === id);
        if (index !== -1) {
            this.events[index] = {
                ...this.events[index],
                ...eventData,
                updatedAt: new Date().toISOString()
            };

            if (this.save()) {
                notificationManager.success('교회 일정이 수정되었습니다.');
                return true;
            } else {
                notificationManager.error('수정 중 오류가 발생했습니다.');
                return false;
            }
        }
        return false;
    }

    // 이벤트 검색
    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.events.filter(event =>
            event.title.toLowerCase().includes(lowerQuery) ||
            event.description.toLowerCase().includes(lowerQuery) ||
            event.category.toLowerCase().includes(lowerQuery)
        );
    }

    // 통계 정보
    getStats() {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const thisMonthEvents = this.events.filter(event =>
            event.date.startsWith(currentMonth)
        );

        return {
            total: this.events.length,
            thisMonth: thisMonthEvents.length,
            upcoming: this.events.filter(event => event.date >= Utils.formatDate(new Date())).length
        };
    }

    // 데이터 검증
    validateEvent(data) {
        if (!data.title || data.title.trim().length === 0) {
            notificationManager.error('제목을 입력해주세요.');
            return false;
        }
        if (!data.date) {
            notificationManager.error('날짜를 선택해주세요.');
            return false;
        }
        if (!data.category) {
            notificationManager.error('카테고리를 선택해주세요.');
            return false;
        }
        return true;
    }

    // 데이터 내보내기
    exportData() {
        return JSON.stringify(this.events, null, 2);
    }

    // 데이터 가져오기
    importData(jsonData) {
        try {
            const events = JSON.parse(jsonData);
            if (Array.isArray(events)) {
                this.events = events;
                if (this.save()) {
                    notificationManager.success('교회 일정 데이터를 가져왔습니다.');
                    return true;
                }
            }
        } catch (error) {
            console.error('데이터 가져오기 오류:', error);
            notificationManager.error('데이터 형식이 올바르지 않습니다.');
        }
        return false;
    }
} 
