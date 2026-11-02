// ========================================
// DASHBOARD KANTIN HSI-BS
// ========================================

// Shortcut untuk mengambil elemen HTML berdasarkan ID.
const $ = (id) => document.getElementById(id);

// Nama penyimpanan di LocalStorage.
const STORAGE_KEY = "hsiKantinProducts";
const THEME_KEY = "hsiKantinDarkMode";

// Data contoh untuk pertama kali aplikasi dibuka.
const defaultProducts = [
  { id: 1, name: "Nasi Goreng", category: "Makanan", price: 10000, stock: 24, sold: 38 },
  { id: 2, name: "Mie Ayam", category: "Makanan", price: 8000, stock: 18, sold: 23 },
  { id: 3, name: "Nasi Uduk", category: "Makanan", price: 7000, stock: 20, sold: 23 },
  { id: 4, name: "Air Mineral", category: "Minuman", price: 4000, stock: 45, sold: 34 },
  { id: 5, name: "Es Teh Manis", category: "Minuman", price: 3000, stock: 31, sold: 42 },
  { id: 6, name: "Roti Cokelat", category: "Snack", price: 5000, stock: 16, sold: 27 },
  { id: 7, name: "Pisang Goreng", category: "Snack", price: 6000, stock: 12, sold: 19 },
  { id: 8, name: "Soto Ayam", category: "Makanan", price: 12000, stock: 10, sold: 16 },
  { id: 9, name: "Jus Jeruk", category: "Minuman", price: 7000, stock: 14, sold: 21 },
  { id: 10, name: "Keripik Singkong", category: "Snack", price: 3000, stock: 28, sold: 18 }
];

// Ambil data lama jika tersedia.
let products = loadProducts();

// Variabel untuk menyimpan objek grafik.
let revenueChart = null;
let categoryChart = null;

// Menyimpan ID timer notifikasi.
let toastTimer;


// ========================================
// 1. LOCALSTORAGE
// ========================================

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const data = JSON.parse(saved);

      // Pastikan data yang dibaca benar-benar berupa array.
      if (Array.isArray(data)) {
        return data;
      }
    }

    // Jika belum ada data, gunakan data contoh.
    return defaultProducts.map((product) => ({ ...product }));
  } catch (error) {
    console.error("Gagal membaca data produk:", error);
    return defaultProducts.map((product) => ({ ...product }));
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}


// ========================================
// 2. FORMAT ANGKA DAN NOTIFIKASI
// ========================================

function rupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

function numberFormat(number) {
  return new Intl.NumberFormat("id-ID").format(number);
}

function showToast(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}


// ========================================
// 3. NAVIGASI HALAMAN
// ========================================

function showPage(pageName) {
  // Sembunyikan halaman lain dan tampilkan halaman pilihan.
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle(
      "active-page",
      page.id === `page-${pageName}`
    );
  });

  // Tandai menu yang sedang aktif.
  document.querySelectorAll(".nav-link").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.page === pageName
    );
  });

  const titles = {
    dashboard: "Dashboard",
    produk: "Produk",
    laporan: "Laporan",
    pengaturan: "Pengaturan"
  };

  $("breadcrumbPage").textContent = titles[pageName] || "Dashboard";

  // Tutup sidebar setelah menu dipilih di HP.
  $("sidebar").classList.remove("open");

  // Perbarui data sesuai halaman.
  if (pageName === "produk") renderProductsPage();
  if (pageName === "laporan") renderReport();
}


// ========================================
// 4. MODE GELAP
// ========================================

function setDarkMode(enabled) {
  document.body.classList.toggle("dark", enabled);

  $("darkSetting").checked = enabled;
  $("themeText").textContent = enabled ? "Mode terang" : "Mode gelap";
  $("themeIcon").textContent = enabled ? "☀" : "☾";

  localStorage.setItem(THEME_KEY, String(enabled));

  // Grafik perlu diperbarui agar warnanya tetap terbaca.
  renderCharts();
}


// ========================================
// 5. MENGHITUNG STATISTIK
// ========================================

