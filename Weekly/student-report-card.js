const students = [
    {
        name: "Rezad",
        className: "Ibn Qoyyim",
        scores: [75, 80, 100],
        attendance: 95,
        hasViolation: false
    },
    {
        name: "Dzaky",
        className: "Ibn Katsir",
        scores: [85, 100, 60],
        attendance: 80,
        hasViolation: true
    },
    {
        name: "Shidqi",
        className: "Ibn Taimiyah",
        scores: [88, 93, 77],
        attendance: 89,
        hasViolation: false
    },
    
];

const reportDate = new Date();

console.log("==================================");
console.log("      HSI STUDENT REPORT CARD");
console.log("==================================");
console.log(`Tanggal : ${reportDate}`);

for (let i = 0; i < students.length; i++) {
    // proses data students[i]
    let total = 0;

    for (let j = 0; j < students[i].scores.length; j++) {
        total += students[i].scores[j];
    }

    let average = total / students[i].scores.length;


    let grade;

    if (average >= 90) {
        grade = "A";
    } else if (average >= 80) {
        grade = "B";
    } else if (average >= 70) {
        grade = "C";
    } else {
        grade = "D";
    }

    // Tentukan status
    let status;

    if (
        average >= 75 &&
        students[i].attendance >= 80 &&
        !students[i].hasViolation
    ) {
        status = "LULUS";
    } else {
        status = "BELUM LULUS";
    }

    // Tampilkan report
    console.log(`
--- Student Ke-${i + 1} ---
Nama       : ${students[i].name}
Kelas      : ${students[i].className}
Nilai      : ${students[i].scores}
Total      : ${total}
Rata-rata  : ${average}
Grade      : ${grade}
Kehadiran  : ${students[i].attendance}%
Pelanggaran: ${students[i].hasViolation}
Status     : ${status}
----------------------------------
`);
}