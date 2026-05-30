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
    let sortConfig = { key: null, direction: 'asc' };

    // Define all available sheets
    const sheetsData = {
        USAGE: [
            { "목적": "견인전동기 현황 + 교체이력 + 고장심각도 연결" },
            { "사용 원칙 1": "현재 상태는 TM_MASTER에서 관리" },
            { "사용 원칙 2": "고장유형은 표준고장유형에서 선택" },
            { "심각도": "1 경미 / 2 주의 / 3 중간위험 / 4 고위험 / 5 치명" }
        ],
        DASHBOARD: [
            { "항목": "총 TM 데이터", "값": 174, "심각도": 1, "건수": 66 },
            { "항목": "운영중", "값": 126, "심각도": 2, "건수": 9 },
            { "항목": "예비품", "값": 26, "심각도": 3, "건수": 10 },
            { "항목": "불용", "값": 22, "심각도": 5, "건수": 43 }
        ],
        TM_MASTER: [...tmData],
        HISTORY: [...tmHistory],
        FAILURE: [...tmFailureHistory],
        CODES: [...failureCodeMaster],
        MAPPING: [...failureDetailMap],
        RULES: [
            ...riskRules.age.map(r => ({ "구분": "노후점수", "조건": r.condition, "점수": r.score })),
            ...riskRules.failure.map(r => ({ "구분": "고장점수", "조건": `심각도 ${r.severity}`, "점수": r.score })),
            ...riskRules.repetition.map(r => ({ "구분": "반복점수", "조건": `이력 ${r.count}회`, "점수": r.score }))
        ],
        INPUT: [
            { "입력일자": "2026-05-01", "편성": "111", "차호": "1711", "위수": "1", "교체사유": "예시 입력" }
        ],
        LOOKUP: [
            { "유형": lookupLists.standardFailureTypes[0], "심각도": 1, "위험등급": lookupLists.riskGrades[0] },
            { "유형": lookupLists.standardFailureTypes[1], "심각도": 2, "위험등급": lookupLists.riskGrades[1] },
            { "유형": lookupLists.standardFailureTypes[2], "심각도": 3, "위험등급": lookupLists.riskGrades[2] }
        ]
    };

    const sheetNames = {
        USAGE: '사용방법', DASHBOARD: '대시보드', TM_MASTER: 'TM_MASTER',
        HISTORY: '교체이력', FAILURE: '고장이력', CODES: '고장코드',
        MAPPING: '판정가이드', RULES: '위험도기준', INPUT: 'INPUT_TEMPLATE', LOOKUP: 'LOOKUP_LIST'
    };

    // Initialize Tabs
    function renderTabs() {
        sheetTabsContainer.innerHTML = '';
        Object.keys(sheetNames).forEach(id => {
            const tab = document.createElement('div');
            tab.className = `sheet-tab ${currentSheet === id ? 'active' : ''}`;
            tab.textContent = sheetNames[id];
            tab.onclick = () => switchSheet(id);
            sheetTabsContainer.appendChild(tab);
        });
    }

    function switchSheet(sheetId) {
        currentSheet = sheetId;
        sortConfig = { key: null, direction: 'asc' };
        renderTabs();
        renderGrid();
    }

    function getColName(n) {
        let name = '';
        while (n >= 0) {
            name = String.fromCharCode((n % 26) + 65) + name;
            n = Math.floor(n / 26) - 1;
        }
        return name;
    }

    // Sorting Logic with Status Prioritization
    function handleSort(key) {
        if (sortConfig.key === key) {
            sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortConfig.key = key;
            sortConfig.direction = 'asc';
        }

        const data = sheetsData[currentSheet];
        data.sort((a, b) => {
            // Specialized Logic for TM_MASTER: Always keep Spare/Obsolete at bottom
            if (currentSheet === 'TM_MASTER') {
                const typeA = a.type || '';
                const typeB = b.type || '';
                const isNonOpA = (typeA === '예비품' || typeA === '불용' || typeA === '불용품');
                const isNonOpB = (typeB === '예비품' || typeB === '불용' || typeB === '불용품');

                if (!isNonOpA && isNonOpB) return -1; // A(운영중) comes first
                if (isNonOpA && !isNonOpB) return 1;  // B(운영중) comes first
                
                // If both are Non-Op, or both are Operational, proceed to normal key sort
            }

            let valA = a[key];
            let valB = b[key];

            // Handle numbers
            const numA = parseFloat(valA);
            const numB = parseFloat(valB);
            if (!isNaN(numA) && !isNaN(numB)) {
                valA = numA;
                valB = numB;
            } else {
                valA = String(valA || '').toLowerCase();
                valB = String(valB || '').toLowerCase();
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        renderGrid();
    }

    function updateData(rowIndex, key, newValue) {
        const data = sheetsData[currentSheet];
        if (data[rowIndex]) {
            data[rowIndex][key] = newValue;
        }
    }

    // Render Grid
    function renderGrid() {
        const data = sheetsData[currentSheet];
        const keys = data.length > 0 ? Object.keys(data[0]) : ['Empty'];
        
        let html = `<table class="google-grid">`;
        
        // Headers
        html += `<thead><tr><th class="row-number"></th>`;
        keys.forEach((_, i) => {
            html += `<th class="col-header">${getColName(i)}</th>`;
        });
        html += `</tr></thead>`;

        // Row 1: Sort Buttons
        html += `<tr><td class="row-number">1</td>`;
        keys.forEach(key => {
            const sortIcon = sortConfig.key === key ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : '↕️';
            html += `<td style="background-color: #f3f3f3; font-weight: bold; text-align: center;">
                        ${key}
                        <button class="sort-btn" data-key="${key}">${sortIcon}</button>
                     </td>`;
        });
        html += `</tr>`;

        // Data Rows
        data.forEach((row, rowIndex) => {
            html += `<tr><td class="row-number">${rowIndex + 2}</td>`;
            keys.forEach((key, colIndex) => {
                const value = row[key] !== undefined ? row[key] : '';
                let cellStyle = '';
                
                if (currentSheet === 'TM_MASTER' && (key === 'riskGrade' || key === 'totalRiskScore')) {
                    const gradeStr = String(row['riskGrade'] || '');
                    const level = gradeStr.split(' ')[0];
                    if (level === '5') cellStyle = 'background-color: #ffcccc; color: #cc0000; font-weight: bold;';
                    else if (level === '4') cellStyle = 'background-color: #fff4cc; color: #cc9900;';
                }

                html += `<td class="excel-cell" 
                            contenteditable="true"
                            data-row="${rowIndex}" 
                            data-key="${key}"
                            data-address="${getColName(colIndex)}${rowIndex + 2}" 
                            style="${cellStyle}">${value}</td>`;
            });
            html += `</tr>`;
        });

        // Filler
        for (let i = data.length + 2; i <= 40; i++) {
            html += `<tr><td class="row-number">${i}</td>`;
            keys.forEach(() => html += `<td class="excel-cell" contenteditable="true"></td>`);
            html += `</tr>`;
        }

        html += `</table>`;
        gridContainer.innerHTML = html;

        // Events
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                handleSort(btn.getAttribute('data-key'));
            };
        });

        document.querySelectorAll('.excel-cell').forEach(cell => {
            cell.onfocus = () => {
                if (selectedCell) selectedCell.classList.remove('selected');
                selectedCell = cell;
                selectedCell.classList.add('selected');
                cellAddressDisplay.textContent = cell.getAttribute('data-address');
                formulaInput.value = cell.innerText;
            };

            cell.oninput = () => {
                formulaInput.value = cell.innerText;
                const r = cell.getAttribute('data-row');
                const k = cell.getAttribute('data-key');
                if (r !== null && k) updateData(parseInt(r), k, cell.innerText);
            };
        });
    }

    // Ribbon
    ribbonButtons.forEach(btn => {
        btn.onclick = () => {
            ribbonButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });

    renderTabs();
    renderGrid();
});
