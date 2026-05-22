export const lookupLists = {
    standardFailureTypes: [
        "정기/예방교체", "정류자 이상", "MOCD/보호동작", "브러쉬/홀더 이상", 
        "절연저항/절연불량", "절연파괴/접지소손", "세이프티 너트 이상", 
        "계자계통 이상", "기계/진동/베어링 이상", "기타"
    ],
    severities: [1, 2, 3, 4, 5],
    riskGrades: ["1 정상", "2 관찰", "3 주의", "4 고위험", "5 치명"]
};

export const riskRules = {
    age: [
        { condition: "50년 이상", score: 25, min: 50, max: 999 },
        { condition: "40~49년", score: 20, min: 40, max: 49 },
        { condition: "30~39년", score: 15, min: 30, max: 39 },
        { condition: "20~29년", score: 10, min: 20, max: 29 },
        { condition: "20년 미만", score: 5, min: 0, max: 19 }
    ],
    failure: [
        { severity: 1, score: 10, desc: "경미" },
        { severity: 2, score: 25, desc: "주의" },
        { severity: 3, score: 45, desc: "중간위험" },
        { severity: 4, score: 70, desc: "고위험" },
        { severity: 5, score: 100, desc: "치명" }
    ],
    repetition: [
        { count: 1, score: 3, desc: "낮음" },
        { count: 2, score: 8, desc: "관찰" },
        { count: 3, score: 15, desc: "주의" },
        { count: 4, score: 20, desc: "높음" }
    ],
    status: [
        { type: "불용품", score: 10, desc: "사용불가 가중" }
    ]
};

export const failureDetailMap = [
    { detail: "정류자 그을림", severity: 1, score: 10, standard: "정류자 이상" },
    { detail: "MOCD 발생", severity: 1, score: 10, standard: "MOCD/보호동작" },
    { detail: "브러쉬홀더 마모한도 도달", severity: 1, score: 10, standard: "브러쉬/홀더 이상" },
    { detail: "절연저항 불량", severity: 2, score: 25, standard: "절연저항/절연불량" },
    { detail: "절연불량 = 물유입", severity: 2, score: 25, standard: "절연저항/절연불량" },
    { detail: "세이프티 너트 탈락", severity: 2, score: 25, standard: "세이프티 너트 이상" },
    { detail: "브러쉬홀더 열화", severity: 3, score: 45, standard: "브러쉬/홀더 이상" },
    { detail: "계자 코일 단락", severity: 3, score: 45, standard: "계자계통 이상" },
    { detail: "브러쉬홀더 리드선 절손 및 열화", severity: 4, score: 70, standard: "브러쉬/홀더 이상" },
    { detail: "정류자 F/O", severity: 5, score: 100, standard: "정류자 이상" },
    { detail: "계자 F/O", severity: 5, score: 100, standard: "계자계통 이상" },
    { detail: "절연파괴=눈유입=접지소손", severity: 5, score: 100, standard: "절연파괴/접지소손" },
    { detail: "고압배선 소손(절연파괴로 폐기)", severity: 5, score: 100, standard: "절연파괴/접지소손" },
    { detail: "브러쉬절손", severity: 5, score: 100, standard: "브러쉬/홀더 이상" }
];

