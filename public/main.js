import { tmData, tmHistory, tmFailureHistory, failureCodeMaster, failureDetailMap, riskRules, lookupLists } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const gridContainer = document.getElementById('grid-container');
    const sheetTabsContainer = document.getElementById('sheet-tabs');
    const cellAddressDisplay = document.getElementById('cell-address');
    const formulaInput = document.getElementById('formula-input');
    const ribbonButtons = document.querySelectorAll('.ribbon-tabs button');

    // State
    let currentSheet = 'TM_MASTER';
    let selectedCell = null;

    // Define all available sheets
    const sheets = [
        { id: 'USAGE', name: '사용방법', data: [
            { "목적": "견인전동기 현황 + 교체이력 + 고장심각도 연결" },
            { "사용 원칙 1": "현재 상태는 TM_MASTER에서 관리" },
            { "사용 원칙 2": "고장유형은 표준고장유형에서 선택" },
            { "심각도": "1 경미 / 2 주의 / 3 중간위험 / 4 고위험 / 5 치명" }
        ]},
        { id: 'DASHBOARD', name: '대시보드', data: [
            { "항목": "총 TM 데이터", "값": 174, "심각도": 1, "건수": 66 },
            { "항목": "운영중", "값": 126, "심각도": 2, "건수": 9 },
            { "항목": "예비품", "값": 26, "심각도": 3, "건수": 10 },
            { "항목": "불용", "값": 22, "심각도": 5, "건수": 43 }
        ]},
        { id: 'TM_MASTER', name: 'TM_MASTER', data: tmData },
        { id: 'HISTORY', name: '교체이력', data: tmHistory },
        { id: 'FAILURE', name: '고장이력', data: tmFailureHistory },
        { id: 'CODES', name: '고장코드', data: failureCodeMaster },
        { id: 'MAPPING', name: '판정가이드', data: failureDetailMap },
        { id: 'RULES', name: '위험도기준', data: [
            ...riskRules.age.map(r => ({ "구분": "노후점수", "조건": r.condition, "점수": r.score })),
            ...riskRules.failure.map(r => ({ "구분": "고장점수", "조건": `심각도 ${r.severity}`, "점수": r.score })),
            ...riskRules.repetition.map(r => ({ "구분": "반복점수", "조건": `이력 ${r.count}회`, "점수": r.score }))
        ]},
        { id: 'INPUT', name: 'INPUT_TEMPLATE', data: [
            { "입력일자": "2026-05-01", "편성": "111", "차호": "1711", "위수": "1", "교체사유": "예시 입력" }
        ]},
        { id: 'LOOKUP', name: 'LOOKUP_LIST', data: [
            { "유형": lookupLists.standardFailureTypes[0], "심각도": 1, "위험등급": lookupLists.riskGrades[0] },
            { "유형": lookupLists.standardFailureTypes[1], "심각도": 2, "위험등급": lookupLists.riskGrades[1] },
            { "유형": lookupLists.standardFailureTypes[2], "심각도": 3, "위험등급": lookupLists.riskGrades[2] }
        ]}
    ];

    // Initialize Tabs
    function renderTabs() {
        sheetTabsContainer.innerHTML = '';
        sheets.forEach(sheet => {
            const tab = document.createElement('div');
            tab.className = `sheet-tab ${currentSheet === sheet.id ? 'active' : ''}`;
            tab.textContent = sheet.name;
            tab.onclick = () => switchSheet(sheet.id);
            sheetTabsContainer.appendChild(tab);
        });
    }

    function switchSheet(sheetId) {
        currentSheet = sheetId;
        renderTabs();
        renderGrid();
    }

    // Helper to get Excel column name (A, B, C...)
    function getColName(n) {
        let name = '';
        while (n >= 0) {
            name = String.fromCharCode((n % 26) + 65) + name;
            n = Math.floor(n / 26) - 1;
        }
        return name;
    }

    // Render Grid
    function renderGrid() {
        const sheet = sheets.find(s => s.id === currentSheet);
        if (!sheet) return;

        const data = sheet.data;
        const keys = data.length > 0 ? Object.keys(data[0]) : ['Empty'];
        
        let html = `<table class="excel-grid">`;
        
        // Header Row (A, B, C...)
        html += `<thead><tr><th class="row-number"></th>`;
        keys.forEach((_, i) => {
            html += `<th class="col-header">${getColName(i)}</th>`;
        });
        html += `</tr></thead>`;

        // Data Rows
        // 1st Row: Keys as labels
        html += `<tr><td class="row-number">1</td>`;
        keys.forEach(key => {
            html += `<td style="background-color: #f3f3f3; font-weight: bold; text-align: center;">${key}</td>`;
        });
        html += `</tr>`;

        // Rest of the Rows
        data.forEach((row, rowIndex) => {
            html += `<tr><td class="row-number">${rowIndex + 2}</td>`;
            keys.forEach((key, colIndex) => {
                const value = row[key] !== undefined ? row[key] : '';
                let cellClass = '';
                
                // Add specific styling for risk grades if in MASTER sheet
                if (currentSheet === 'TM_MASTER' && key === 'riskGrade') {
                    const level = value.split(' ')[0];
                    cellClass = `badge badge-${level}`;
                }

                html += `<td class="excel-cell" data-address="${getColName(colIndex)}${rowIndex + 2}" data-value="${value}">
                            <span class="${cellClass}">${value}</span>
                         </td>`;
            });
            html += `</tr>`;
        });

        // Add some empty rows to feel like Excel
        for (let i = data.length + 2; i <= 30; i++) {
            html += `<tr><td class="row-number">${i}</td>`;
            keys.forEach(() => {
                html += `<td class="excel-cell"></td>`;
            });
            html += `</tr>`;
        }

        html += `</table>`;
        gridContainer.innerHTML = html;

        // Add Click Events to Cells
        document.querySelectorAll('.excel-cell').forEach(cell => {
            cell.onclick = () => selectCell(cell);
        });
    }

    function selectCell(cell) {
        if (selectedCell) selectedCell.classList.remove('selected');
        selectedCell = cell;
        selectedCell.classList.add('selected');

        const address = cell.getAttribute('data-address') || 'A1';
        const value = cell.getAttribute('data-value') || '';
        
        cellAddressDisplay.textContent = address;
        formulaInput.value = value;
    }

    // Ribbon Tab Interaction
    ribbonButtons.forEach(btn => {
        btn.onclick = () => {
            ribbonButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });

    // Initial Load
    renderTabs();
    renderGrid();
});
