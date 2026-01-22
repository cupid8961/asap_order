// 간단한 테스트 스크립트
const fs = require('fs');
const path = require('path');

console.log('🧪 ASAP 입고리스트 생성 프로그램 테스트\n');

// 1. 필요한 파일들이 존재하는지 확인
const requiredFiles = [
  'server.js',
  'package.json',
  'public/index.html',
  'asap.html'
];

console.log('📁 파일 존재 여부 확인:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log();

// 2. package.json 의존성 확인
console.log('📦 필수 패키지 설치 확인:');
const requiredPackages = ['express', 'cheerio', 'exceljs'];

try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  requiredPackages.forEach(pkg => {
    const installed = dependencies[pkg] !== undefined;
    console.log(`  ${installed ? '✅' : '❌'} ${pkg}`);
  });
} catch (error) {
  console.log('  ❌ package.json 읽기 실패');
}

console.log();

// 3. 샘플 HTML 파일 크기 확인
console.log('📄 샘플 파일 정보:');
try {
  const htmlPath = path.join(__dirname, 'asap.html');
  if (fs.existsSync(htmlPath)) {
    const stats = fs.statSync(htmlPath);
    const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`  asap.html 크기: ${sizeInMB} MB`);
  }
} catch (error) {
  console.log('  ❌ 파일 크기 확인 실패');
}

console.log();

// 4. 서버 실행 가능 여부 체크
console.log('🚀 서버 실행 준비:');
console.log('  다음 명령어로 서버를 시작할 수 있습니다:');
console.log('  $ npm start');
console.log('  또는');
console.log('  $ node server.js');
console.log();
console.log('  서버 시작 후 브라우저에서 접속:');
console.log('  http://localhost:3000');

console.log();
console.log(allFilesExist ? '✅ 모든 파일이 준비되었습니다!' : '❌ 일부 파일이 누락되었습니다.');
console.log();
