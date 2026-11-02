const studentName = "  aHmAd fAuZaN  ";
const ageText = "17 tahun";
const scoreText = "85.678";
const registrationText = "21-08-2026";

console.log("╔════════════════════════════════════╗");
console.log("║     🎓 STUDENT DATA PROCESSOR      ║");
console.log("╚════════════════════════════════════╝");

// PART 1

const trimName = studentName.trim();
const lowerName = trimName.toLowerCase();
const words = lowerName.split(" "); // Pisain Stringnya ketemu spasi. ["ahmad", "fauzan"]
// words nya jadi kek data array gitu, "ahmad index ke 0", "fauzan index ke 1"
const word1 = words[0][0].toUpperCase() + words[0].slice(1);
// index ke 0, ambil di index ke 0 nya tuh huruf index ke 0 juga, "A", trus di jadiin gede, di tambahkata yg index ke 0, trus di potong,(ambil bagian index ke 1,"hmad") jadi "Ahmad"
const word2 = words[1][0].toUpperCase() + words[1].slice(1);
const cleanName = [word1, word2].join(" "); // kebalikan dr split, digabung semua jd satu string
// USERNME
const username = words.join(".").toLowerCase();
// kata tadi, di gabungin pake titik, trus di jadiin kecil semua
console.log("👤 STUDENT")
console.log("────────────────────────────────────")
console.log("Original Name : " + studentName);
console.log("Clean Name    : " + cleanName);
console.log("Username      : " + username);

// PART 2
console.log("🔎 NAME ANALYSIS")
console.log("────────────────────────────────────")
const cekNama = cleanName.includes("Ahmad");

if (cekNama) {

    console.log("Contains Ahmad : " + cekNama);

} else {

    console.log("Contains Ahmad : " + cekNama);

}

const potongNama = cleanName.slice(0, 5);

const gantiNama = cleanName.replace("Ahmad", "Budi");

console.log("First 5 chars  : " + potongNama);

console.log("Replacement    : " + gantiNama);

// PART 3
console.log("🎂 AGE")
console.log("────────────────────────────────────")
const teksUmur = parseInt(ageText);
const currentYear = new Date().getFullYear();
const age = 17;
const birthYear = currentYear - age;
console.log(`Current Year : ${currentYear}`);
console.log(`Age Text     : ${ageText}`);
console.log(`Age          : ${age}`);
console.log(`Birth Year   : ${birthYear}`);

// PART 4
console.log("📊 SCORE")
console.log("────────────────────────────────────")
const score = parseFloat(scoreText);

const hasilBulat = score.toFixed(2);

const round = Math.round(score);
const floor = Math.floor(score);
const ceil = Math.ceil(score);

console.log(`Original Score : ${scoreText}`);
console.log(`Score          : ${score}`);
console.log(`Formatted      : ${hasilBulat}`);

console.log(` Round : ${round}`);
console.log(`Floor : ${floor}`);
console.log(`Ceil  : ${ceil}`);

// PART 5
let grade;
if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else if (score >= 70) {
    grade = "C";
} else if (score >= 60) {
    grade = "D";
} else {
    grade = "E";
};
console.log(`Grade : ${grade}`);

// PART 6
console.log("📅 REGISTRATION");
console.log("────────────────────────────────────");
const pisahDate = registrationText.split("-")
const registrationDay = Number(pisahDate[0])
const registrationMonth = Number(pisahDate[1])
const registrationYear = Number(pisahDate[2])
console.log(`Day : ${registrationDay}`);
console.log(`Month : ${registrationMonth}`);
console.log(`Year : ${registrationYear}`);

// PART 7
console.log("🕐 REPORT GENERATED")
console.log("────────────────────────────────────")
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const date = now.getDate();
const day = now.getDay();
const hours = now.getHours();
const minutes = now.getMinutes();
console.log(`Year   : ${year}`);
console.log(`Month  : ${month}`);
console.log(`Date   : ${date}`);
console.log(`Day    : ${day}`);
console.log(`Time   : ${hours}:${minutes}`);

// PART 8

function formatDate(date) {

    const day = String(date.getDate()).padStart(2, "0");

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const year = String(date.getFullYear());

    return day + "/" + month + "/" + year;

}

const reportDate = formatDate(now);

console.log("Report Date : " + reportDate);

// PART 9
console.log("🎲 LUCKY DICE")
console.log("────────────────────────────────────")
const dice = Math.floor(Math.random() * 6) + 1;

let diceResult;

if (dice === 6) {

    diceResult = "🔥 JACKPOT!";

} else if (dice === 1) {

    diceResult = "💀 BAD LUCK!";

} else {

    diceResult = "😎 GOOD LUCK!";

}

console.log("Lucky Dice : " + dice);

console.log("Result : " + diceResult);

// PART 10

console.log("╔════════════════════════════════════╗");

console.log("║       🚀 PROCESS COMPLETE!         ║");

console.log("╚════════════════════════════════════╝");