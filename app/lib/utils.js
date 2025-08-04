// 유틸리티 함수들
export class Utils {
    // 날짜 포맷팅
    static formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 텍스트 자르기
    static truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // HTML 이스케이프
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 안전한 JSON 파싱
    static safeJsonParse(jsonString, defaultValue = []) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('JSON 파싱 오류:', error);
            return defaultValue;
        }
    }

    // DOM 요소 생성 헬퍼
    static createElement(tag, className, innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    // 이벤트 위임 헬퍼
    static delegateEvent(parent, selector, eventType, handler) {
        parent.addEventListener(eventType, (event) => {
            const target = event.target.closest(selector);
            if (target && parent.contains(target)) {
                handler.call(target, event);
            }
        });
    }

    // 디바운스 함수
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 로컬 스토리지 헬퍼
    static storage = {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('로컬 스토리지 읽기 오류:', error);
                return defaultValue;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('로컬 스토리지 쓰기 오류:', error);
                return false;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('로컬 스토리지 삭제 오류:', error);
                return false;
            }
        }
    };

    // 페이지네이션 유틸리티
    static pagination = {
        // 데이터를 페이지별로 분할
        paginate(data, page = 1, perPage = 10) {
            const startIndex = (page - 1) * perPage;
            const endIndex = startIndex + perPage;
            return {
                items: data.slice(startIndex, endIndex),
                totalItems: data.length,
                totalPages: Math.ceil(data.length / perPage),
                currentPage: page,
                perPage: perPage,
                hasNextPage: page < Math.ceil(data.length / perPage),
                hasPrevPage: page > 1
            };
        },

        // 페이지네이션 HTML 생성
        generatePaginationHTML(paginationInfo, onPageChange) {
            const { currentPage, totalPages, hasNextPage, hasPrevPage } = paginationInfo;
            
            if (totalPages <= 1) return '';

            let paginationHTML = '<div class="pagination">';
            
            // 이전 페이지 버튼
            if (hasPrevPage) {
                paginationHTML += `
                    <button class="pagination-btn prev" onclick="${onPageChange}(${currentPage - 1})">
                        <i class="fas fa-chevron-left"></i> 이전
                    </button>
                `;
            }

            // 페이지 번호들
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);

            if (startPage > 1) {
                paginationHTML += `<button class="pagination-btn" onclick="${onPageChange}(1)">1</button>`;
                if (startPage > 2) {
                    paginationHTML += '<span class="pagination-ellipsis">...</span>';
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                paginationHTML += `
                    <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="${onPageChange}(${i})">
                        ${i}
                    </button>
                `;
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    paginationHTML += '<span class="pagination-ellipsis">...</span>';
                }
                paginationHTML += `<button class="pagination-btn" onclick="${onPageChange}(${totalPages})">${totalPages}</button>`;
            }

            // 다음 페이지 버튼
            if (hasNextPage) {
                paginationHTML += `
                    <button class="pagination-btn next" onclick="${onPageChange}(${currentPage + 1})">
                        다음 <i class="fas fa-chevron-right"></i>
                    </button>
                `;
            }

            paginationHTML += '</div>';
            return paginationHTML;
        }
    };
} 
