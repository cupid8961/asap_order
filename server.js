const express = require('express');
const cheerio = require('cheerio');
const ExcelJS = require('exceljs');
const path = require('path');
const { version } = require('./package.json');

const app = express();
const PORT = 3001;

// 미들웨어 설정
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 실행 중인 서버 버전 (package.json 기준)
app.get('/api/version', (req, res) => {
  res.json({ version });
});

// HTML 파싱 및 엑셀 생성 API
app.post('/api/generate-excel', async (req, res) => {
  try {
    const { htmlContent } = req.body;
    
    if (!htmlContent) {
      return res.status(400).json({ error: 'HTML 내용이 없습니다.' });
    }

    // Cheerio로 HTML 파싱
    // (2026-11 ASAP 사이트 개편 구조: 신청서 .order-view-container 안에 상품 카드 .item-view-card)
    const $ = cheerio.load(htmlContent);
    const products = [];
    let rowNumber = 1;

    // 상품 카드에서 라벨(상품명, 옵션 등)로 값 칸 찾기
    const getField = ($card, label) =>
      $card.find('.info-row').filter((i, row) => $(row).find('label').text().trim() === label).find('.val');

    $('.order-view-container').each((orderIndex, orderEl) => {
      const $order = $(orderEl);

      // 신청번호 (예: BU261020228364)
      const applicationNumber = $order.find('.order-id-badge .code').text().replace(/\s/g, '');

      // 메모 - 신청서 하단의 참고설명 (여러 줄 그대로 유지)
      const memo = $order.find('.order-footer-card .footer-content').text().trim();

      $order.find('.item-view-card').each((itemIndex, itemEl) => {
        try {
          const $card = $(itemEl);

          // 제품코드 (IT로 시작) - 없으면 상품으로 보지 않음
          const productCode = $card.find('.it-code').text().replace(/\s/g, '');
          if (!/^IT\d+/.test(productCode)) return;

          const productName = getField($card, '상품명').text().trim();

          // 단가/수량: "<strong>9.00</strong> CNY / <strong>30</strong>개"
          const $priceQty = getField($card, '단가/수량').find('strong');
          const price = $priceQty.eq(0).text().trim();
          const quantity = $priceQty.eq(1).text().trim();

          // 옵션 (사이트에서 이미 하나로 합쳐서 보여줌)
          const option1 = getField($card, '옵션').text().trim();

          // 현지운송료: "0.00 CNY" → "0.00"
          const localShipping = getField($card, '현지운송료').text().replace(/CNY/i, '').trim();

          // 상세URL
          const detailUrl = getField($card, '상세URL').find('a').attr('href') || '';

          // 특이사항 - "트래킹번호//*특이사항 / 주문번호" 에서 '//*'와 마지막 ' / 주문번호' 사이
          const trackingText = getField($card, '트레킹/주문번호').text().trim();
          let specialNote = '';
          const starIndex = trackingText.indexOf('//*');
          if (starIndex !== -1) {
            specialNote = trackingText
              .slice(starIndex + 3)
              .replace(/\s*\/\s*[0-9A-Za-z-]*\s*$/, '')
              .trim();
          }

          products.push({
            inventoryForm: '',  // IMS - 빈값
            naverInventory: '',  // 쇼핑몰 - 빈값
            no: rowNumber++,
            applicationNumber,
            productName,
            price,
            quantity,
            receiveQuantity: '',  // 입고수량 - 빈값
            localShipping,
            option1,
            detailUrl,
            memo,
            specialNote
          });
        } catch (err) {
          console.error('상품 파싱 중 오류:', err);
        }
      });
    });

    if (products.length === 0) {
      return res.status(400).json({ error: '상품을 찾지 못했습니다. ASAP 신청서 페이지의 HTML 소스 전체를 붙여넣었는지 확인해주세요.' });
    }

    console.log(`총 ${products.length}개의 상품을 파싱했습니다.`);

    // ExcelJS로 엑셀 파일 생성
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('입고리스트');

    // 헤더 설정
    worksheet.columns = [
      { header: 'IMS', key: 'inventoryForm', width: 12 },
      { header: '쇼핑몰', key: 'naverInventory', width: 12 },
      { header: 'NO', key: 'no', width: 5 },
      { header: '신청번호', key: 'applicationNumber', width: 18 },
      { header: '상품명', key: 'productName', width: 30 },
      { header: '단가', key: 'price', width: 12 },
      { header: '수량', key: 'quantity', width: 8 },
      { header: '입고수량', key: 'receiveQuantity', width: 10 },
      { header: '운송료', key: 'localShipping', width: 15 },
      { header: '옵션1', key: 'option1', width: 50 },
      { header: '메모', key: 'memo', width: 50 },
      { header: '특이사항', key: 'specialNote', width: 30 },
      { header: '상세URL', key: 'detailUrl', width: 50 }
    ];

    // 헤더 스타일 적용
    worksheet.getRow(1).font = { bold: true, size: 10 };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' }
    };

    // 데이터 추가
    products.forEach(product => {
      const row = worksheet.addRow(product);
      
      // 모든 셀에 테두리 적용 및 폰트 크기 10 설정
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', wrapText: true };
        cell.font = { size: 10 };
      });
    });

    // 파일명 생성 (현재 날짜 기준)
    const today = new Date();
    const year = today.getFullYear().toString().slice(2);
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const filename = `${year}.${month}.${day}_입고리스트.xlsx`;

    // 엑셀 파일을 버퍼로 생성
    const buffer = await workbook.xlsx.writeBuffer();

    // 클라이언트에 파일 전송
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.send(buffer);

  } catch (error) {
    console.error('엑셀 생성 중 오류:', error);
    res.status(500).json({ error: '엑셀 파일 생성 중 오류가 발생했습니다.', details: error.message });
  }
});

// 404 핸들러 - API 요청에 대해서만 JSON 응답
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: '요청한 API 엔드포인트를 찾을 수 없습니다.' });
});

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 에러:', err);
  
  // 이미 응답을 보내기 시작한 경우
  if (res.headersSent) {
    return next(err);
  }
  
  // JSON 파싱 에러 처리
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: '잘못된 JSON 형식입니다.' });
  }
  
  // 요청 크기 초과 에러 처리
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: '요청 데이터가 너무 큽니다. (최대 50MB)' });
  }
  
  res.status(500).json({ 
    error: '서버 내부 오류가 발생했습니다.', 
    details: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`서버(v${version})가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
