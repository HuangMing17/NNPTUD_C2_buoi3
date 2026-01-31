let products = [];
let filtered = [];
let sortBy = '';
let sortOrder = 'asc';
let page = 1;
let pageSize = 5;

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const searchInput = document.getElementById('searchInput');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const productTableBody = document.getElementById('productTableBody');
const sortTitle = document.getElementById('sortTitle');
const sortPrice = document.getElementById('sortPrice');
const firstPageBtn = document.getElementById('firstPage');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const lastPageBtn = document.getElementById('lastPage');
const pageInfo = document.getElementById('pageInfo');

async function getAll() {
  const res = await fetch('https://api.escuelajs.co/api/v1/products');
  products = await res.json();
  render();
}

function render() {
  // Filter
  const search = searchInput.value.trim().toLowerCase();
  filtered = products.filter(p => p.title.toLowerCase().includes(search));

  // Sort
  if (sortBy) {
    filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      }
      return 0;
    });
  }

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  if (page > totalPages) page = totalPages || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Render table
  productTableBody.innerHTML = paged.map((p, idx) => `
    <tr class="${idx % 2 === 0 ? 'even' : 'odd'}">
      <td><img src="${p.images[0]}" alt="${p.title}" class="product-img"></td>
      <td>${p.title}</td>
      <td>${p.price}</td>
      <td>${p.category?.name || ''}</td>
      <td>
        <span class="desc-hover">(Di chuột để xem)
          <span class="desc-tooltip">${p.description}</span>
        </span>
      </td>
    </tr>
  `).join('');

  // Pagination info
  pageInfo.textContent = `Trang ${page}/${totalPages || 1}`;
  firstPageBtn.disabled = page === 1;
  prevPageBtn.disabled = page === 1;
  nextPageBtn.disabled = page === totalPages || totalPages === 0;
  lastPageBtn.disabled = page === totalPages || totalPages === 0;
}

searchInput.addEventListener('input', () => {
  page = 1;
  render();
});

pageSizeSelect.addEventListener('change', e => {
  pageSize = Number(e.target.value);
  page = 1;
  render();
});

sortTitle.addEventListener('click', () => {
  if (sortBy === 'title') {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy = 'title';
    sortOrder = 'asc';
  }
  render();
});

sortPrice.addEventListener('click', () => {
  if (sortBy === 'price') {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy = 'price';
    sortOrder = 'asc';
  }
  render();
});

firstPageBtn.addEventListener('click', () => { page = 1; render(); });
prevPageBtn.addEventListener('click', () => { if (page > 1) { page--; render(); } });
nextPageBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(filtered.length / pageSize);
  if (page < totalPages) { page++; render(); }
});
lastPageBtn.addEventListener('click', () => {
  page = Math.ceil(filtered.length / pageSize) || 1;
  render();
});

document.addEventListener('DOMContentLoaded', getAll);
