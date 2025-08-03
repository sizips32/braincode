export const bibleStructure = {
    oldTestament: {
        title: '구약',
        info: '(총 929장 23,145절)',
        categories: {
            pentateuch: {
                title: '모세오경',
                books: [
                    { name: '창세기', info: '50장 1,533절' },
                    { name: '출애굽기', info: '40장 1,213절' },
                    { name: '레위기', info: '27장 859절' },
                    { name: '민수기', info: '36장 1,288절' },
                    { name: '신명기', info: '34장 959절' }
                ]
            },
            historical: {
                title: '역사서',
                books: [
                    { name: '여호수아', info: '24장 658절' },
                    { name: '사사기', info: '21장 618절' },
                    { name: '룻기', info: '4장 85절' },
                    { name: '사무엘상', info: '31장 810절' },
                    { name: '사무엘하', info: '24장 695절' },
                    { name: '열왕기상', info: '22장 816절' },
                    { name: '열왕기하', info: '25장 719절' },
                    { name: '역대상', info: '29장 942절' },
                    { name: '역대하', info: '36장 822절' },
                    { name: '에스라', info: '10장 280절' },
                    { name: '느헤미야', info: '13장 406절' },
                    { name: '에스더', info: '10장 167절' }
                ]
            },
            poetic: {
                title: '시가서',
                books: [
                    { name: '욥기', info: '42장 1,070절' },
                    { name: '시편', info: '150장 2,461절' },
                    { name: '잠언', info: '31장 915절' },
                    { name: '전도서', info: '12장 222절' },
                    { name: '아가서', info: '8장 117절' }
                ]
            },
            majorProphets: {
                title: '대선지서',
                books: [
                    { name: '이사야', info: '66장 1,292절' },
                    { name: '예레미야', info: '52장 1,364절' },
                    { name: '예레미야애가', info: '5장 154절' },
                    { name: '에스겔', info: '48장 1,273절' },
                    { name: '다니엘', info: '12장 357절' }
                ]
            },
            minorProphets: {
                title: '소선지서',
                books: [
                    { name: '호세아', info: '14장 197절' },
                    { name: '요엘', info: '3장 73절' },
                    { name: '아모스', info: '9장 146절' },
                    { name: '오바댜', info: '1장 21절' },
                    { name: '요나', info: '4장 48절' },
                    { name: '미가', info: '7장 105절' },
                    { name: '나훔', info: '3장 47절' },
                    { name: '하박국', info: '3장 56절' },
                    { name: '스바냐', info: '3장 53절' },
                    { name: '학개', info: '2장 38절' },
                    { name: '스가랴', info: '14장 211절' },
                    { name: '말라기', info: '4장 55절' }
                ]
            }
        }
    },
    newTestament: {
        title: '신약',
        info: '(총 260장 7,957절)',
        categories: {
            gospels: {
                title: '복음서',
                books: [
                    { name: '마태복음', info: '28장 1,071절' },
                    { name: '마가복음', info: '16장 678절' },
                    { name: '누가복음', info: '24장 1,151절' },
                    { name: '요한복음', info: '21장 879절' }
                ]
            },
            acts: {
                title: '역사서',
                books: [
                    { name: '사도행전', info: '28장 1,007절' }
                ]
            },
            churchEpistles: {
                title: '교회 서신서',
                books: [
                    { name: '로마서', info: '16장 433절' },
                    { name: '고린도전서', info: '16장 437절' },
                    { name: '고린도후서', info: '13장 257절' },
                    { name: '갈라디아서', info: '6장 149절' },
                    { name: '에베소서', info: '6장 155절' },
                    { name: '빌립보서', info: '4장 104절' },
                    { name: '골로새서', info: '4장 95절' },
                    { name: '데살로니가전서', info: '5장 89절' },
                    { name: '데살로니가후서', info: '3장 47절' }
                ]
            },
            pastoralAndGeneralEpistles: {
                title: '목회 서신서',
                books: [
                    { name: '디모데전서', info: '6장 113절' },
                    { name: '디모데후서', info: '4장 83절' },
                    { name: '디도서', info: '3장 46절' },
                    { name: '빌레몬서', info: '1장 25절' },
                    { name: '히브리서', info: '13장 303절' },
                    { name: '야고보서', info: '5장 108절' },
                    { name: '베드로전서', info: '5장 105절' },
                    { name: '베드로후서', info: '3장 61절' },
                    { name: '요한1서', info: '5장 105절' },
                    { name: '요한2서', info: '1장 13절' },
                    { name: '요한3서', info: '1장 14절' },
                    { name: '유다서', info: '1장 25절' }
                ]
            },
            revelation: {
                title: '예언서',
                books: [
                    { name: '요한계시록', info: '22장 404절' }
                ]
            }
        }
    }
};

