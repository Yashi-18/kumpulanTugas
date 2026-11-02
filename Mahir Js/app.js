console.error("Ini pesan error!")

console.warn("Ini peringatan.")

console.info("Informasi tambahan.")


let namaPengguna; // Deklarasi variabel 'namaPengguna' tanpa nilai awal
namaPengguna = "Budi"; // Ngasih nilai ke variabel
console.log(namaPengguna); // Output: Budi
 
let usia = 25; // Deklarasi variabel 'usia' dan langsung ngasih nilai
console.log(usia); // Output: 25
 
usia = 26; // Nilai 'usia' bisa diubah
console.log(usia); // Output: 26

const PI = 3.14159;
console.log(PI); // Output: 3.14159
 
// PI = 3.14; // Ini bakal error! Nilai const gak bisa diubah.
 
const namaSitus = "WebsiteKeren.com";
// namaSitus = "WebsiteLain.com"; // Error juga!

let salam = "Halo, JavaScript!";
let namaDepan = "Budi";
let pesanLengkap = `Selamat datang, ${namaDepan}!`; // Pake template literal
console.log(pesanLengkap); // Output: Selamat datang, Budi!

let sudahMenikah = false;
let lampuMenyala = true;
let lebihBesar = 10 > 5; // Hasilnya true
console.log(lebihBesar); // Output: true

let dataPengguna = null; // Sengaja dikosongin, mungkin nanti diisi data

let x = 10; // x sekarang tipenya Number
console.log(typeof x); // Output: "number"
 
x = "Halo"; // x sekarang tipenya String
console.log(typeof x); // Output: "string"

console.log(typeof "Budi"); // Output: "string"
console.log(typeof 123); // Output: "number"
console.log(typeof true); // Output: "boolean"
console.log(typeof undefined); // Output: "undefined"
console.log(typeof null); // Output: "object" (Ini salah satu "quirk" atau keanehan JavaScript, null seharusnya primitif tapi typeof-nya object)
let nama;
console.log(typeof nama); // Output: "undefined"

let hargaBuku = 50000;
let jumlahBeli = 3;
let ongkir = 10000;
 
let totalBelanja = (hargaBuku * jumlahBeli) + ongkir;
console.log("Total belanja:", totalBelanja); // Output: Total belanja: 160000
 
let angka = 10;
angka++; // sekarang angka jadi 11
console.log("Angka setelah increment:", angka);
 
let sisaKue = 7 % 3; // 7 kue dibagi ke 3 orang, sisanya berapa?
console.log("Sisa kue:", sisaKue); // Output: Sisa kue: 1

let skor = 100;
skor += 50; // sama kayak skor = skor + 50;
console.log("Skor sekarang:", skor); // Output: Skor sekarang: 150
 
let sisaStok = 20;
sisaStok -= 5; // sama kayak sisaStok = sisaStok - 5;
console.log("Sisa stok:", sisaStok); // Output: Sisa stok: 15

let umurBudi = 20;
let umurAni = 22;
 
console.log("Apakah umur Budi sama dengan 20?", umurBudi === 20); // Output: true
console.log("Apakah umur Ani lebih tua dari Budi?", umurAni > umurBudi); // Output: true
console.log("Apakah '10' sama dengan 10 (pake ==)?", "10" == 10); // Output: true (karena konversi tipe)
console.log("Apakah '10' sama persis dengan 10 (pake ===)?", "10" === 10); // Output: false (tipe beda)

let punyaSIM = true;
let umurCukup = 18;
let usiaPengemudi = 20;
 
let bolehMenyetir = punyaSIM && (usiaPengemudi >= umurCukup);
console.log("Boleh menyetir?", bolehMenyetir); // Output: Boleh menyetir? true
 
let hariLibur = false;
let cuacaCerah = true;
let bisaPiknik = hariLibur || cuacaCerah;
console.log("Bisa piknik?", bisaPiknik); // Output: Bisa piknik? true (karena cuaca cerah)
 
let lampuMenyala = true;
console.log("Apakah lampu mati?", !lampuMenyala); // Output: Apakah lampu mati? false

let namaDepan = "Budi";
let namaBelakang = "Sanjaya";
let namaLengkap = namaDepan + " " + namaBelakang; // Tambahin spasi di tengah
console.log(namaLengkap); // Output: Budi Sanjaya
 
let pesan = "Umur saya " + 25 + " tahun."; // Angka 25 dikonversi jadi string
console.log(pesan); // Output: Umur saya 25 tahun.

let usia = 17;
let status = (usia >= 18) ? "Dewasa" : "Anak-anak";
console.log("Status:", status); // Output: Status: Anak-anak
 
let adaDiskon = true;
let harga = 100000;
let hargaFinal = harga - (adaDiskon ? 20000 : 0); // Kalau ada diskon, kurangin 20rb, kalau gak, kurangin 0
console.log("Harga final:", hargaFinal); // Output: Harga final: 80000