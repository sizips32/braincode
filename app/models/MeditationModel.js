import { Utils } from '../lib/utils.js';
import { notificationManager } from '../lib/notification.js';

export class MeditationModel {
    constructor() {
        this.storageKey = 'meditations';
        this.meditations = this.load();
    }

    // 데이터 로드
    load() {
        return Utils.storage.get(this.storageKey, []);
    }

    // 데이터 저장
    save() {
        return Utils.storage.set(this.storageKey, this.meditations);
    }

    // 모든 묵상 조회
    getAll() {
        return [...this.meditations];
    }

    // 날짜별 묵상 조회
    getByDate(date) {
        return this.meditations.find(m => m.date === date) || null;
    }

    // 성경별 묵상 조회
    getByBible(bibleName) {
        return this.meditations.filter(m =>
            m.bibleReference.includes(bibleName)
        );
    }

    // 묵상 저장/수정
    saveMeditation(meditationData) {
        try {
            // 데이터 검증
            if (!this.validateMeditation(meditationData)) {
                throw new Error('묵상 데이터가 유효하지 않습니다.');
            }

            const existingIndex = this.meditations.findIndex(m => m.date === meditationData.date);

            if (existingIndex >= 0) {
                // 수정
                this.meditations[existingIndex] = {
                    ...this.meditations[existingIndex],
                    ...meditationData,
                    updatedAt: new Date().toISOString()
                };
            } else {
                // 새로 추가
                this.meditations.push({
                    ...meditationData,
                    id: Date.now(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }

            // 최신순으로 정렬
            this.meditations.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (this.save()) {
                notificationManager.success('묵상이 성공적으로 저장되었습니다.');
                return true;
            } else {
                throw new Error('저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('묵상 저장 오류:', error);
            notificationManager.error('저장 중 오류가 발생했습니다.');
            return false;
        }
    }

    // 묵상 삭제
    deleteMeditation(date) {
        try {
            const initialLength = this.meditations.length;
            this.meditations = this.meditations.filter(m => m.date !== date);

            if (this.meditations.length < initialLength) {
                if (this.save()) {
                    notificationManager.success('묵상이 삭제되었습니다.');
                    return true;
                }
            }

            throw new Error('삭제할 묵상을 찾을 수 없습니다.');
        } catch (error) {
            console.error('묵상 삭제 오류:', error);
            notificationManager.error('삭제 중 오류가 발생했습니다.');
            return false;
        }
    }

    // 검색
    search(query) {
        if (!query || query.trim() === '') {
            return [];
        }

        const searchTerm = query.toLowerCase().trim();

        return this.meditations.filter(meditation =>
            meditation.title.toLowerCase().includes(searchTerm) ||
            meditation.bibleReference.toLowerCase().includes(searchTerm) ||
            meditation.capture.toLowerCase().includes(searchTerm) ||
            meditation.organize.toLowerCase().includes(searchTerm) ||
            meditation.distill.toLowerCase().includes(searchTerm) ||
            meditation.express.toLowerCase().includes(searchTerm)
        );
    }

    // 최근 묵상 조회
    getRecent(limit = 5) {
        return this.meditations.slice(0, limit);
    }

    // 통계 정보
    getStats() {
        const total = this.meditations.length;
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();

        const thisMonthCount = this.meditations.filter(m => {
            const date = new Date(m.date);
            return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
        }).length;

        const bibleStats = {};
        this.meditations.forEach(m => {
            const bibleName = m.bibleReference.split(' ')[0];
            bibleStats[bibleName] = (bibleStats[bibleName] || 0) + 1;
        });

        return {
            total,
            thisMonth: thisMonthCount,
            bibleStats
        };
    }

    // 데이터 검증
    validateMeditation(data) {
        const required = ['date', 'bibleReference', 'title', 'capture', 'organize', 'distill', 'express'];

        for (const field of required) {
            if (!data[field] || data[field].trim() === '') {
                return false;
            }
        }

        // 날짜 형식 검증
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.date)) {
            return false;
        }

        return true;
    }

    // 데이터 백업
    exportData() {
        return JSON.stringify(this.meditations, null, 2);
    }

    // 데이터 복원
    importData(jsonData) {
        try {
            const data = Utils.safeJsonParse(jsonData);
            if (Array.isArray(data)) {
                this.meditations = data;
                if (this.save()) {
                    notificationManager.success('데이터가 성공적으로 복원되었습니다.');
                    return true;
                }
            }
            throw new Error('잘못된 데이터 형식입니다.');
        } catch (error) {
            console.error('데이터 복원 오류:', error);
            notificationManager.error('데이터 복원에 실패했습니다.');
            return false;
        }
    }
} 
