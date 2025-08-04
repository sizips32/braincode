import { Utils } from '../lib/utils.js';
import { notificationManager } from '../lib/notification.js';

export class ProphecyModel {
    constructor() {
        this.storageKey = 'prophecies';
        this.prophecies = [];
        this.load();
    }

    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = Utils.safeJsonParse(saved);
                if (parsed && Array.isArray(parsed)) {
                    this.prophecies = parsed;
                }
            }
        } catch (error) {
            console.error('예언 데이터 로드 실패:', error);
            notificationManager.error('예언 데이터를 불러오는데 실패했습니다.');
        }
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.prophecies));
        } catch (error) {
            console.error('예언 데이터 저장 실패:', error);
            notificationManager.error('예언 데이터를 저장하는데 실패했습니다.');
        }
    }

    getAll() {
        return this.prophecies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getById(id) {
        return this.prophecies.find(prophecy => prophecy.id === id);
    }

    saveProphecy(prophecyData) {
        try {
            const prophecy = {
                id: Date.now(),
                title: prophecyData.title || '',
                content: prophecyData.content || '',
                source: prophecyData.source || '',
                author: prophecyData.author || '',
                category: prophecyData.category || '일반',
                tags: prophecyData.tags || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.prophecies.push(prophecy);
            this.save();
            notificationManager.success('예언 글이 성공적으로 저장되었습니다.');
            return true;
        } catch (error) {
            console.error('예언 저장 실패:', error);
            notificationManager.error('예언 글을 저장하는데 실패했습니다.');
            return false;
        }
    }

    updateProphecy(id, updates) {
        const index = this.prophecies.findIndex(prophecy => prophecy.id === id);
        if (index !== -1) {
            this.prophecies[index] = {
                ...this.prophecies[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.save();
            notificationManager.success('예언 글이 성공적으로 수정되었습니다.');
            return true;
        }
        return false;
    }

    deleteProphecy(id) {
        const index = this.prophecies.findIndex(prophecy => prophecy.id === id);
        if (index !== -1) {
            this.prophecies.splice(index, 1);
            this.save();
            notificationManager.success('예언 글이 성공적으로 삭제되었습니다.');
            return true;
        }
        return false;
    }

    searchProphecies(query) {
        const searchTerm = query.toLowerCase();
        return this.prophecies.filter(prophecy =>
            prophecy.title.toLowerCase().includes(searchTerm) ||
            prophecy.content.toLowerCase().includes(searchTerm) ||
            prophecy.source.toLowerCase().includes(searchTerm) ||
            prophecy.author.toLowerCase().includes(searchTerm) ||
            prophecy.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    getByCategory(category) {
        return this.prophecies.filter(prophecy => prophecy.category === category);
    }

    getCategories() {
        return [...new Set(this.prophecies.map(prophecy => prophecy.category))];
    }

    getStats() {
        const total = this.prophecies.length;
        const categories = this.getCategories();
        const categoryStats = categories.map(category => ({
            category,
            count: this.getByCategory(category).length
        }));

        return {
            total,
            categories: categoryStats,
            recentCount: this.prophecies.filter(p => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(p.createdAt) > weekAgo;
            }).length
        };
    }

    validateProphecy(prophecyData) {
        const errors = [];

        if (!prophecyData.title || prophecyData.title.trim().length === 0) {
            errors.push('제목을 입력해주세요.');
        }

        if (!prophecyData.content || prophecyData.content.trim().length === 0) {
            errors.push('내용을 입력해주세요.');
        }

        if (!prophecyData.source || prophecyData.source.trim().length === 0) {
            errors.push('출처를 입력해주세요.');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    exportData() {
        return {
            prophecies: this.prophecies,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    importData(data) {
        try {
            if (data.prophecies && Array.isArray(data.prophecies)) {
                this.prophecies = data.prophecies;
                this.save();
                notificationManager.success('예언 데이터가 성공적으로 가져와졌습니다.');
                return true;
            }
            return false;
        } catch (error) {
            console.error('예언 데이터 가져오기 실패:', error);
            notificationManager.error('예언 데이터를 가져오는데 실패했습니다.');
            return false;
        }
    }
} 
