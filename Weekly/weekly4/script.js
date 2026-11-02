console.log('=== MATERI 5 - CONSUME API ===');

const API_URL = 'https://dummyjson.com/products?limit=0';

const productGrid = document.getElementById('product-grid');
const loadingState = document.getElementById('loading-state');
const resultSummary = document.getElementById('result-summary');
const categorySelect = document.getElementById('category-select');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const resetBtn = document.getElementById('reset-btn');
const reloadBtn = document.getElementById('reload-btn');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retry-btn');
const emptyState = document.getElementById('empty-state');
const productDialog = document.getElementById('product-dialog');
const dialogClose = document.getElementById('dialog-close');
const dialogContent = document.getElementById('dialog-content');

let products = [];

// Menampilkan produk ke halaman
function renderProduct(dataProducts) {
    productGrid.innerHTML = '';

    dataProducts.forEach(dataProduct => {
        const { id, title, price, category, thumbnail, rating } = dataProduct;

        productGrid.innerHTML += `
            <article class="product-card">
                <div class="product-image-wrap">
                    <img class="product-image" src="${thumbnail}" alt="${title}" loading="lazy">
                </div>

                <div class="product-body">
                    <span class="product-category">${category}</span>

                    <h3 class="product-title">${title}</h3>

                    <div class="product-meta">
                        <span class="product-price">$${price.toFixed(2)}</span>
                        <span class="product-rating">⭐ ${rating}</span>
                    </div>

                    <button type="button" class="detail-btn" data-id="${id}">
                        Lihat Detail
                    </button>
                </div>
            </article>
        `;
    });
}

// Mengambil data produk dari API
const getProducts = async () => {
    showLoading();

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Gagal mengambil data dari API.');
        }

        const data = await response.json();
        products = data.products;

        await getProductCategories();
        applyFilters();

    } catch (error) {
        showError(error.message);
        console.error('Error on getProducts:', error);
    }
};

// Mengambil kategori produk
const getProductCategories = async () => {
    try {
        const response = await fetch('https://dummyjson.com/products/categories');

        if (!response.ok) {
            throw new Error('Gagal mengambil kategori.');
        }

        const data = await response.json();

        categorySelect.innerHTML = '<option value="all">Semua kategori</option>';

        data.forEach(category => {
            const slug = typeof category === 'string' ? category : category.slug;
            const name = typeof category === 'string' ? category : category.name;

            categorySelect.innerHTML += `
                <option value="${slug}">${name}</option>
            `;
        });
    } catch (error) {
        console.error('Error on getProductCategories:', error);
    }
};

// Search + Filter + Sorting
function applyFilters() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categorySelect.value;
    const selectedSort = sortSelect.value;

    let filteredProducts = products.filter(product => {
        const matchSearch =
            product.title.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText) ||
            product.brand?.toLowerCase().includes(searchText);

        const matchCategory =
            selectedCategory === 'all' || product.category === selectedCategory;

        return matchSearch && matchCategory;
    });

    // Sorting
    if (selectedSort === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'rating-desc') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === 'name-asc') {
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (filteredProducts.length === 0) {
        productGrid.hidden = true;
        emptyState.hidden = false;
    } else {
        productGrid.hidden = false;
        emptyState.hidden = true;
        renderProduct(filteredProducts);
    }

    resultSummary.hidden = false;
    resultSummary.textContent =
        `Menampilkan ${filteredProducts.length} dari ${products.length} produk`;

    loadingState.hidden = true;
    errorState.hidden = true;
}

// Menampilkan detail produk dalam popup
function showProductDetail(id) {
    const product = products.find(item => item.id === id);

    if (!product) {
        return;
    }

    const {
        title,
        description,
        price,
        discountPercentage,
        rating,
        stock,
        brand,
        category,
        thumbnail
    } = product;

    dialogContent.innerHTML = `
        <div class="dialog-detail">
            <div>
                <img class="dialog-image" src="${thumbnail}" alt="${title}">
            </div>

            <div class="dialog-copy">
                <span class="product-category">${category}</span>
                <h2>${title}</h2>
                <p>${description}</p>

                <div class="detail-list">
                    <div class="detail-row">
                        <span>Harga</span>
                        <strong>$${price.toFixed(2)}</strong>
                    </div>

                    <div class="detail-row">
                        <span>Diskon</span>
                        <strong>${discountPercentage}%</strong>
                    </div>

                    <div class="detail-row">
                        <span>Rating</span>
                        <strong>⭐ ${rating}</strong>
                    </div>

                    <div class="detail-row">
                        <span>Stok</span>
                        <strong>${stock}</strong>
                    </div>

                    <div class="detail-row">
                        <span>Brand</span>
                        <strong>${brand || '-'}</strong>
                    </div>
                </div>
            </div>
        </div>
    `;

    productDialog.showModal();
}

function showLoading() {
    loadingState.hidden = false;
    productGrid.hidden = true;
    emptyState.hidden = true;
    errorState.hidden = true;
    resultSummary.hidden = true;
}

function showError(message) {
    loadingState.hidden = true;
    productGrid.hidden = true;
    emptyState.hidden = true;
    errorState.hidden = false;
    resultSummary.hidden = true;
    errorMessage.textContent = message;
}

// Event search
searchInput.addEventListener('input', applyFilters);

// Event filter kategori
categorySelect.addEventListener('change', applyFilters);

// Event sorting
sortSelect.addEventListener('change', applyFilters);

// Tombol reset search, filter, dan sorting
resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = 'all';
    sortSelect.value = 'default';
    applyFilters();
});

// Tombol reload data
reloadBtn.addEventListener('click', getProducts);

// Tombol retry ketika error
retryBtn.addEventListener('click', getProducts);

// Event tombol detail produk
productGrid.addEventListener('click', event => {
    const detailButton = event.target.closest('.detail-btn');

    if (!detailButton) {
        return;
    }

    const id = Number(detailButton.dataset.id);
    showProductDetail(id);
});

// Tombol tutup popup
dialogClose.addEventListener('click', () => {
    productDialog.close();
});

// Klik area luar popup untuk menutup
productDialog.addEventListener('click', event => {
    if (event.target === productDialog) {
        productDialog.close();
    }
});

// Ambil data saat halaman dibuka
getProducts();
