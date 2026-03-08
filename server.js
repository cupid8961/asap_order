const express = require('express');
const cheerio = require('cheerio');
const ExcelJS = require('exceljs');
const path = require('path');

const app = express();
const PORT = 3001;

// 미들웨어 설정
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// HTML 파싱 및 엑셀 생성 API
app.post('/api/generate-excel', async (req, res) => {
  try {
    const { htmlContent } = req.body;
    
    if (!htmlContent) {
      return res.status(400).json({ error: 'HTML 내용이 없습니다.' });
    }

    // Cheerio로 HTML 파싱
    const $ = cheerio.load(htmlContent);
    const products = [];
    let rowNumber = 1;
    
    // 먼저 각 신청번호별로 메모를 수집 (신청번호를 키로)
    const memosByApplicationNumber = {};
    $('.ipko_memo').each((i, el) => {
      const memoText = $(el).text().trim();
      if (memoText.includes('참고설명')) {
        // 이전에 나온 가장 가까운 신청번호 찾기
        let $current = $(el);
        let applicationNumber = '';
        
        while ($current.length > 0 && !applicationNumber) {
          const $prevTitle = $current.prevAll('.view_tool5_title').first();
          if ($prevTitle.length > 0) {
            applicationNumber = $prevTitle.text().trim()
              .replace(/\(신청번호\)/g, '')
              .replace(/\n/g, '')
              .trim();
            break;
          }
          $current = $current.parent();
        }
        
        if (applicationNumber) {
          const memoMatch = memoText.match(/참고설명\s*-\s*([\s\S]+)/);
          if (memoMatch) {
            memosByApplicationNumber[applicationNumber] = memoMatch[1].trim();
          }
        }
      }
    });

    // 각 상품 블록 찾기 (view_tool3_long이 실제 상품 블록)
    $('.view_tool3_long').each((index, element) => {
      try {
        const $content = $(element);
        
        // 신청번호 찾기 - 현재 view_tool3_long 이전의 가장 가까운 view_tool5_title 찾기
        let applicationNumber = '';
        let $current = $content;
        
        // 상위로 올라가면서 view_tool5_title 찾기
        while ($current.length > 0 && !applicationNumber) {
          const $prevTitle = $current.prevAll('.view_tool5_title').first();
          if ($prevTitle.length > 0) {
            applicationNumber = $prevTitle.text().trim()
              .replace(/\(신청번호\)/g, '')
              .replace(/\n/g, '')
              .trim();
            break;
          }
          // 부모의 형제 요소들도 확인
          $current = $current.parent();
          const $prevTitleInParent = $current.prevAll().find('.view_tool5_title').first();
          if ($prevTitleInParent.length > 0) {
            applicationNumber = $prevTitleInParent.text().trim()
              .replace(/\(신청번호\)/g, '')
              .replace(/\n/g, '')
              .trim();
            break;
          }
        }
        
        // 제품코드 추출
        const productCodeText = $content.find('li').first().find('span#name').text().trim();
        const productCodeMatch = productCodeText.match(/IT\d+/);
        const productCode = productCodeMatch ? productCodeMatch[0] : '';
        
        // 입고일 추출
        const dateMatch = productCodeText.match(/\(입고일\s*:\s*([^\)]+)\)/);
        const receiveDate = dateMatch ? dateMatch[1].trim() : '';
        
        // 상품명 - li.auto_jak 중 첫 번째에서 추출
        const productNameLi = $content.find('li.auto_jak').eq(0);
        const productName = productNameLi.find('span#name').text().trim();
        
        // 단가 - span#money
        const price = $content.find('span#money').text().trim();
        
        // 수량 - span#count
        const quantity = $content.find('span#count').text().trim();
        
        // 옵션1~4 합치기
        const option1Text = $content.find('span#option1').text().trim();
        const option2Text = $content.find('span#option2').text().trim();
        const option3Text = $content.find('span#option3').text().trim();
        const option4Text = $content.find('span#option4').text().trim();
        
        // 빈 값이 아닌 옵션들만 모아서 합치기
        const options = [option1Text, option2Text, option3Text, option4Text].filter(opt => opt !== '');
        const option1 = options.join(' / ');
        
        // 상세URL
        const detailUrl = $content.find('span#site_url a').attr('href') || '';
        
        // 현지운송료
        const localShipping = $content.find('span#local_ship_money').text().trim();
        
        // 특이사항 - span#local_invoice에서 '//*' 뒤의 텍스트 추출
        const localInvoiceText = $content.find('span#local_invoice').text().trim();
        let specialNote = '';
        if (localInvoiceText.includes('//*')) {
          const afterAsterisk = localInvoiceText.split('//*')[1];
          if (afterAsterisk) {
            specialNote = afterAsterisk.trim();
          }
        }
        
        // 메모 - 신청번호로 매칭
        const memo = memosByApplicationNumber[applicationNumber] || '';

        if (productCode) {
          products.push({
            inventoryForm: '',  // 재고폼 - 빈값
            naverInventory: '',  // 네이버 재고 - 빈값
            no: rowNumber++,
            applicationNumber: applicationNumber,
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
        }
      } catch (err) {
        console.error('상품 파싱 중 오류:', err);
      }
    });

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
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
