# 🎯 빠른 시작 가이드

## 1단계: 서버 실행

터미널에서 다음 명령어를 실행하세요:

```bash
cd /Users/macm1/work/asap_order
npm start
```

서버가 시작되면 다음과 같은 메시지가 표시됩니다:
```
서버가 http://localhost:3001 에서 실행 중입니다.
```

## 2단계: 웹 브라우저 열기

웹 브라우저를 열고 주소창에 입력:
```
http://localhost:3001
```

## 3단계: ASAP 사이트에서 HTML 소스 복사

1. **ASAP 사이트 접속**
   - https://asap-china.com 로그인
   - 상품 리스트 페이지로 이동

2. **HTML 소스 보기**
   - **Chrome/Edge**: 
     - Windows: `Ctrl + U`
     - Mac: `Cmd + Option + U`
   - **Firefox**:
     - Windows: `Ctrl + U`
     - Mac: `Cmd + U`
   - 또는 페이지에서 우클릭 → "페이지 소스 보기" 선택

3. **전체 소스 복사**
   - `Ctrl + A` (또는 `Cmd + A`) - 전체 선택
   - `Ctrl + C` (또는 `Cmd + C`) - 복사

## 4단계: 웹 인터페이스에서 엑셀 생성

1. **HTML 붙여넣기**
   - 큰 입력창을 클릭
   - `Ctrl + V` (또는 `Cmd + V`)로 복사한 HTML 소스 붙여넣기

2. **입고리스트 생성**
   - "📊 입고리스트 만들기" 버튼 클릭
   - 잠시 기다리면 성공 메시지 표시

3. **파일 다운로드**
   - "⬇️ 다운로드" 버튼 클릭
   - 파일명: `YY.MM.DD_입고리스트.xlsx` 형식으로 자동 저장

## 💡 팁

### 빠른 키보드 단축키
- **HTML 소스 보기**: `Ctrl + U` (Windows) / `Cmd + Option + U` (Mac)
- **전체 선택**: `Ctrl + A` (Windows) / `Cmd + A` (Mac)
- **복사**: `Ctrl + C` (Windows) / `Cmd + C` (Mac)
- **붙여넣기**: `Ctrl + V` (Windows) / `Cmd + V` (Mac)

### 생성되는 엑셀 파일 정보

엑셀 파일에는 다음 정보가 포함됩니다:
- 제품코드 (IT로 시작)
- 입고일
- 상품명
- 품목 분류
- 단가 (CNY)
- 수량
- 옵션 (중국어/한국어)
- 상세URL
- 트레킹번호
- 주문번호
- 현지운송료
- 메모

### 문제 해결

**Q: 서버가 시작되지 않아요**
```bash
# 다른 포트 사용 중인지 확인
lsof -i :3001

# 프로세스 종료 후 재시작
pkill -f "node server.js"
npm start
```

**Q: 엑셀 파일이 생성되지 않아요**
- HTML 소스가 완전히 복사되었는지 확인
- 브라우저 콘솔(F12)에서 에러 확인
- 서버 터미널에서 에러 로그 확인

**Q: 한글이 깨져요**
- 엑셀을 UTF-8 인코딩으로 열기
- 최신 버전의 Microsoft Excel 또는 Google Sheets 사용 권장

## 🚀 고급 사용법

### 여러 파일 연속 생성
1. 첫 번째 파일 생성 후 다운로드
2. "🗑️ 초기화" 버튼 클릭
3. 새로운 HTML 소스 붙여넣기
4. 반복

### 서버 종료
터미널에서 `Ctrl + C` 누르기

### 백그라운드 실행
```bash
# 백그라운드로 서버 시작
nohup npm start > server.log 2>&1 &

# 서버 종료
pkill -f "node server.js"
```

## 📞 지원

문제가 발생하면 다음 정보와 함께 문의하세요:
- 브라우저 종류 및 버전
- 에러 메시지 (있는 경우)
- server.js 터미널 로그
- 브라우저 콘솔 로그 (F12)

---

**Happy Automating! 🎉**