function getSummary() {
  const days = Number($("dateFilter").value);
  const category = $("categoryFilter").value;

  // Ambil semua produk atau hanya kategori tertentu.
  const filteredProducts = category === "all"
    ? products
    : products.filter((product) => product.category === category);

  // Jumlah seluruh item yang terjual.
  const sold = filteredProducts.reduce((total, product) => {
    return total + product.sold;
  }, 0);

  // Perkiraan omzet berdasarkan harga dikali jumlah terjual.
  const revenue = filteredProducts.reduce((total, product) => {
    return total + product.sold * product.price;
  }, 0);

  // Ini hanya estimasi, bukan catatan transaksi sebenarnya.
  const transactions = Math.round(sold / 12 * (days / 7));

  return {
    days,
    category,
    filteredProducts,
    sold,
    revenue,
    transactions
  };
}

function renderStats() {
  const summary = getSummary();

  $("totalRevenue").textContent = rupiah(summary.revenue);
  $("totalSold").textContent = numberFormat(summary.sold);
  $("totalTransactions").textContent = numberFormat(summary.transactions);

  $("revenueNote").textContent =
    `Perkiraan omzet ${summary.days} hari`;

  $("soldNote").textContent =
    `Dari ${summary.filteredProducts.length} produk`;

  $("transactionNote").textContent =
    `Estimasi transaksi dalam ${summary.days} hari`;

  $("dateSummary").textContent =
    `${summary.days} hari terakhir · ${summary.filteredProducts.length} produk dalam filter`;
}


// ========================================
// 6. GRAFIK
// ========================================

// Data omzet contoh untuk grafik tujuh hari.
function getDailyRevenue(days) {
  const labels = [
    "Sab, 17",
    "Min, 18",
    "Sen, 19",
    "Sel, 20",
    "Rab, 21",
    "Kam, 22",
    "Jum, 23"
  ];

  const values = [
    220000,
    165000,
    200000,
    220000,
    195000,
    155000,
    260000
  ];

  // Pilih jumlah hari yang diminta.
  // Data dasarnya tetap data demo tujuh hari.
  const count = Math.min(days, 7);

  return {
    labels: labels.slice(7 - count),
    values: values.slice(7 - count)
  };
}

