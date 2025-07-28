import { Utils } from './utils.js';

export class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        // 알림 컨테이너 생성
        this.container = Utils.createElement('div', 'notification-container');
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        // 기존 알림 제거
        this.clear();

        const notification = Utils.createElement('div', `notification ${type}`);
        notification.textContent = message;

        // 애니메이션 클래스 추가
        notification.classList.add('notification-enter');

        this.container.appendChild(notification);

        // 자동 제거
        setTimeout(() => {
            this.hide(notification);
        }, duration);

        // 알림 목록에 추가
        this.notifications.push(notification);

        return notification;
    }

    hide(notification) {
        if (notification && notification.parentNode) {
            notification.classList.add('notification-exit');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                // 목록에서 제거
                this.notifications = this.notifications.filter(n => n !== notification);
            }, 300);
        }
    }

    clear() {
        this.notifications.forEach(notification => {
            this.hide(notification);
        });
    }

    // 편의 메서드들
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }
}

// 싱글톤 인스턴스
export const notificationManager = new NotificationManager(); 
