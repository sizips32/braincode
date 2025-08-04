import { BibleMeditationApp } from './app/App.js';

// 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    try {
        // 애플리케이션 인스턴스 생성
        window.app = new BibleMeditationApp();

        // 직접적인 네비게이션 이벤트 리스너 추가
        setupNavigationListeners();

        console.log('성경 묵상 앱이 성공적으로 초기화되었습니다.');
    } catch (error) {
        console.error('애플리케이션 초기화 중 오류 발생:', error);

        // 오류 발생 시 사용자에게 알림
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f44336;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 10000;
            max-width: 400px;
        `;
        errorMessage.innerHTML = `
            <h3>오류가 발생했습니다</h3>
            <p>애플리케이션을 새로고침해주세요.</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #f44336;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            ">새로고침</button>
        `;
        document.body.appendChild(errorMessage);
    }
});

// 네비게이션 이벤트 리스너 설정
function setupNavigationListeners() {
    const navLinks = document.querySelectorAll('.nav-link[data-view]');
    console.log('설정할 네비게이션 링크:', navLinks.length);

    navLinks.forEach(link => {
        // 기존 onclick 이벤트 제거
        link.removeAttribute('onclick');

        link.addEventListener('click', (event) => {
            event.preventDefault();
            const view = event.currentTarget.dataset.view;
            console.log('네비게이션 클릭됨:', view);

            if (window.app && view) {
                window.app.navigateToView(view, event);
            }
        });
    });
}

// 전역 함수들 (기존 코드와의 호환성을 위해)
window.showNotification = (message, type = 'info') => {
    if (window.app && window.app.notificationManager) {
        window.app.notificationManager.show(message, type);
    }
};

window.openAdSection = () => {
    const modal = document.getElementById('adSectionModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
};

window.closeAdSection = () => {
    const modal = document.getElementById('adSectionModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

window.closeMeditationForm = () => {
    if (window.app) {
        window.app.closeMeditationForm();
    }
};

// 페이지네이션 전역 핸들러들
window.handleMeditationPageChange = (page) => {
    if (window.app) {
        window.app.handleMeditationPageChange(page);
    }
};

window.handlePrayerPageChange = (page) => {
    if (window.app) {
        window.app.handlePrayerPageChange(page);
    }
};

window.handleProphecyPageChange = (page) => {
    if (window.app) {
        window.app.handleProphecyPageChange(page);
    }
};

window.handleChurchEventPageChange = (page) => {
    if (window.app) {
        window.app.handleChurchEventPageChange(page);
    }
};

// 네비게이션 클릭 핸들러
window.handleNavClick = (view, event) => {
    event.preventDefault();
    console.log('handleNavClick 호출됨:', view);

    if (window.app) {
        window.app.navigateToView(view, event);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 홈 액션 핸들러
window.handleHomeAction = (action) => {
    console.log('handleHomeAction 호출됨:', action);

    if (window.app) {
        window.app.handleHomeAction(action);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 검색 핸들러
window.handleSearch = () => {
    console.log('검색 버튼 클릭됨');
    if (window.app) {
        window.app.performSearch();
    }
};

// 검색 엔터 키 핸들러
window.handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
        console.log('검색 엔터 키 입력됨');
        if (window.app) {
            window.app.performSearch();
        }
    }
};

// 기도 액션 핸들러
window.handlePrayerAction = (action, type, id = null) => {
    console.log('기도 액션 호출됨:', action, type, id);

    if (window.app) {
        switch (action) {
            case 'new-prayer':
                window.app.showPrayerForm(type);
                break;
            case 'view-prayer':
                window.app.showPrayerDetail(id, type);
                break;
            case 'edit-prayer':
                window.app.editPrayer(id, type);
                break;
            case 'delete-prayer':
                window.app.deletePrayer(id, type);
                break;
            case 'toggle-prayer':
                window.app.togglePrayerAnswered(id, type);
                break;
            default:
                console.log('알 수 없는 기도 액션:', action);
        }
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 기도 탭 전환 핸들러
window.handlePrayerTabChange = (tabName) => {
    console.log('기도 탭 전환:', tabName);

    if (window.app) {
        window.app.showPrayerTab(tabName);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 기도 폼 제출 핸들러
window.handlePrayerSubmit = (event) => {
    console.log('기도 폼 제출됨');

    if (window.app) {
        window.app.handlePrayerSubmit(event);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 기도 폼 닫기 핸들러
window.closePrayerForm = () => {
    console.log('기도 폼 닫기');

    if (window.app) {
        window.app.closePrayerForm();
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 교리 탭 전환 핸들러
window.handleDoctrineTabChange = (tabName) => {
    console.log('교리 탭 전환:', tabName);

    if (window.app) {
        window.app.showDoctrineTab(tabName);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 교리 클릭 핸들러
window.handleDoctrineClick = (doctrineId) => {
    console.log('교리 클릭:', doctrineId);

    if (window.app) {
        window.app.showDoctrineDetail(doctrineId);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};



// 교리에서 묵상 기도하기 핸들러
window.handleDoctrinePrayer = (doctrineId, event) => {
    event.stopPropagation();
    console.log('교리에서 묵상 기도하기:', doctrineId);

    if (window.app) {
        const doctrine = window.app.doctrineModel.getById(doctrineId);
        if (doctrine) {
            window.app.navigateToView('prayer');
            setTimeout(() => {
                window.app.showPrayerForm('meditation');
                // 기도 내용에 교리 정보 추가
                const contentField = document.getElementById('prayerContent');
                if (contentField) {
                    contentField.value = `[${doctrine.title}] ${doctrine.content}\n\n`;
                }
            }, 100);
        }
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 교리 상세 내용 핸들러 (URL 저장 또는 링크 이동)
window.handleDoctrineDetail = (doctrineId, event) => {
    if (event) {
        event.stopPropagation();
    }
    console.log('교리 상세 내용 처리:', doctrineId);

    if (window.app) {
        const urlList = window.app.doctrineModel.getDoctrineUrlList(doctrineId);

        if (urlList && urlList.length > 0) {
            // URL 목록이 있으면 첫 번째 URL로 이동
            window.open(urlList[0].url, '_blank');
        } else {
            // URL이 없으면 입력 모달 표시
            window.app.showDoctrineUrlModal(doctrineId);
        }
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 교리 상세 내용 URL 수정 핸들러 (우클릭 메뉴)
window.handleDoctrineDetailEdit = (doctrineId, event) => {
    if (event) {
        event.stopPropagation();
    }
    console.log('교리 상세 내용 URL 수정:', doctrineId);

    if (window.app) {
        // URL 수정 모달 표시 (저장된 URL이 있든 없든)
        window.app.showDoctrineUrlModal(doctrineId);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 전역 함수들을 즉시 정의하여 모듈 로딩 순서 문제 해결
(function() {
    // 교리 핵심 URL 저장 핸들러
    window.handleDoctrineUrlSave = (doctrineId) => {
        console.log('=== 전역 handleDoctrineUrlSave 호출됨 ===');
        console.log('전달받은 doctrineId:', doctrineId);
        console.log('doctrineId 타입:', typeof doctrineId);
        console.log('window.app 존재 여부:', !!window.app);

        if (window.app) {
            console.log('앱 인스턴스에서 handleDoctrineUrlSave 호출');
            window.app.handleDoctrineUrlSave(doctrineId);
        } else {
            console.error('앱이 초기화되지 않았습니다.');
            console.error('window.app:', window.app);
        }
    };

    console.log('전역 함수 handleDoctrineUrlSave 정의 완료');
    
    // 백업용 전역 함수 (onclick 이벤트용)
    window.handleDoctrineUrlSaveBackup = (doctrineId) => {
        console.log('백업 전역 함수 호출됨:', doctrineId);
        if (window.app && window.app.handleDoctrineUrlSave) {
            window.app.handleDoctrineUrlSave(doctrineId);
        } else {
            console.error('앱 또는 메서드가 없음');
        }
    };
    
    // 메뉴 이벤트 리스너 설정 (DOM 로딩 완료 후)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM 로딩 완료, 메뉴 이벤트 리스너 설정 시작');
            setupNavigationListeners();
            console.log('메뉴 이벤트 리스너 설정 완료');
        });
    } else {
        console.log('DOM 이미 로드됨, 메뉴 이벤트 리스너 설정 시작');
        setupNavigationListeners();
        console.log('메뉴 이벤트 리스너 설정 완료');
    }
})();

// 교리 핵심 URL 삭제 핸들러
window.handleDoctrineUrlDelete = (doctrineId) => {
    console.log('교리 핵심 URL 삭제:', doctrineId);

    if (window.app) {
        window.app.handleDoctrineUrlDelete(doctrineId);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 교리 URL 항목 삭제 핸들러
window.handleDoctrineUrlItemDelete = (doctrineId, urlId) => {
    console.log('교리 URL 항목 삭제:', doctrineId, urlId);

    if (window.app) {
        if (confirm('이 URL을 삭제하시겠습니까?')) {
            window.app.doctrineModel.removeDoctrineUrl(doctrineId, urlId);
            window.app.updateUrlList(doctrineId);
        }
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 예언 액션 핸들러
window.handleProphecyAction = (action, prophecyId = null) => {
    console.log('예언 액션 호출됨:', action, prophecyId);

    if (window.app) {
        window.app.handleProphecyAction(action, prophecyId);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 예언 폼 제출 핸들러
window.handleProphecySubmit = (event) => {
    console.log('예언 폼 제출됨');

    if (window.app) {
        window.app.handleProphecySubmit(event);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 예언 폼 닫기 핸들러
window.closeProphecyForm = () => {
    console.log('예언 폼 닫기');

    if (window.app) {
        window.app.closeProphecyForm();
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 예언에서 묵상하기 핸들러
window.handleProphecyMeditation = (prophecyId) => {
    console.log('예언에서 묵상하기:', prophecyId);

    if (window.app) {
        const prophecy = window.app.prophecyModel.getById(prophecyId);
        if (prophecy) {
            window.app.navigateToView('bible-list');
            setTimeout(() => {
                window.app.showMeditationForm(null, null, null, prophecyId);
            }, 100);
        }
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 예언에서 기도하기 핸들러
window.handleProphecyPrayer = (prophecyId) => {
    console.log('예언에서 기도하기:', prophecyId);

    if (window.app) {
        const prophecy = window.app.prophecyModel.getById(prophecyId);
        if (prophecy) {
            window.app.navigateToView('prayer');
            setTimeout(() => {
                window.app.showPrayerForm('meditation');
                // 기도 내용에 예언 정보 추가
                const contentField = document.getElementById('prayerContent');
                if (contentField) {
                    contentField.value = `[${prophecy.title}] ${prophecy.content}\n\n`;
                }
            }, 100);
        }
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 성경 책 클릭 핸들러
window.handleBibleBookClick = (bookName) => {
    console.log('성경 책 클릭됨:', bookName);

    if (window.app) {
        window.app.showBibleDetailView(bookName);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 성경별 상세 뷰에서 뒤로 가기 핸들러
window.handleBibleDetailBack = () => {
    if (window.app) {
        window.app.showBibleListView();
    }
};

// 성경별 상세 뷰에서 묵상 작성 핸들러
window.handleBibleMeditation = (bookName) => {
    if (window.app) {
        window.app.showMeditationForm(null, bookName);
    }
};

// 전체 묵상 보기 핸들러
window.handleViewAllMeditations = (bookName) => {
    if (window.app) {
        // 전체 묵상 목록 페이지로 이동하는 로직
        window.app.showAllMeditationsView(bookName);
    }
};

// 묵상 목록 아이템 클릭 핸들러
window.handleMeditationItemClick = (date) => {
    console.log('묵상 아이템 클릭됨:', date);

    if (window.app) {
        window.app.showMeditationForm(date);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 묵상 액션 핸들러 (수정/삭제)
window.handleMeditationAction = (action, meditationId) => {
    console.log('묵상 액션:', action, meditationId);

    if (window.app) {
        window.app.handleMeditationAction(action, meditationId);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 묵상 편집 핸들러
window.handleMeditationEdit = (meditationId) => {
    console.log('묵상 편집:', meditationId);

    if (window.app) {
        const meditation = window.app.meditationModel.getById(meditationId);
        if (meditation) {
            window.app.showMeditationForm(meditation.date, null, null, null, meditationId);
        }
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 묵상 삭제 핸들러
window.handleMeditationDelete = (meditationId) => {
    console.log('묵상 삭제:', meditationId);

    if (window.app) {
        if (confirm('정말로 이 묵상을 삭제하시겠습니까?')) {
            if (window.app.meditationModel.deleteMeditationById(meditationId)) {
                // 현재 뷰 새로고침
                window.app.refreshCurrentView();
            }
        }
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 교회 이벤트 액션 핸들러
window.handleChurchEventAction = (action, eventId = null) => {
    console.log('교회 이벤트 액션 호출됨:', action, eventId);

    if (window.app) {
        window.app.handleChurchEventAction(action, eventId);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 교회 달력 날짜 클릭 핸들러
window.handleChurchCalendarDateClick = (date) => {
    console.log('교회 달력 날짜 클릭됨:', date);

    if (window.app) {
        window.app.showChurchEventForm(date);
    } else {
        console.error('앱이 초기화되지 않았습니다.');
    }
};

// 교회 달력 네비게이션 핸들러
window.handleCalendarNav = (direction) => {
    console.log('달력 네비게이션:', direction);

    if (window.app && window.app.churchCalendar) {
        const currentDate = window.app.churchCalendar.getCurrentDate();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        if (direction === 'prev') {
            window.app.churchCalendar.goToMonth(year, month - 1);
        } else if (direction === 'next') {
            window.app.churchCalendar.goToMonth(year, month + 1);
        }

        window.app.updateChurchCalendarEvents();
    }
};

// 교회 이벤트 폼 닫기
window.closeChurchEventForm = () => {
    if (window.app) {
        window.app.closeChurchEventForm();
    }
};

// 음악 토글 기능
let isMusicPlaying = false;

window.toggleMusic = () => {
    const musicBtn = document.querySelector('.ad-music-btn');
    const adIframe = document.getElementById('adIframe');

    isMusicPlaying = !isMusicPlaying;
    musicBtn.classList.toggle('playing', isMusicPlaying);

    if (adIframe && adIframe.contentWindow) {
        adIframe.contentWindow.postMessage({
            type: 'TOGGLE_MUSIC',
            playing: isMusicPlaying
        }, '*');
    }
};

// iframe 메시지 수신
window.addEventListener('message', (event) => {
    if (event.data.type === 'MUSIC_STATE') {
        isMusicPlaying = event.data.playing;
        const musicBtn = document.querySelector('.ad-music-btn');
        if (musicBtn) {
            musicBtn.classList.toggle('playing', isMusicPlaying);
        }
    }
});

// ESC 키 이벤트
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        window.closeAdSection();
    }
});

// 모달 외부 클릭 이벤트
document.addEventListener('DOMContentLoaded', () => {
    const adModal = document.getElementById('adSectionModal');
    if (adModal) {
        adModal.addEventListener('click', (event) => {
            if (event.target === adModal) {
                window.closeAdSection();
            }
        });
    }
}); 