function renderCharts() {
  // Jika Chart.js gagal dimuat, lewati pembuatan grafik.
  if (typeof Chart === "undefined") {
    console.warn("Chart.js tidak tersedia.");
    return;
  }

  const summary = getSummary();
  const daily = getDailyRevenue(summary.days);
  const dark = document.body.classList.contains("dark");

  const textColor = dark ? "#c5ccd6" : "#707783";
  const gridColor = dark ? "#3b4350" : "#e5e8ed";

  // Hapus grafik lama sebelum membuat grafik baru.
  if (revenueChart) {
    revenueChart.destroy();
  }

  revenueChart = new Chart($("revenueChart"), {
    type: "bar",

    data: {
      labels: daily.labels,

      datasets: [{
        label: "Omzet",

        // Sesuaikan angka dengan periode yang dipilih.
        data: daily.values.map((value) => {
          return Math.round(value * summary.days / 7);
        }),

        backgroundColor: "#3979e8",
        borderRadius: 4,
        maxBarThickness: 28
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false
        },

        tooltip: {
          callbacks: {
            label: (context) => rupiah(context.raw)
          }
        }
      },

      scales: {
        x: {
          grid: {
            display: false
          },

          ticks: {
            color: textColor,
            font: { size: 10 }
          }
        },

        y: {
          beginAtZero: true,

          grid: {
            color: gridColor
          },

          ticks: {
            color: textColor,
            font: { size: 9 },

            callback: (value) => `${value / 1000}rb`
          }
        }
      }
    }
  });

  // Hitung item terjual untuk setiap kategori.
  const categories = ["Makanan", "Minuman", "Snack"];

  const values = categories.map((category) => {
    return summary.filteredProducts
      .filter((product) => product.category === category)
      .reduce((total, product) => total + product.sold, 0);
  });

  if (categoryChart) {
    categoryChart.destroy();
  }

  categoryChart = new Chart($("categoryChart"), {
    type: "doughnut",

    data: {
      labels: categories,

      datasets: [{
        data: values,

        backgroundColor: [
          "#3979e8",
          "#83b83b",
          "#b65bd8"
        ],

        borderWidth: 0,
        hoverOffset: 5
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",

      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  // Buat keterangan warna di bawah grafik donat.
  $("categoryLegend").innerHTML = categories.map((category, index) => {
    const colors = ["#3979e8", "#83b83b", "#b65bd8"];

    return `
      <span>
        <i style="background:${colors[index]}"></i>
        ${category}
      </span>
    `;
  }).join("");
}


// ========================================
// 7. MENAMPILKAN KATEGORI
// ========================================

function categoryBadge(category) {
  return `
    <span class="category-pill ${category.toLowerCase()}">
      ${escapeHTML(category)}
    </span>
  `;
}

// Menghindari teks nama produk dibaca sebagai HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return characters[character];
  });
}


// ========================================
// 8. TABEL RINGKAS DASHBOARD
// ========================================

function renderDashboardTable() {
  const query = $("dashboardSearch").value.trim().toLowerCase();
  const sort = $("dashboardSort").value;

  // Cari nama produk yang sesuai.
  let list = products.filter((product) => {
    return product.name.toLowerCase().includes(query);
  });

  // Urutkan produk sesuai pilihan.
  if (sort === "sold") {
    list.sort((a, b) => b.sold - a.sold);
  }

  if (sort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "revenue") {
    list.sort((a, b) => {
      return (b.price * b.sold) - (a.price * a.sold);
    });
  }

  if (sort === "stock") {
    list.sort((a, b) => a.stock - b.stock);
  }

  // Dashboard hanya menampilkan lima produk.
  const shown = list.slice(0, 5);

  $("dashboardProductRows").innerHTML = shown.map((product) => `
    <tr>
      <td>${escapeHTML(product.name)}</td>
      <td>${categoryBadge(product.category)}</td>
      <td>${numberFormat(product.sold)}</td>
      <td>${rupiah(product.price * product.sold)}</td>
      <td>
        <button
          class="delete-row"
          data-delete="${product.id}"
          title="Hapus produk"
          aria-label="Hapus ${escapeHTML(product.name)}"
        >✕</button>
      </td>
    </tr>
  `).join("");

  $("productTableFoot").textContent =
    `Menampilkan ${shown.length} dari ${list.length} produk`;
}


// ========================================
// 9. HALAMAN PRODUK
// ========================================

function renderProductsPage() {
  const query = $("productSearch").value.trim().toLowerCase();
  const category = $("productCategory").value;
  const sort = $("productSort").value;

  // Search dan filter kategori.
  let list = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(query);
    const matchesCategory =
      category === "all" || product.category === category;

    return matchesName && matchesCategory;
  });

  // Sorting.
  if (sort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  }

  if (sort === "sold") {
    list.sort((a, b) => b.sold - a.sold);
  }

  if (sort === "stock") {
    list.sort((a, b) => a.stock - b.stock);
  }

  $("productRows").innerHTML = list.map((product) => `
    <tr>
      <td><strong>${escapeHTML(product.name)}</strong></td>
      <td>${categoryBadge(product.category)}</td>
      <td>${rupiah(product.price)}</td>
      <td>${numberFormat(product.stock)}</td>
      <td>${numberFormat(product.sold)}</td>

      <td>
        ${
          product.stock <= 10
            ? '<span class="stock-pill low">Stok menipis</span>'
            : '<span class="stock-pill ok">Tersedia</span>'
        }
      </td>

      <td>
        <button class="edit-row" data-edit="${product.id}">
          Edit
        </button>

        <button class="delete-row" data-delete="${product.id}">
          ✕
        </button>
      </td>
    </tr>
  `).join("");

  $("allProductCount").textContent =
    `${list.length} produk ditemukan`;
}


