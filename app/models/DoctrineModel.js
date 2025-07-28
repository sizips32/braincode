import { Utils } from '../lib/utils.js';
import { notificationManager } from '../lib/notification.js';

export class DoctrineModel {
    constructor() {
        this.storageKey = 'doctrines';
        this.doctrines = this.getDefaultDoctrines();
        this.load();
    }

    // SDA 28개 기본교리 기본 데이터
    getDefaultDoctrines() {
        return [
            {
                id: 1,
                category: '하나님의 말씀',
                title: '성경',
                content: '성경은 하나님의 영감으로 기록된 말씀으로, 구원에 필요한 모든 진리의 완전한 계시입니다.',
                reference: '딤후 3:16-17, 벧후 1:20-21',
                order: 1
            },
            {
                id: 2,
                category: '하나님의 말씀',
                title: '삼위일체',
                content: '하나님은 한 분이시며, 성부, 성자, 성령의 세 위격으로 존재하십니다.',
                reference: '마 28:19, 고후 13:14',
                order: 2
            },
            {
                id: 3,
                category: '하나님의 말씀',
                title: '성부',
                content: '하나님 아버지는 전능하시고, 지혜로우시며, 사랑이 풍성하신 분이십니다.',
                reference: '요 3:16, 요 14:9',
                order: 3
            },
            {
                id: 4,
                category: '하나님의 말씀',
                title: '성자',
                content: '예수 그리스도는 영원하신 하나님의 아들이시며, 육신을 입고 인간이 되셨습니다.',
                reference: '요 1:1-14, 히 1:1-3',
                order: 4
            },
            {
                id: 5,
                category: '하나님의 말씀',
                title: '성령',
                content: '성령은 하나님의 영이시며, 그리스도의 사역을 계속하시고 교회를 인도하십니다.',
                reference: '요 14:16-17, 행 1:8',
                order: 5
            },
            {
                id: 6,
                category: '창조',
                title: '창조',
                content: '하나님은 육일 동안에 천지만물을 창조하셨고, 일곱째 날에 안식하셨습니다.',
                reference: '창 1:1-2:3, 출 20:8-11',
                order: 6
            },
            {
                id: 7,
                category: '인간의 본성',
                title: '인간의 본성',
                content: '인간은 하나님의 형상대로 창조되었으며, 몸과 영혼과 영으로 구성되어 있습니다.',
                reference: '창 1:26-27, 살전 5:23',
                order: 7
            },
            {
                id: 8,
                category: '대쟁투',
                title: '대쟁투',
                content: '전 우주는 선과 악 사이의 대쟁투의 무대이며, 이는 하늘에서 시작되어 지구에서 계속됩니다.',
                reference: '계 12:7-9, 사 14:12-14',
                order: 8
            },
            {
                id: 9,
                category: '그리스도의 생애',
                title: '그리스도의 생애',
                content: '예수 그리스도는 성령으로 잉태되어 동정녀 마리아에게서 태어나셨습니다.',
                reference: '마 1:18-25, 눅 1:26-35',
                order: 9
            },
            {
                id: 10,
                category: '그리스도의 생애',
                title: '그리스도의 죽음',
                content: '예수 그리스도는 우리의 죄를 대신하여 십자가에서 죽으셨습니다.',
                reference: '사 53:4-6, 요 3:16',
                order: 10
            },
            {
                id: 11,
                category: '그리스도의 생애',
                title: '그리스도의 부활',
                content: '예수 그리스도는 죽음에서 부활하셨고, 하늘에 올라가셨습니다.',
                reference: '마 28:1-10, 행 1:9-11',
                order: 11
            },
            {
                id: 12,
                category: '구원',
                title: '구원의 경험',
                content: '구원은 하나님의 은혜로 말미암아 그리스도를 통하여 받는 선물입니다.',
                reference: '엡 2:8-9, 요 3:16',
                order: 12
            },
            {
                id: 13,
                category: '구원',
                title: '성장',
                content: '그리스도인은 그리스도의 은혜로 말미암아 하나님의 형상으로 변화됩니다.',
                reference: '고후 3:18, 빌 2:12-13',
                order: 13
            },
            {
                id: 14,
                category: '교회',
                title: '교회',
                content: '교회는 그리스도의 몸이며, 모든 시대와 민족의 신자들로 구성됩니다.',
                reference: '엡 1:22-23, 고전 12:12-27',
                order: 14
            },
            {
                id: 15,
                category: '교회',
                title: '남은 자',
                content: '남은 자는 마지막 시대에 하나님의 계명과 예수의 증거를 지키는 자들입니다.',
                reference: '계 12:17, 계 14:12',
                order: 15
            },
            {
                id: 16,
                category: '교회',
                title: '연합',
                content: '교회는 그리스도 안에서 하나로 연합되어 있습니다.',
                reference: '요 17:20-23, 엡 4:3-6',
                order: 16
            },
            {
                id: 17,
                category: '침례',
                title: '침례',
                content: '침례는 그리스도와 함께 죽고 부활함을 상징하는 성례입니다.',
                reference: '마 28:19-20, 롬 6:3-6',
                order: 17
            },
            {
                id: 18,
                category: '성찬',
                title: '성찬',
                content: '성찬은 그리스도의 죽음을 기념하는 성례입니다.',
                reference: '마 26:26-28, 고전 11:23-26',
                order: 18
            },
            {
                id: 19,
                category: '영적 은사',
                title: '영적 은사',
                content: '하나님은 모든 신자에게 영적 은사를 주어 교회를 세우십니다.',
                reference: '고전 12:1-11, 엡 4:11-12',
                order: 19
            },
            {
                id: 20,
                category: '영적 은사',
                title: '예언의 은사',
                content: '예언의 은사는 하나님의 특별한 계시를 통해 교회를 인도합니다.',
                reference: '엡 4:11, 계 19:10',
                order: 20
            },
            {
                id: 21,
                category: '하나님의 율법',
                title: '하나님의 율법',
                content: '하나님의 율법은 하나님의 성품을 나타내며, 그리스도인의 삶의 표준입니다.',
                reference: '출 20:1-17, 시 19:7-11',
                order: 21
            },
            {
                id: 22,
                category: '안식일',
                title: '안식일',
                content: '안식일은 하나님의 창조와 구원의 기념일이며, 그리스도와의 교제의 시간입니다.',
                reference: '출 20:8-11, 막 2:27-28',
                order: 22
            },
            {
                id: 23,
                category: '청지기 직분',
                title: '청지기 직분',
                content: '우리는 하나님의 청지기로서 시간, 재능, 물질을 하나님의 영광을 위해 사용합니다.',
                reference: '창 1:26-28, 말 3:8-10',
                order: 23
            },
            {
                id: 24,
                category: '그리스도인의 행위',
                title: '그리스도인의 행위',
                content: '그리스도인은 하나님의 은혜에 합당한 삶을 살아야 합니다.',
                reference: '엡 2:8-10, 약 2:14-26',
                order: 24
            },
            {
                id: 25,
                category: '결혼과 가정',
                title: '결혼과 가정',
                content: '결혼은 하나님께서 제정하신 제도이며, 가정은 교회의 기초입니다.',
                reference: '창 2:18-25, 엡 5:21-33',
                order: 25
            },
            {
                id: 26,
                category: '하늘 성소',
                title: '하늘 성소',
                content: '하늘 성소는 그리스도의 중보 사역의 중심지입니다.',
                reference: '히 8:1-2, 히 9:11-12',
                order: 26
            },
            {
                id: 27,
                category: '심판',
                title: '심판',
                content: '하나님은 모든 사람을 심판하시며, 의로운 자에게는 생명을, 악한 자에게는 죽음을 주십니다.',
                reference: '계 20:11-15, 요 5:28-29',
                order: 27
            },
            {
                id: 28,
                category: '그리스도의 재림',
                title: '그리스도의 재림',
                content: '예수 그리스도는 영광 중에 재림하셔서 구원받은 자들을 데려가시고, 악한 자들을 심판하십니다.',
                reference: '요 14:1-3, 살전 4:16-17',
                order: 28
            }
        ];
    }

    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = Utils.safeJsonParse(saved);
                if (parsed && Array.isArray(parsed)) {
                    this.doctrines = parsed;
                }
            }
        } catch (error) {
            console.error('교리 데이터 로드 실패:', error);
            notificationManager.showError('교리 데이터를 불러오는데 실패했습니다.');
        }
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.doctrines));
        } catch (error) {
            console.error('교리 데이터 저장 실패:', error);
            notificationManager.showError('교리 데이터를 저장하는데 실패했습니다.');
        }
    }

    getAll() {
        return this.doctrines;
    }

    getByCategory(category) {
        return this.doctrines.filter(doctrine => doctrine.category === category);
    }

    getById(id) {
        return this.doctrines.find(doctrine => doctrine.id === id);
    }

    getCategories() {
        return [...new Set(this.doctrines.map(doctrine => doctrine.category))];
    }

    updateDoctrine(id, updates) {
        const index = this.doctrines.findIndex(doctrine => doctrine.id === id);
        if (index !== -1) {
            this.doctrines[index] = { ...this.doctrines[index], ...updates };
            this.save();
            return true;
        }
        return false;
    }

    resetToDefault() {
        this.doctrines = this.getDefaultDoctrines();
        this.save();
        notificationManager.showSuccess('교리가 기본값으로 초기화되었습니다.');
    }

    exportData() {
        return {
            doctrines: this.doctrines,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    importData(data) {
        try {
            if (data.doctrines && Array.isArray(data.doctrines)) {
                this.doctrines = data.doctrines;
                this.save();
                notificationManager.showSuccess('교리 데이터가 성공적으로 가져와졌습니다.');
                return true;
            }
            return false;
        } catch (error) {
            console.error('교리 데이터 가져오기 실패:', error);
            notificationManager.showError('교리 데이터를 가져오는데 실패했습니다.');
            return false;
        }
    }
} 
