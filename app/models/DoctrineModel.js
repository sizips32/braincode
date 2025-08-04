import { Utils } from '../lib/utils.js';
import { notificationManager } from '../lib/notification.js';

export class DoctrineModel {
    constructor() {
        this.storageKey = 'doctrines';
        this.doctrines = this.getDefaultDoctrines();
        this.load();
    }

    // SDA 28개 기본교리 공식 데이터 (상세 버전)
    getDefaultDoctrines() {
        return [
            {
                id: 1,
                category: '성경',
                title: '성경',
                content: '성경은 구약과 신약 성경으로 이루어져 있으며, 하나님의 감동으로 기록된 무오한 계시의 말씀이다. 성경은 하나님의 뜻을 나타내며, 그리스도인의 신앙과 행위에 관한 권위 있는 계시이며, 하나님의 성품과 그분의 백성들에게 대한 뜻을 계시한다.',
                reference: '시 119:105, 잠 30:5-6, 사 8:20, 요 17:17, 딤후 3:16-17, 히 4:12, 벧후 1:20-21',
                detailUrl: 'https://app.scrintal.com/app/doc/bv4k578em8g619dfxtehq3y73q',
                order: 1
            },
            {
                id: 2,
                category: '하나님',
                title: '삼위일체',
                content: '하나님은 한 분이시나 성부, 성자, 성령의 세 위격으로 계시는 삼위일체이시다. 이 세 분은 동등하시고 영원하시며, 각각 구별되시지만 본질과 성품, 목적에 있어서는 하나이시다. 하나님은 불멸이시고, 전능하시며, 전지하시고, 지극히 높으시며, 무한하시다.',
                reference: '신 6:4, 마 28:19, 고후 13:14, 엡 4:4-6, 벧전 1:2, 딤전 1:17, 계 14:7',
                detailUrl: 'https://app.scrintal.com/app/doc/d15bv4ce48js4ahva0h3vmsvcf',
                order: 2
            },
            {
                id: 3,
                category: '하나님',
                title: '성부 하나님',
                content: '하나님 아버지는 영원하신 아버지이시며, 만물의 창조주요, 근원이요, 유지자요, 주권자이시다. 그분은 의로우시고 거룩하시며, 자비로우시고 은혜로우시며, 노하기를 더디 하시고 인자와 진리가 풍성하시다.',
                reference: '창 1:1, 신 4:35, 시 110:1, 110:4, 요 3:16, 17:3, 엡 4:6, 딤전 1:17',
                detailUrl: 'https://app.scrintal.com/app/doc/9z30aqaxt2k6rawdzntnwcdjsr',
                order: 3
            },
            {
                id: 4,
                category: '하나님',
                title: '성자 하나님',
                content: '하나님의 영원하신 아들 예수 그리스도는 성령으로 잉태되어 동정녀 마리아에게서 나시고, 완전한 하나님이시며 동시에 완전한 인간이시다. 그분은 33년 반 동안 이 땅에서 사시며 십자가에서 우리 죄를 위해 죽으시고 무덤에서 부활하사 하늘로 승천하시어 우리를 위해 중보하고 계신다.',
                reference: '사 53:4-6, 마 1:21-23, 요 1:1-3, 14, 5:22, 10:30, 14:1-3, 롬 6:23, 고전 15:3-4, 히 2:9-18, 8:1-2',
                detailUrl: 'https://app.scrintal.com/app/doc/01k4mchar2jcs8q7c4srekqc0y',
                order: 4
            },
            {
                id: 5,
                category: '하나님',
                title: '성령 하나님',
                content: '하나님 성령께서는 창조와 성육신과 속죄에 있어서 성부, 성자와 함께 적극적인 역할을 담당하셨다. 성령께서는 사람들을 감동시켜 성경을 기록하게 하셨고, 그리스도의 생애에 능력을 주셨으며, 사람들을 이끌어 죄를 회개하게 하시고, 성화시키시며, 교회를 인도하신다.',
                reference: '창 1:1-2, 눅 1:35, 4:18, 행 10:38, 고후 3:18, 엡 4:30, 딤후 3:16, 히 9:14, 벧후 1:21',
                detailUrl: 'https://app.scrintal.com/app/doc/7dzhpgeqyeh8v94maydzkwgjd4',
                order: 5
            },
            {
                id: 6,
                category: '창조',
                title: '창조',
                content: '하나님은 우주와 지구상의 모든 생물을 최근에 6일 동안에 창조하시고 최초의 안식일을 제정하셨다. 성경의 창조 기사는 문자 그대로 받아들여야 하며, 창조는 하나님의 능력의 직접적인 행위였다. 인간은 남자와 여자로 하나님의 형상대로 창조되었다.',
                reference: '창 1:1-2:25, 출 20:8-11, 시 33:6, 9, 104:1-35, 히 11:3',
                detailUrl: 'https://app.scrintal.com/app/doc/a8fs8ewkmck9gbwqvw96pv5g44',
                order: 6
            },
            {
                id: 7,
                category: '인간',
                title: '인간의 본성',
                content: '남자와 여자는 하나님의 형상대로 개성을 가지고 창조되었으며, 생각하고 느끼고 행동할 수 있는 능력과 도덕적 자유를 부여받았다. 하나님의 형상대로 창조되었지만, 인간은 분리할 수 없는 몸과 마음과 영혼의 연합체이다. 사람이 죽으면, 이 연합체가 해체되고 의식이 없는 상태가 된다.',
                reference: '창 1:26-28, 2:7, 시 8:4-8, 행 17:24-28, 고전 15:45-49, 살전 5:23',
                detailUrl: 'https://app.scrintal.com/app/doc/2x9g5ee7tphs88nxtmjsxtd3nz',
                order: 7
            },
            {
                id: 8,
                category: '죄와 구원',
                title: '대쟁투',
                content: '온 인류는 그리스도와 사단 사이에서 벌어지는 대쟁투에 연루되어 있다. 이 쟁투는 하나님의 율법의 성격을 중심으로 하늘에서 시작되었다. 사단은 하나님의 율법을 변경할 수 있고 또 변경되어야 한다고 주장하는 반면, 그리스도는 율법의 불변성과 구속력을 입증하신다.',
                reference: '계 12:4-9, 사 14:12-14, 결 28:12-18, 창 3:1-15, 롬 1:19-32, 5:12-21, 8:19-22, 히 1:4-14, 벧후 3:6',
                detailUrl: 'https://app.scrintal.com/app/doc/2me7e42phtj93bdegp4rpr72g6',
                order: 8
            },
            {
                id: 9,
                category: '죄와 구원',
                title: '그리스도의 생애, 죽음, 부활',
                content: '그리스도의 완전한 생애와 대속적 죽음과 부활은 인간 구원을 위한 유일한 방법이다. 이러한 구원을 통해 그분을 믿는 자들의 죄가 용서받고, 영생이 보장되며, 하나님과 화목하게 된다. 성령의 능력으로 거듭나야 하고, 성품이 새롭게 되어야 하며, 그리스도의 형상대로 변화되어야 한다.',
                reference: '요 3:16, 롬 3:25, 고전 15:3-4, 고후 5:14-15, 19-21, 요일 2:2, 4:10',
                detailUrl: 'https://app.scrintal.com/app/doc/bdahd2ngejjh19xar296dke87a',
                order: 9
            },
            {
                id: 10,
                category: '죄와 구원',
                title: '구원의 경험',
                content: '하나님은 무한한 사랑과 자비로 죄인인 우리를 위해 그리스도로 하여금 우리의 죄가 되게 하사 우리로 그 안에서 하나님의 의가 되게 하셨다. 성령의 인도하심을 받아 우리는 자신의 죄 많은 상태를 깨닫고, 죄를 회개하고, 예수를 주와 그리스도로 믿게 된다.',
                reference: '시 51:1-10, 사 55:7, 겸 36:25-27, 요 3:3-8, 행 2:38-39, 롬 8:5-8, 고후 5:17, 갈 3:26, 엡 2:4-10, 골 3:9-10',
                detailUrl: 'https://app.scrintal.com/app/doc/2f1m368636hxmafn4zbp5e895s',
                order: 10
            },
            {
                id: 11,
                category: '죄와 구원',
                title: '그리스도 안에서 자라감',
                content: '예수를 주로 받아들임으로써 우리는 죄의 지배에서 해방되고, 죄의 죄책과 형벌과 세력에서 자유롭게 된다. 이 새로운 출생으로 우리는 새로운 성품을 받고 새로운 생각과 새로운 마음과 새로운 목적을 갖게 되며, 성령께서 우리 안에서 그리스도의 성품을 재창조하신다.',
                reference: '시 1:1-3, 23:4, 77:11-12, 마 20:25-28, 요 20:21, 갈 5:22-25, 엡 4:7-16, 빌 3:7-14, 골 1:28, 벧후 2:9, 요일 2:6',
                detailUrl: 'https://app.scrintal.com/app/doc/ehhkjyrqr8gcwa0815e862fmdr',
                order: 11
            },
            {
                id: 12,
                category: '교회',
                title: '교회',
                content: '교회는 예수 그리스도를 주와 구주로 고백하는 신자들의 공동체이다. 우리는 구약의 하나님의 백성들의 연속선상에서 그리스도에게로 부름을 받아 세상에서 나와 함께 예배하고, 교제하고, 말씀을 공부하고, 성찬에 참여하고, 온 인류에게 봉사하며, 온 세계에 복음을 전파한다.',
                reference: '창 12:3, 행 7:38, 엡 4:11-15, 3:8-11, 마 28:19-20, 16:13-20, 18:18, 고전 1:2, 12:13-27',
                detailUrl: 'https://app.scrintal.com/app/doc/frdvs6ksfrke7b94rsg2pnta52',
                order: 12
            },
            {
                id: 13,
                category: '교회',
                title: '남은 자손과 그들의 사명',
                content: '만민 교회는 마지막 때에 하나님의 계명과 예수 믿음을 지키는 남은 자손으로 구성된다. 이 남은 자손은 그리스도의 재림이 임박했음을 선포하고, 계시록 14장에 묘사된 심판의 시간과 삼천사의 기별을 선포한다.',
                reference: '계 12:17, 14:6-12, 18:1-4, 고후 5:10, 유 3, 14, 계 21:1-14',
                detailUrl: 'https://app.scrintal.com/app/doc/8196h5adc6hrtbjj9y3656ppm5',
                order: 13
            },
            {
                id: 14,
                category: '교회',
                title: '그리스도의 몸 안에서의 연합',
                content: '교회는 여러 지체를 가진 한 몸이며, 여러 민족과 언어와 백성과 나라에서 부름을 받았다. 그리스도 안에서 우리는 새로운 창조물이다. 인종, 문화, 학식, 국적, 사회경제적 지위의 차이는 우리 사이에 분열을 가져와서는 안 된다.',
                reference: '시 133:1, 마 28:19-20, 요 17:20-23, 행 17:26-27, 롬 12:4-5, 고전 12:12-14, 고후 5:16-17, 갈 3:27-29, 엡 2:13-16, 4:3-6, 골 3:10-15',
                detailUrl: 'https://app.scrintal.com/app/doc/dkb8bj3700jz283h07d5efkrc4',
                order: 14
            },
            {
                id: 15,
                category: '성례',
                title: '침례',
                content: '침례는 예수 그리스도의 죽음과 부활에 동참하는 상징이다. 침례는 죄에 대해 죽고 새 생명을 시작한다는 것을 상징한다. 침례는 예수 그리스도를 주와 구주로 믿는 신앙을 따르며, 회개와 죄 사함의 증거이다. 침례는 물에 완전히 잠기는 방법으로 행해진다.',
                reference: '마 28:19-20, 행 2:38, 롬 6:1-6, 갈 3:27, 골 2:12-13',
                order: 15
            },
            {
                id: 16,
                category: '성례',
                title: '성찬',
                content: '성찬은 예수 그리스도의 죽으심을 기념하는 예식으로, 모든 신자가 그분의 재림까지 참여해야 한다. 성찬을 위한 준비에는 자기 성찰, 회개, 고백이 포함된다. 주인이신 그리스도께서 친히 임재하셔서 당신의 백성들을 위로하시고 힘을 주신다.',
                reference: '마 26:17-30, 요 13:1-17, 고전 10:16-17, 11:23-30, 계 3:20',
                order: 16
            },
            {
                id: 17,
                category: '영적 은사와 봉사',
                title: '영적 은사와 봉사',
                content: '하나님은 모든 시대의 당신의 교회에 영적 은사들을 베풀어 주신다. 이런 은사들은 성령의 나타나심이며, 교회의 복리와 인류에 대한 봉사를 위하여, 그리고 특별히 세계에 복음을 전파하고 교회를 굳게 세우기 위하여 주어진다.',
                reference: '롬 12:4-8, 고전 12:9-11, 27-28, 엡 4:8, 11-16, 행 6:1-7, 딤전 3:1-13, 벧전 4:10-11',
                order: 17
            },
            {
                id: 18,
                category: '영적 은사와 봉사',
                title: '예언의 은사',
                content: '성경에서 말하는 예언의 은사는 제칠일안식일예수재림교회의 표징 중 하나이며, 교회의 남은 자손 가운데서 나타났다. 이 은사는 엘렌 G. 화잇의 봉사 사역에서 나타났으며, 그녀의 글들은 성경에 대한 권위 있는 근거이며, 하나님의 뜻에 대한 지속적이고 권위 있는 안내자이다.',
                reference: '민 12:6, 대하 20:20, 암 3:7, 욕 2:28-29, 엡 4:11-14, 계 12:17, 19:10',
                order: 18
            },
            {
                id: 19,
                category: '기독교 생활',
                title: '하나님의 율법',
                content: '하나님의 율법의 위대한 원칙들은 십계명에 구현되어 있고, 그리스도의 생애에서 예시되었다. 이 원칙들은 하나님의 사랑과 뜻과 목적을 표현하며, 모든 시대 모든 상황에서 인간의 행위와 관계에 대한 하나님의 변하지 않는 규준이다.',
                reference: '출 20:1-17, 마 5:17-20, 신 28:1-14, 시 40:7-8, 히 8:8-10, 요일 5:3, 롬 8:3-4, 엡 2:8-10',
                order: 19
            },
            {
                id: 20,
                category: '기독교 생활',
                title: '안식일',
                content: '사랑이 많으신 창조주께서는 모든 사람을 위하여 일곱째 날 안식일을 제정하시고 창조 사업의 기념일과 구속의 표징으로 삼으셨다. 안식일은 하나님과 그분의 백성 사이의 기쁨의 교제와 예배의 날이며, 모든 세대를 위한 하나님의 은혜로운 계약의 상징이다.',
                reference: '창 2:1-3, 출 20:8-11, 31:13-17, 눅 4:16, 히 4:1-11, 신 5:12-15, 사 56:5-6, 58:13-14, 겸 20:12, 20, 막 1:32, 2:27-28',
                order: 20
            },
            {
                id: 21,
                category: '기독교 생활',
                title: '청지기 직분',
                content: '우리는 하나님의 청지기이며, 그분께서 맡겨 주신 시간과 기회, 능력과 소유, 그리고 지구의 축복과 자원들에 대하여 그분께 책임을 져야 한다. 우리는 하나님의 소유권을 인정하고 충성된 청지기 직분을 통하여 그분과 다른 사람들을 섬겨야 한다.',
                reference: '창 1:26-28, 2:15, 대상 29:14, 학 1:3-11, 말 3:8-12, 마 23:23, 롬 15:27, 고전 9:9-14, 고후 8:1-15, 9:7',
                order: 21
            },
            {
                id: 22,
                category: '기독교 생활',
                title: '그리스도인의 행위',
                content: '우리는 하나님의 자녀로서 그분의 거룩한 성품에 참여하는 자가 되어야 한다. 따라서 우리의 오락과 행위는 그리스도인의 양심의 지극히 높은 기준에 부합되어야 한다. 우리의 몸은 성령의 전이므로 우리는 하나님의 영광을 위하여 지혜롭게 돌보아야 한다.',
                reference: '롬 12:1-2, 고전 6:19-20, 10:31, 엡 5:1-21, 빌 4:8, 딤전 2:9-10, 요일 2:6, 3:1-3',
                order: 22
            },
            {
                id: 23,
                category: '기독교 생활',
                title: '결혼과 가정',
                content: '결혼은 하나님께서 에덴에서 제정하시고 예수님께서 확증하신 제도이며, 남자와 여자가 사랑하는 동반자로서 연합하는 것이다. 그리스도인들에게 결혼 서약은 같은 신앙을 가진 사람과 맺어야 한다. 상호간의 사랑과 존경과 책임은 그 관계의 조직이다.',
                reference: '창 2:18-25, 마 19:3-9, 요 2:1-11, 고후 6:14, 엡 5:21-33, 마 5:31-32, 말 2:14-16, 고전 7:10-11',
                order: 23
            },
            {
                id: 24,
                category: '그리스도의 재림과 마지막 사건들',
                title: '그리스도의 사역',
                content: '하늘 성소에는 지상 성소의 원형이 있다. 그리스도는 우리의 대제사장으로서 하늘 성소에서 우리를 위하여 중보 사역을 행하고 계시며, 십자가에서 일단 드린 제물의 유익을 신자들이 받을 수 있게 하신다. 1844년에 그리스도는 지상 역사의 마지막 단계인 속죄 사역을 시작하셨다.',
                reference: '레 16장, 히 8:1-5, 9:11-28, 단 7:9-27, 8:13-14, 9:24-27, 민 14:34, 겸 4:6, 말 3:1, 계 8:3-5, 11:19, 14:6-7, 20:12, 22:12',
                order: 24
            },
            {
                id: 25,
                category: '그리스도의 재림과 마지막 사건들',
                title: '그리스도의 재림',
                content: '그리스도의 재림은 그리스도인의 복된 소망이며, 복음의 대절정이다. 구주의 강림은 문자 그대로, 개인적이고, 눈에 보이며, 온 세계적인 사건이 될 것이다. 그리스도께서 오실 때 죽었던 의인들이 부활할 것이고, 살아 있는 의인들과 함께 영화롭게 되어 하늘로 옮겨질 것이다.',
                reference: '딘 2:13, 히 9:28, 요 14:1-3, 행 1:9-11, 고전 15:51-54, 살전 4:13-18, 5:23, 계 1:7, 19:11-14, 20:1-10',
                order: 25
            },
            {
                id: 26,
                category: '그리스도의 재림과 마지막 사건들',
                title: '죽음과 부활',
                content: '죄의 삯은 죽음이다. 그러나 모든 생명의 근원이신 하나님께서는 당신의 아들을 통하여 신자들에게 영생을 주실 것이다. 그리스도의 재림까지 죽은 자들은 무의식 상태로 잠들어 있다. 의인이든 악인이든 죽은 자들은 무덤에서 나올 때까지 의식이 없는 상태에 있다.',
                reference: '롬 6:23, 딤전 6:15-16, 전 9:5-6, 시 146:3-4, 요 11:11-14, 골 3:4, 고전 15:51-54, 살전 4:13-17, 요 5:28-29, 계 20:1-10',
                order: 26
            },
            {
                id: 27,
                category: '그리스도의 재림과 마지막 사건들',
                title: '천년기와 죄의 종말',
                content: '천년기는 그리스도의 재림과 셋째 부활 사이의 천 년 기간이다. 이 기간 동안 악한 죽은 자들은 심판을 받고, 지구는 완전히 황폐하게 되며 사람이 살지 않게 된다. 천년기가 끝날 때 그리스도는 성도들과 거룩한 성과 함께 하늘에서 지상으로 내려오신다.',
                reference: '계 20장, 고전 6:2-3, 렘 4:23-26, 계 21:1-5, 말 4:1, 겸 28:18-19',
                order: 27
            },
            {
                id: 28,
                category: '그리스도의 재림과 마지막 사건들',
                title: '새 땅',
                content: '새 하늘과 새 땅에서 구속받은 자들은 영원히 살 것이며, 하나님의 영원한 목적이 성취될 것이다. 거기서는 죄와 죽음이 없어지고, 고통과 슬픔이 없으며, 하나님께서 당신의 백성과 함께 영원히 거하실 것이다. 대쟁투는 영원히 끝나고 죄는 더 이상 없을 것이다.',
                reference: '벧후 3:13, 창 17:7-8, 사 35장, 65:17-25, 마 5:5, 계 21:1-7, 22:1-5, 11:15',
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

    // 교리 상세 내용 URL 목록 저장
    saveDoctrineUrl(id, url) {
        console.log('DoctrineModel.saveDoctrineUrl 호출:', { id, url });
        
        const index = this.doctrines.findIndex(doctrine => doctrine.id === id);
        console.log('교리 인덱스:', index);
        
        if (index !== -1) {
            // URL 목록 초기화 (없는 경우)
            if (!this.doctrines[index].urlList) {
                this.doctrines[index].urlList = [];
                console.log('URL 목록 초기화됨');
            }
            
            // 중복 URL 체크
            const existingUrl = this.doctrines[index].urlList.find(item => item.url === url);
            if (existingUrl) {
                console.log('중복 URL 발견:', url);
                notificationManager.showError('이미 저장된 URL입니다.');
                return false;
            }
            
            // 새 URL 추가
            const newUrlItem = {
                id: Date.now().toString(),
                url: url,
                addedAt: new Date().toISOString(),
                title: this.extractTitleFromUrl(url)
            };
            
            console.log('새 URL 항목 생성:', newUrlItem);
            
            this.doctrines[index].urlList.push(newUrlItem);
            
            // 기존 coreUrl도 유지 (하위 호환성)
            this.doctrines[index].coreUrl = url;
            
            this.save();
            console.log('URL 저장 완료, 현재 목록:', this.doctrines[index].urlList);
            
            notificationManager.showSuccess('URL이 저장되었습니다.');
            return true;
        }
        
        console.error('교리를 찾을 수 없음:', id);
        return false;
    }

    // 교리 상세 내용 URL 목록 가져오기
    getDoctrineUrlList(id) {
        const doctrine = this.getById(id);
        return doctrine ? (doctrine.urlList || []) : [];
    }

    // 교리 상세 내용 URL 가져오기 (하위 호환성)
    getDoctrineUrl(id) {
        const doctrine = this.getById(id);
        return doctrine ? doctrine.coreUrl : null;
    }

    // 교리 상세 내용 URL 삭제
    removeDoctrineUrl(id, urlId = null) {
        const index = this.doctrines.findIndex(doctrine => doctrine.id === id);
        if (index !== -1) {
            if (urlId && this.doctrines[index].urlList) {
                // 특정 URL 삭제
                this.doctrines[index].urlList = this.doctrines[index].urlList.filter(item => item.id !== urlId);
                
                // URL 목록이 비어있으면 coreUrl도 삭제
                if (this.doctrines[index].urlList.length === 0) {
                    delete this.doctrines[index].coreUrl;
                } else {
                    // 첫 번째 URL을 coreUrl로 설정
                    this.doctrines[index].coreUrl = this.doctrines[index].urlList[0].url;
                }
            } else {
                // 전체 URL 삭제 (하위 호환성)
                delete this.doctrines[index].coreUrl;
                delete this.doctrines[index].urlList;
            }
            
            this.save();
            notificationManager.showSuccess('URL이 삭제되었습니다.');
            return true;
        }
        return false;
    }

    // URL에서 제목 추출
    extractTitleFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;
            const pathname = urlObj.pathname;
            
            // 도메인에서 제목 추출
            let title = hostname.replace('www.', '');
            
            // 경로가 있으면 추가
            if (pathname && pathname !== '/') {
                const pathParts = pathname.split('/').filter(part => part);
                if (pathParts.length > 0) {
                    title += ' - ' + pathParts[pathParts.length - 1].replace(/[-_]/g, ' ');
                }
            }
            
            return title;
        } catch (e) {
            return '알 수 없는 페이지';
        }
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