// ========================================
// 10. TAMBAH PRODUK
// ========================================

function openAddDialog() {
  $("productForm").reset();

  // ID kosong berarti produk baru.
  $("editProductId").value = "";

  $("dialogTitle").textContent = "Tambah produk";

  $("formStock").value = 0;
  $("formSold").value = 0;

  $("productDialog").showModal();
}


// ========================================
// 11. EDIT PRODUK
// ========================================

function openEditDialog(id) {
  // Cari produk berdasarkan ID.
  const product = products.find((item) => item.id === id);

  if (!product) {
    return;
  }

  // Isi form menggunakan data produk yang dipilih.
  $("editProductId").value = product.id;
  $("dialogTitle").textContent = "Edit produk";

  $("formName").value = product.name;
  $("formCategory").value = product.category;
  $("formPrice").value = product.price;
  $("formStock").value = product.stock;
  $("formSold").value = product.sold;

  $("productDialog").showModal();
}


// ========================================
// 12. SIMPAN PRODUK BARU / EDIT
// ========================================

function saveProduct(event) {
  // Mencegah browser me-refresh saat form dikirim.
  event.preventDefault();

  const id = Number($("editProductId").value);

  const data = {
    name: $("formName").value.trim(),
    category: $("formCategory").value,
    price: Number($("formPrice").value),
    stock: Number($("formStock").value),
    sold: Number($("formSold").value)
  };

  // Validasi sederhana.
  if (
    !data.name ||
    !Number.isFinite(data.price) ||
    !Number.isFinite(data.stock) ||
    !Number.isFinite(data.sold) ||
    data.price < 1 ||
    data.stock < 0 ||
    data.sold < 0
  ) {
    showToast("Periksa kembali data produk.");
    return;
  }

  if (id) {
    // ID tersedia: perbarui produk yang sudah ada.
    const index = products.findIndex((product) => product.id === id);

    if (index !== -1) {
      products[index] = { id, ...data };
    }

    showToast("Produk berhasil diperbarui.");
  } else {
    // ID kosong: buat ID baru.
    const newId = products.length
      ? Math.max(...products.map((product) => product.id)) + 1
      : 1;

    products.push({
      id: newId,
      ...data
    });

    showToast("Produk berhasil ditambahkan.");
  }

  // Simpan perubahan dan perbarui seluruh halaman.
  saveProducts();

  $("productDialog").close();

  renderAll();
}


// ========================================
// 13. HAPUS PRODUK
// ========================================

function deleteProduct(id) {
  const product = products.find((item) => item.id === id);

  if (!product) {
    return;
  }

  // Minta persetujuan sebelum menghapus.
  const confirmed = confirm(
    `Yakin ingin menghapus produk "${product.name}"?`
  );

  if (!confirmed) {
    return;
  }

  // Buat array baru tanpa produk yang dipilih.
  products = products.filter((item) => item.id !== id);

  saveProducts();
  renderAll();

  showToast(`${product.name} berhasil dihapus.`);
}


// ========================================
// 14. LAPORAN
// ========================================

function renderReport() {
  const revenue = products.reduce((total, product) => {
    return total + product.price * product.sold;
  }, 0);

  const sold = products.reduce((total, product) => {
    return total + product.sold;
  }, 0);

  const best = [...products].sort((a, b) => b.sold - a.sold)[0];

  $("reportRevenue").textContent = rupiah(revenue);
  $("reportSold").textContent = numberFormat(sold);
  $("bestProduct").textContent = best ? best.name : "-";

  const sortedProducts = [...products].sort((a, b) => {
    return (b.price * b.sold) - (a.price * a.sold);
  });

  $("reportRows").innerHTML = sortedProducts.map((product) => `
    <tr>
      <td>${escapeHTML(product.name)}</td>
      <td>${categoryBadge(product.category)}</td>
      <td>${rupiah(product.price)}</td>
      <td>${numberFormat(product.sold)}</td>
      <td>${rupiah(product.price * product.sold)}</td>
    </tr>
  `).join("");
}