export const failureCodeMaster = [
    { code: "FT00", name: "정기/예방교체", severity: 1, score: 10, desc: "정기·예방 목적 교체. 직접 고장 영향도는 낮음", keywords: ["정기", "예방"] },
    { code: "FT01", name: "정류자 이상", severity: 1, score: 10, desc: "정류자 그을림·F/O 등 정류자 계통 이상", keywords: ["정류자", "그을림", "F/O", "FO"] },
    { code: "FT02", name: "MOCD/보호동작", severity: 1, score: 10, desc: "MOCD 발생 등 보호동작 관련 이력", keywords: ["MOCD"] },
    { code: "FT99", name: "기타", severity: 1, score: 10, desc: "표준유형 외 기타. 입력 시 심각도 1~5를 별도 선택", keywords: ["기타"] },
    { code: "FT04", name: "절연저항/절연불량", severity: 2, score: 25, desc: "절연저항 불량·물/눈 유입 등 초기 절연계통 이상", keywords: ["절연저항", "절연불량", "물유입", "눈유입"] },
    { code: "FT06", name: "세이프티 너트 이상", severity: 2, score: 25, desc: "세이프티 너트 탈락 등 체결계통 이상", keywords: ["세이프티", "너트"] },
    { code: "FT03", name: "브러쉬/홀더 이상", severity: 3, score: 45, desc: "브러쉬홀더 마모·열화·리드선 절손·브러쉬 절손", keywords: ["브러쉬", "홀더", "리드선"] },
    { code: "FT08", name: "기계/진동/베어링 이상", severity: 3, score: 45, desc: "진동·베어링·소음 등 기계계통 이상", keywords: ["진동", "베어링", "소음"] },
    { code: "FT07", name: "계자계통 이상", severity: 4, score: 70, desc: "계자 코일 단락·계자 F/O 등 계자계통 이상", keywords: ["계자"] },
    { code: "FT05", name: "절연파괴/접지소손", severity: 5, score: 100, desc: "절연파괴, 접지소손, 고압배선 소손, 폐기 수준 중대고장", keywords: ["절연파괴", "접지", "소손", "폐기", "고압배선"] }
];

export const tmData = [
    { tmId: "TM-111-001", status: "운영중", train: "111", pos: "M1", serial: "98TWDH392", year: 1998, maker: "현대중공업", age: 28, riskScore: 10, riskGrade: "1 정상", failureType: "" },
    { tmId: "TM-111-002", status: "운영중", train: "111", pos: "M2", serial: "98TWDH397", year: 1998, maker: "현대중공업", age: 28, riskScore: 10, riskGrade: "1 정상", failureType: "" },
    { tmId: "TM-111-003", status: "운영중", train: "111", pos: "M3", serial: "96TWDH243", year: 1996, maker: "현대중공업", age: 30, riskScore: 15, riskGrade: "1 정상", failureType: "" },
    { tmId: "TM-111-004", status: "운영중", train: "111", pos: "M4", serial: "96TWDH006", year: 1992, maker: "현대중공업", age: 34, riskScore: 15, riskGrade: "1 정상", failureType: "" },
    { tmId: "TM-111-005", status: "운영중", train: "111", pos: "M5", serial: "296637-8", year: 1974, maker: "히타치", age: 52, riskScore: 73, riskGrade: "4 고위험", failureType: "브러쉬/홀더 이상" },
    { tmId: "TM-111-015", status: "운영중", train: "111", pos: "M15", serial: "88091-48", year: 1989, maker: "대우중공업", age: 37, riskScore: 100, riskGrade: "5 치명", failureType: "정류자 이상" },
    { tmId: "TM-111-021", status: "운영중", train: "111", pos: "M21", serial: "296639-9", year: 1974, maker: "히타치", age: 52, riskScore: 100, riskGrade: "5 치명", failureType: "정류자 이상" },
    { tmId: "TM-112-002", status: "운영중", train: "112", pos: "M2", serial: "296633-10", year: 1974, maker: "히타치", age: 52, riskScore: 100, riskGrade: "5 치명", failureType: "절연파괴/접지소손" },
    { tmId: "TM-112-011", status: "운영중", train: "112", pos: "M11", serial: "59812", year: 1974, maker: "미쓰비시", age: 52, riskScore: 100, riskGrade: "5 치명", failureType: "정류자 이상" },
    { tmId: "TM-112-014", status: "운영중", train: "112", pos: "M14", serial: "88091-57", year: 1989, maker: "대우중공업", age: 37, riskScore: 100, riskGrade: "5 치명", failureType: "절연파괴/접지소손" },
    { tmId: "TM-112-015", status: "운영중", train: "112", pos: "M15", serial: "296634-9", year: 1974, maker: "히타치", age: 52, riskScore: 100, riskGrade: "5 치명", failureType: "브러쉬/홀더 이상" },
    { tmId: "TM-116-002", status: "운영중", train: "116", pos: "M2", serial: "64057", year: 1977, maker: "미쓰비시", age: 49, riskScore: 100, riskGrade: "5 치명", failureType: "절연파괴/접지소손" },
    { tmId: "TM-SP-001", status: "예비품", train: "", pos: "예비-001", serial: "296640-10", year: 1974, maker: "히타치", age: 52, riskScore: 100, riskGrade: "5 치명", failureType: "정류자 이상" },
    { tmId: "TM-DIS-002", status: "불용", train: "", pos: "불용-002", serial: "92TWDH050", year: 1992, maker: "현대중공업", age: 34, riskScore: 100, riskGrade: "5 치명", failureType: "절연파괴/접지소손" }
];

