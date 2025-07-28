import { Utils } from '../lib/utils.js';
import { notificationManager } from '../lib/notification.js';

export class RepresentativePrayerModel {
    constructor() {
        this.storageKey = 'representativePrayers';
        this.prayers = [];
        this.load();
    }

    // 데이터 로드
    load() {
        this.prayers = Utils.storage.get(this.storageKey, []);
    }

    // 데이터 저장
    save() {
        return Utils.storage.set(this.storageKey, this.prayers);
    }

    // 모든 기도 가져오기
    getAll() {
        return this.prayers;
    }

    // 특정 기도 가져오기
    getById(id) {
        return this.prayers.find(prayer => prayer.id === id);
    }

    // 답변된 기도 가져오기
    getAnswered() {
        return this.prayers.filter(prayer => prayer.answered);
    }

    // 진행 중인 기도 가져오기
    getOngoing() {
        return this.prayers.filter(prayer => !prayer.answered);
    }

    // 기도 저장/수정
    savePrayer(prayerData) {
        if (!this.validatePrayer(prayerData)) {
            return false;
        }

        if (prayerData.id) {
            // 수정
            const index = this.prayers.findIndex(prayer => prayer.id === prayerData.id);
            if (index !== -1) {
                this.prayers[index] = {
                    ...this.prayers[index],
                    ...prayerData,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            // 새 기도
            const newPrayer = {
                id: Date.now(),
                ...prayerData,
                answered: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.prayers.push(newPrayer);
        }

        if (this.save()) {
            notificationManager.success('대표 기도가 저장되었습니다.');
            return true;
        } else {
            notificationManager.error('저장 중 오류가 발생했습니다.');
            return false;
        }
    }

    // 기도 삭제
    deletePrayer(id) {
        const index = this.prayers.findIndex(prayer => prayer.id === id);
        if (index !== -1) {
            this.prayers.splice(index, 1);
            if (this.save()) {
                notificationManager.success('대표 기도가 삭제되었습니다.');
                return true;
            } else {
                notificationManager.error('삭제 중 오류가 발생했습니다.');
                return false;
            }
        }
        return false;
    }

    // 기도 답변 상태 토글
    toggleAnswered(id) {
        const prayer = this.prayers.find(prayer => prayer.id === id);
        if (prayer) {
            prayer.answered = !prayer.answered;
            prayer.answeredAt = prayer.answered ? new Date().toISOString() : null;
            prayer.updatedAt = new Date().toISOString();

            if (this.save()) {
                const status = prayer.answered ? '답변됨' : '진행 중';
                notificationManager.success(`기도가 ${status}으로 변경되었습니다.`);
                return true;
            } else {
                notificationManager.error('상태 변경 중 오류가 발생했습니다.');
                return false;
            }
        }
        return false;
    }

    // 기도 검색
    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.prayers.filter(prayer =>
            prayer.title.toLowerCase().includes(lowerQuery) ||
            prayer.content.toLowerCase().includes(lowerQuery) ||
            prayer.category.toLowerCase().includes(lowerQuery)
        );
    }

    // 통계 정보
    getStats() {
        const total = this.prayers.length;
        const answered = this.prayers.filter(prayer => prayer.answered).length;
        const ongoing = total - answered;

        return {
            total,
            answered,
            ongoing,
            answerRate: total > 0 ? Math.round((answered / total) * 100) : 0
        };
    }

    // 데이터 검증
    validatePrayer(data) {
        if (!data.title || data.title.trim().length === 0) {
            notificationManager.error('기도 제목을 입력해주세요.');
            return false;
        }
        if (!data.content || data.content.trim().length === 0) {
            notificationManager.error('기도 내용을 입력해주세요.');
            return false;
        }
        if (!data.category) {
            notificationManager.error('기도 카테고리를 선택해주세요.');
            return false;
        }
        return true;
    }

    // 데이터 내보내기
    exportData() {
        return JSON.stringify(this.prayers, null, 2);
    }

    // 데이터 가져오기
    importData(jsonData) {
        try {
            const prayers = JSON.parse(jsonData);
            if (Array.isArray(prayers)) {
                this.prayers = prayers;
                if (this.save()) {
                    notificationManager.success('대표 기도 데이터를 가져왔습니다.');
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
