// 성능 최적화 유틸리티
export class PerformanceOptimizer {
    constructor() {
        this.observers = new Map();
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();
    }

    // Intersection Observer를 사용한 지연 로딩
    createIntersectionObserver(callback, options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
            ...options
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target, entry);
                    observer.unobserve(entry.target);
                }
            });
        }, defaultOptions);

        return observer;
    }

    // 가상 스크롤링을 위한 아이템 렌더러
    createVirtualScroller(container, items, itemHeight, renderItem) {
        const visibleCount = Math.ceil(container.clientHeight / itemHeight);
        const totalHeight = items.length * itemHeight;

        let startIndex = 0;
        let endIndex = Math.min(visibleCount, items.length);

        const wrapper = document.createElement('div');
        wrapper.style.height = `${totalHeight}px`;
        wrapper.style.position = 'relative';

        const renderVisibleItems = () => {
            wrapper.innerHTML = '';

            for (let i = startIndex; i < endIndex; i++) {
                const item = renderItem(items[i], i);
                item.style.position = 'absolute';
                item.style.top = `${i * itemHeight}px`;
                item.style.height = `${itemHeight}px`;
                wrapper.appendChild(item);
            }
        };

        container.addEventListener('scroll', () => {
            const scrollTop = container.scrollTop;
            startIndex = Math.floor(scrollTop / itemHeight);
            endIndex = Math.min(startIndex + visibleCount + 1, items.length);

            requestAnimationFrame(renderVisibleItems);
        });

        container.appendChild(wrapper);
        renderVisibleItems();

        return {
            update: (newItems) => {
                items = newItems;
                renderVisibleItems();
            },
            destroy: () => {
                container.removeChild(wrapper);
            }
        };
    }

    // 메모이제이션 (캐싱)
    memoize(fn, keyGenerator = (...args) => JSON.stringify(args)) {
        const cache = new Map();

        return (...args) => {
            const key = keyGenerator(...args);

            if (cache.has(key)) {
                return cache.get(key);
            }

            const result = fn(...args);
            cache.set(key, result);
            return result;
        };
    }

    // 디바운스 (연속 호출 방지)
    debounce(func, wait, immediate = false) {
        return (...args) => {
            const key = func.toString();

            if (this.debounceTimers.has(key)) {
                clearTimeout(this.debounceTimers.get(key));
            }

            const callNow = immediate && !this.debounceTimers.has(key);

            if (callNow) {
                func.apply(this, args);
            } else {
                const timer = setTimeout(() => {
                    func.apply(this, args);
                    this.debounceTimers.delete(key);
                }, wait);

                this.debounceTimers.set(key, timer);
            }
        };
    }

    // 쓰로틀 (호출 빈도 제한)
    throttle(func, limit) {
        return (...args) => {
            const key = func.toString();

            if (!this.throttleTimers.has(key)) {
                func.apply(this, args);
                this.throttleTimers.set(key, true);

                setTimeout(() => {
                    this.throttleTimers.delete(key);
                }, limit);
            }
        };
    }

    // DOM 조작 최적화를 위한 DocumentFragment 사용
    createFragment(elements) {
        const fragment = document.createDocumentFragment();
        elements.forEach(element => fragment.appendChild(element));
        return fragment;
    }

    // 이미지 지연 로딩
    lazyLoadImages(images, placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+') {
        const imageObserver = this.createIntersectionObserver((img) => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy');
            }
        });

        images.forEach(img => {
            if (img.dataset.src) {
                img.src = placeholder;
                img.classList.add('lazy');
                imageObserver.observe(img);
            }
        });
    }

    // 웹 워커를 사용한 무거운 작업 처리
    createWorker(workerScript) {
        return new Worker(workerScript);
    }

    // 메모리 누수 방지를 위한 정리 함수
    cleanup() {
        // 타이머 정리
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();

        // 옵저버 정리
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        // 쓰로틀 타이머 정리
        this.throttleTimers.clear();
    }

    // 성능 측정
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();

        console.log(`${name} 실행 시간: ${(end - start).toFixed(2)}ms`);
        return result;
    }

    // 메모리 사용량 측정
    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    // 프레임 레이트 측정
    measureFPS(callback, duration = 1000) {
        let frameCount = 0;
        let startTime = performance.now();

        const countFrame = () => {
            frameCount++;
            requestAnimationFrame(countFrame);
        };

        requestAnimationFrame(countFrame);

        setTimeout(() => {
            const endTime = performance.now();
            const fps = Math.round((frameCount * 1000) / (endTime - startTime));
            callback(fps);
        }, duration);
    }
}

// 전역 성능 최적화 인스턴스
export const performanceOptimizer = new PerformanceOptimizer(); 