// ========================================
// 15. EKSPOR LAPORAN KE CSV
// ========================================

function exportCSV() {
  const rows = [
    ["Nama Produk", "Kategori", "Harga", "Stok", "Terjual", "Omzet"],

    ...products.map((product) => [
      product.name,
      product.category,
      product.price,
      product.stock,
      product.sold,
      product.price * product.sold
    ])
  ];

  // Ubah data menjadi format CSV.
  const csv = rows.map((row) => {
    return row.map((value) => {
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(",");
  }).join("\n");

  // BOM membantu Excel membaca UTF-8.
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "laporan-kantin-hsi.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  showToast("Laporan CSV berhasil diunduh.");
}


// ========================================
// 16. PERBARUI SEMUA TAMPILAN
// ========================================

function renderAll() {
  renderStats();
  renderCharts();
  renderDashboardTable();
  renderProductsPage();
  renderReport();
}


// ========================================
// 17. EVENT LISTENER
// ========================================

// Navigasi sidebar dan tombol yang menuju halaman lain.
document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(button.dataset.page);
  });
});

// Search dan sorting pada dashboard.
$("dashboardSearch").addEventListener("input", renderDashboardTable);
$("dashboardSort").addEventListener("change", renderDashboardTable);

// Filter periode dan kategori pada dashboard.
$("dateFilter").addEventListener("change", () => {
  renderStats();
  renderCharts();
});

$("categoryFilter").addEventListener("change", () => {
  renderStats();
  renderCharts();
});

// Search, filter, dan sorting pada halaman produk.
$("productSearch").addEventListener("input", renderProductsPage);
$("productCategory").addEventListener("change", renderProductsPage);
$("productSort").addEventListener("change", renderProductsPage);

// Tombol tambah produk.
$("addProductBtn").addEventListener("click", openAddDialog);

// Form tambah dan edit.
$("productForm").addEventListener("submit", saveProduct);

// Tombol menutup dialog.
$("closeDialog").addEventListener("click", () => {
  $("productDialog").close();
});

$("cancelDialog").addEventListener("click", () => {
  $("productDialog").close();
});

// Event delegation untuk tombol Edit dan Hapus.
$("productRows").addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) {
    openEditDialog(Number(editButton.dataset.edit));
  }

  if (deleteButton) {
    deleteProduct(Number(deleteButton.dataset.delete));
  }
});

// Tombol hapus pada tabel dashboard.
$("dashboardProductRows").addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete]");

  if (deleteButton) {
    deleteProduct(Number(deleteButton.dataset.delete));
  }
});

// Mode gelap dari sidebar dan pengaturan.
$("themeToggle").addEventListener("click", () => {
  const currentlyDark = document.body.classList.contains("dark");
  setDarkMode(!currentlyDark);
});

$("darkSetting").addEventListener("change", (event) => {
  setDarkMode(event.target.checked);
});

// Reset produk ke data awal.
$("resetData").addEventListener("click", () => {
  const confirmed = confirm(
    "Kembalikan semua produk ke data demo awal? Perubahan akan hilang."
  );

  if (!confirmed) {
    return;
  }

  products = defaultProducts.map((product) => ({ ...product }));

  saveProducts();
  renderAll();

  showToast("Data demo berhasil dikembalikan.");
});

// Tombol ekspor laporan.
$("exportCsv").addEventListener("click", exportCSV);

// Tombol hamburger untuk tampilan HP.
$("mobileMenu").addEventListener("click", () => {
  $("sidebar").classList.toggle("open");
});


// ========================================
// 18. SAAT APLIKASI PERTAMA DIBUKA
// ========================================

// Pulihkan pilihan mode gelap dari LocalStorage.
const savedTheme = localStorage.getItem(THEME_KEY) === "true";

document.body.classList.toggle("dark", savedTheme);

$("darkSetting").checked = savedTheme;
$("themeText").textContent = savedTheme ? "Mode terang" : "Mode gelap";
$("themeIcon").textContent = savedTheme ? "☀" : "☾";

// Tampilkan seluruh data awal.
renderAll();