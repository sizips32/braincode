#!/usr/bin/env python3
"""
안정적인 HTTP 서버
BrokenPipeError 및 기타 네트워크 에러 처리
"""

import http.server
import socketserver
import sys
import os
from urllib.parse import urlparse

class SafeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """안전한 HTTP 요청 핸들러"""
    
    def handle_one_request(self):
        """단일 요청 처리 (에러 처리 포함)"""
        try:
            super().handle_one_request()
        except BrokenPipeError:
            # 클라이언트가 연결을 끊은 경우 - 무시
            pass
        except ConnectionResetError:
            # 연결이 재설정된 경우 - 무시
            pass
        except Exception as e:
            # 기타 예상치 못한 에러는 로그만 남기고 계속
            print(f"요청 처리 중 에러 발생: {e}")
    
    def copyfile(self, source, outputfile):
        """파일 복사 (에러 처리 포함)"""
        try:
            super().copyfile(source, outputfile)
        except BrokenPipeError:
            # 클라이언트가 파일 전송 중 연결을 끊은 경우
            pass
        except ConnectionResetError:
            # 연결이 재설정된 경우
            pass
    
    def log_message(self, format, *args):
        """로그 메시지 출력 (에러 필터링)"""
        # BrokenPipeError 관련 로그는 출력하지 않음
        if "Broken pipe" not in str(args) and "Connection reset" not in str(args):
            super().log_message(format, *args)

def run_server(port=5001, directory="."):
    """서버 실행"""
    try:
        # 작업 디렉토리 변경
        os.chdir(directory)
        
        # 서버 설정
        handler = SafeHTTPRequestHandler
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"🚀 서버가 시작되었습니다!")
            print(f"📍 주소: http://localhost:{port}")
            print(f"📁 디렉토리: {os.getcwd()}")
            print(f"⏹️  중지하려면 Ctrl+C를 누르세요")
            print("-" * 50)
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n🛑 서버가 중지되었습니다.")
                httpd.shutdown()
                
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ 포트 {port}가 이미 사용 중입니다.")
            print(f"💡 다른 포트를 사용하거나 기존 프로세스를 종료하세요.")
        else:
            print(f"❌ 서버 시작 실패: {e}")
    except Exception as e:
        print(f"❌ 예상치 못한 에러: {e}")

if __name__ == "__main__":
    # 명령행 인수 처리
    port = 5001
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("❌ 포트 번호는 숫자여야 합니다.")
            sys.exit(1)
    
    run_server(port) 
