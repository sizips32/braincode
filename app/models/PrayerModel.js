import { Utils } from '../lib/utils.js';
import { notificationManager } from '../lib/notification.js';

export class PrayerModel {
    constructor(type) {
        this.type = type; // 'meditation' 또는 'intercessory'
        this.storageKey = `${type}Prayers`;
        this.prayers = this.load();
    }

    // 데이터 로드
    load() {
        return Utils.storage.get(this.storageKey, []);
    }

    // 데이터 저장
    save() {
        return Utils.storage.set(this.storageKey, this.prayers);
    }

    // 모든 기도 조회
    getAll() {
        return [...this.prayers];
    }

    // ID로 기도 조회
    getById(id) {
        return this.prayers.find(p => p.id === id) || null;
    }

    // 응답된 기도 조회
    getAnswered() {
        return this.prayers.filter(p => p.answered);
    }

    // 진행중인 기도 조회
    getOngoing() {
        return this.prayers.filter(p => !p.answered);
    }

    // 기도 저장
    savePrayer(prayerData) {
        try {
            // 데이터 검증
            if (!this.validatePrayer(prayerData)) {
                throw new Error('기도 데이터가 유효하지 않습니다.');
            }

            const newPrayer = {
                ...prayerData,
                id: Date.now(),
                type: this.type,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                answered: false
            };

            this.prayers.unshift(newPrayer); // 최신순으로 맨 앞에 추가

            if (this.save()) {
                notificationManager.success('기도가 성공적으로 저장되었습니다.');
                return newPrayer;
            } else {
                throw new Error('저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('기도 저장 오류:', error);
            notificationManager.error('저장 중 오류가 발생했습니다.');
            throw error;
        }
    }

    // 기도 수정
    updatePrayer(id, updateData) {
        try {
            const index = this.prayers.findIndex(p => p.id === id);
            if (index === -1) {
                throw new Error('수정할 기도를 찾을 수 없습니다.');
            }

            this.prayers[index] = {
                ...this.prayers[index],
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            if (this.save()) {
                notificationManager.success('기도가 수정되었습니다.');
                return this.prayers[index];
            } else {
                throw new Error('수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('기도 수정 오류:', error);
            notificationManager.error('수정 중 오류가 발생했습니다.');
            throw error;
        }
    }

    // 기도 삭제
    deletePrayer(id) {
        try {
            const initialLength = this.prayers.length;
            this.prayers = this.prayers.filter(p => p.id !== id);

            if (this.prayers.length < initialLength) {
                if (this.save()) {
                    notificationManager.success('기도가 삭제되었습니다.');
                    return true;
                }
            }

            throw new Error('삭제할 기도를 찾을 수 없습니다.');
        } catch (error) {
            console.error('기도 삭제 오류:', error);
            notificationManager.error('삭제 중 오류가 발생했습니다.');
            return false;
        }
    }

    // 기도 응답 상태 토글
    toggleAnswered(id) {
        try {
            const prayer = this.prayers.find(p => p.id === id);
            if (!prayer) {
                throw new Error('기도를 찾을 수 없습니다.');
            }

            prayer.answered = !prayer.answered;
            prayer.updatedAt = new Date().toISOString();

            if (this.save()) {
                const status = prayer.answered ? '응답됨' : '진행중';
                notificationManager.success(`기도가 ${status}으로 변경되었습니다.`);
                return prayer;
            } else {
                throw new Error('상태 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('기도 상태 변경 오류:', error);
            notificationManager.error('상태 변경 중 오류가 발생했습니다.');
            throw error;
        }
    }

    // 검색
    search(query) {
        if (!query || query.trim() === '') {
            return [];
        }

        const searchTerm = query.toLowerCase().trim();

        return this.prayers.filter(prayer =>
            prayer.title.toLowerCase().includes(searchTerm) ||
            prayer.content.toLowerCase().includes(searchTerm) ||
            (prayer.target && prayer.target.toLowerCase().includes(searchTerm))
        );
    }

    // 페이지네이션
    getPaginated(page = 1, itemsPerPage = 10) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedPrayers = this.prayers.slice(startIndex, endIndex);
        const totalPages = Math.ceil(this.prayers.length / itemsPerPage);

        return {
            prayers: paginatedPrayers,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: this.prayers.length,
                itemsPerPage,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    }

    // 통계 정보
    getStats() {
        const total = this.prayers.length;
        const answered = this.getAnswered().length;
        const ongoing = this.getOngoing().length;

        return {
            total,
            answered,
            ongoing,
            answerRate: total > 0 ? Math.round((answered / total) * 100) : 0
        };
    }

    // 데이터 검증
    validatePrayer(data) {
        const required = ['title', 'content'];

        for (const field of required) {
            if (!data[field] || data[field].trim() === '') {
                return false;
            }
        }

        // 중보 기도의 경우 target 필드도 필요
        if (this.type === 'intercessory' && (!data.target || data.target.trim() === '')) {
            return false;
        }

        return true;
    }

    // 데이터 백업
    exportData() {
        return JSON.stringify(this.prayers, null, 2);
    }

    // 데이터 복원
    importData(jsonData) {
        try {
            const data = Utils.safeJsonParse(jsonData);
            if (Array.isArray(data)) {
                this.prayers = data;
                if (this.save()) {
                    notificationManager.success('기도 데이터가 성공적으로 복원되었습니다.');
                    return true;
                }
            }
            throw new Error('잘못된 데이터 형식입니다.');
        } catch (error) {
            console.error('기도 데이터 복원 오류:', error);
            notificationManager.error('데이터 복원에 실패했습니다.');
            return false;
        }
    }
} 
