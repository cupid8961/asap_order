# 🚀 ASAP 입고리스트 자동 생성 프로그램

ASAP 사이트의 HTML 소스에서 상품 정보를 자동으로 추출하여 입고리스트 엑셀 파일을 생성하는 웹 애플리케이션입니다.

## ✨ 주요 기능

- 📋 HTML 소스 자동 파싱
- 📊 엑셀 파일 자동 생성 (xlsx 형식)
- 🎨 사용하기 쉬운 웹 인터페이스
- ⚡ 빠른 처리 속도
- 💾 자동 파일명 생성 (날짜 기반)

## 📦 설치 방법

### 1. 필수 요구사항
- Node.js (v14 이상)
- npm

### 2. 설치 단계

```bash
# 프로젝트 폴더로 이동
cd asap_order

# 의존성 패키지 설치
npm install

# 서버 실행
npm start
```

서버가 실행되면 브라우저에서 `http://localhost:3001`으로 접속하세요.

## 🎯 사용 방법

### 1단계: ASAP 사이트에서 HTML 소스 복사
1. ASAP 사이트(https://asap-china.com)에서 상품 리스트 페이지를 엽니다
2. 브라우저에서 우클릭 → "페이지 소스 보기" 선택
   - Chrome/Edge: `Ctrl+U` (Windows) 또는 `Cmd+Option+U` (Mac)
   - Firefox: `Ctrl+U` (Windows) 또는 `Cmd+U` (Mac)
3. 전체 HTML 소스를 복사합니다 (`Ctrl+A` → `Ctrl+C`)

### 2단계: 웹 인터페이스에서 처리
1. 웹 브라우저에서 `http://localhost:3001` 접속
2. 복사한 HTML 소스를 입력창에 붙여넣기 (`Ctrl+V`)
3. "입고리스트 만들기" 버튼 클릭
4. 생성 완료 후 "다운로드" 버튼으로 엑셀 파일 저장

## 📄 생성되는 엑셀 파일 구조

생성되는 엑셀 파일에는 다음 정보가 포함됩니다:

| 컬럼명 | 설명 |
|--------|------|
| NO | 순번 |
| 제품코드 | IT로 시작하는 제품 코드 |
| 입고일 | 제품 입고 날짜 |
| 상품명 | 상품 이름 |
| 품목 | 품목 분류 |
| 단가(CNY) | 상품 단가 (위안화) |
| 수량 | 주문 수량 |
| 옵션1 | 상품 옵션 (중국어) |
| 옵션2 | 상품 옵션 (한국어 번역) |
| 상세URL | 상품 상세 페이지 URL |
| 트레킹번호 | 배송 추적 번호 |
| 주문번호 | 주문 번호 |
| 현지운송료(CNY) | 현지 배송비 |
| 메모 | 참고 설명 및 메모 |

파일명 형식: `YY.MM.DD_입고리스트.xlsx` (예: `26.01.17_입고리스트.xlsx`)

## 🛠️ 기술 스택

- **Backend**: Node.js, Express
- **HTML Parser**: Cheerio
- **Excel Generation**: ExcelJS
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## 📁 프로젝트 구조

```
asap_order/
├── server.js              # Express 서버 및 API
├── package.json           # 프로젝트 설정
├── public/
│   └── index.html        # 웹 인터페이스
├── asap.html             # 참고용 HTML 샘플
├── asap_files/           # 참고용 리소스
└── README.md             # 이 파일
```

## 🔧 개발 모드 실행

변경사항을 자동으로 감지하고 서버를 재시작하려면:

```bash
npm run dev
```

## ⚠️ 주의사항

1. **HTML 소스 크기**: 매우 큰 HTML 파일의 경우 처리 시간이 길어질 수 있습니다
2. **브라우저 호환성**: 모던 브라우저(Chrome, Firefox, Edge, Safari 최신 버전) 권장
3. **인터넷 연결**: 서버 실행을 위한 로컬 환경만 필요 (외부 인터넷 불필요)

## 🐛 문제 해결

### 서버가 시작되지 않을 때
```bash
# 포트 3001이 이미 사용 중인지 확인
# Windows
netstat -ano | findstr :3001

# Mac/Linux
lsof -i :3001

# 다른 포트로 변경하려면 server.js의 PORT 변수를 수정하세요
```

### 엑셀 파일이 생성되지 않을 때
1. HTML 소스가 올바르게 붙여넣어졌는지 확인
2. 브라우저 콘솔(F12)에서 에러 메시지 확인
3. 서버 콘솔에서 에러 로그 확인

### 한글이 깨질 때
- UTF-8 인코딩으로 저장되었는지 확인
- 엑셀에서 파일을 열 때 인코딩을 UTF-8로 지정

## 📝 라이선스

MIT License

## 👤 개발자

개발 문의: 프로젝트 관리자에게 문의

---

**Made with ❤️ for ASAP Users**