// 성경 카테고리별 이모지 매핑
export const categoryEmojis = {
    pentateuch: '📚',
    historical: '📜',
    poetic: '🎵',
    majorProphets: '🔮',
    minorProphets: '✨',
    gospels: '✝️',
    acts: '⚡',
    churchEpistles: '✉️',
    pastoralAndGeneralEpistles: '📨',
    revelation: '🌟'
};

// 성경 이름으로 성경 정보 찾기
export function findBibleByName(name) {
    const allBibles = [];

    // 구약 성경들
    Object.values(bibleStructure.oldTestament.categories).forEach(category => {
        category.books.forEach(book => {
            allBibles.push({ ...book, testament: 'oldTestament', category: category.title });
        });
    });

    // 신약 성경들
    Object.values(bibleStructure.newTestament.categories).forEach(category => {
        category.books.forEach(book => {
            allBibles.push({ ...book, testament: 'newTestament', category: category.title });
        });
    });

    return allBibles.find(bible => bible.name === name);
}

// 성경 목록 HTML 생성
export function generateBibleListHTML(meditations = []) {
    let html = '';

    // 구약
    html += `
    <div class="testament-section">
      <h2>
        <span style="font-size: 2.8rem;">📖</span> 
        ${bibleStructure.oldTestament.title} (39권)
        <div class="testament-info">${bibleStructure.oldTestament.info}</div>
      </h2>
      ${generateTestamentHTML('oldTestament', meditations)}
    </div>
  `;

    // 신약
    html += `
    <div class="testament-section">
      <h2>
        <span style="font-size: 2.8rem;">📖</span> 
        ${bibleStructure.newTestament.title} (27권)
        <div class="testament-info">${bibleStructure.newTestament.info}</div>
      </h2>
      ${generateTestamentHTML('newTestament', meditations)}
    </div>
  `;

    return html;
}

// 성경별 묵상 수 계산
function getMeditationCount(bookName, meditations) {
    return meditations.filter(meditation =>
        meditation.bibleReference.includes(bookName)
    ).length;
}

// 성경별 HTML 생성
function generateTestamentHTML(testament, meditations) {
    const testamentData = bibleStructure[testament];

    return `
    <div class="bible-categories">
      ${Object.entries(testamentData.categories).map(([key, category]) => `
        <div class="bible-category">
          <h3>
            <span>${categoryEmojis[key]}</span> 
            ${category.title} (${category.books.length}권)
          </h3>
          <div class="bible-books">
            ${category.books.map(book => {
        const meditationCount = getMeditationCount(book.name, meditations);
        return `
                <div class="bible-book" data-book="${book.name}">
                  <div class="book-name">${book.name}</div>
                  <div class="book-info">${book.info}</div>
                  <div class="meditation-count">${meditationCount} 묵상</div>
                  <button class="btn-new-meditation" onclick="handleBibleBookClick('${book.name}')">
                    <i class="fas fa-plus"></i> 새 묵상 작성
                  </button>
                </div>
              `;
    }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
} 