export const tmHistory = [
    { id: "RP-0001", date: "2021-02-04", train: "111", car: "1711", pos: "2", outSerial: "88TWDH073", inSerial: "88091-48", reason: "눈유입, 정류자 그을림, 접지 소손", type: "절연파괴/접지소손", severity: 5 },
    { id: "RP-0002", date: "2021-02-09", train: "111", car: "1711", pos: "3", outSerial: "296638-17", inSerial: "296638-19", reason: "눈유입(절연파괴)", type: "절연파괴/접지소손", severity: 5 },
    { id: "RP-0028", date: "2021-10-28", train: "111", car: "1811", pos: "1", outSerial: "87TWDH047", inSerial: "94101-88", reason: "접지 소손, 정류자 F/O", type: "절연파괴/접지소손", severity: 5 },
    { id: "RP-0031", date: "2022-02-23", train: "111", car: "1711", pos: "3", outSerial: "92TWDH048", inSerial: "297207-4", reason: "절연파괴", type: "절연파괴/접지소손", severity: 5 },
    { id: "RP-0032", date: "2022-02-23", train: "111", car: "1711", pos: "2", outSerial: "88091-48", inSerial: "98TWDH398", reason: "정류자 F/O", type: "정류자 이상", severity: 5 },
    { id: "RP-0043", date: "2022-05-09", train: "111", car: "1711", pos: "1", outSerial: "98TWDH393", inSerial: "297207-4", reason: "정류자 F/O", type: "정류자 이상", severity: 5 },
    { id: "RP-0044", date: "2022-05-09", train: "111", car: "1711", pos: "2", outSerial: "98TWDH398", inSerial: "98TWDH395", reason: "브러시홀더 리드선 절손 및 열화", type: "정류자 이상", severity: 5 },
    { id: "RP-0048", date: "2022-07-15", train: "111", car: "1811", pos: "1", outSerial: "94101-88", inSerial: "95111-04", reason: "접지 소손, 정류자 F/O, 물유입", type: "절연파괴/접지소손", severity: 5 }
];

export const tmFailureHistory = [
    { id: "FL-0001", date: "2021-02-04", serial: "88TWDH073", type: "절연파괴/접지소손", severity: 5, cause: "눈유입, 정류자 그을림, 접지 소손", status: "", replacementId: "RP-0001" },
    { id: "FL-0002", date: "2021-02-09", serial: "296638-17", type: "절연파괴/접지소손", severity: 5, cause: "눈유입(절연파괴)", status: "정비불가(절연파괴, 폐기)", replacementId: "RP-0002" },
    { id: "FL-0028", date: "2021-10-28", serial: "87TWDH047", type: "절연파괴/접지소손", severity: 5, cause: "접지 소손, 정류자 F/O", status: "정비불가(절연파괴, 폐기)", replacementId: "RP-0028" },
    { id: "FL-0032", date: "2022-02-23", serial: "88091-48", type: "정류자 이상", severity: 5, cause: "정류자 F/O", status: "", replacementId: "RP-0032" },
    { id: "FL-0044", date: "2022-05-09", serial: "98TWDH398", type: "정류자 이상", severity: 5, cause: "브러시홀더 리드선 절손 및 열화, 정류자 F/O", status: "정비불가(정류자면 손상)", replacementId: "RP-0044" },
    { id: "FL-0048", date: "2022-07-15", serial: "94101-88", type: "절연파괴/접지소손", severity: 5, cause: "접지 소손, 정류자 F/O, 물유입", status: "정비불가(절연파괴, 폐기)", replacementId: "RP-0048" },
    { id: "FL-0074", date: "2023-06-05", serial: "296635-12", type: "정류자 이상", severity: 5, cause: "정류자 F/O, 패임, 홀더양호", status: "", replacementId: "RP-0074" }
];
