const productList = document.getElementById('productList');
const form = document.getElementById('searchForm');
const searchContent = document.getElementById('searchContent');
const alertMessage = document.getElementById('alertMessage');
const category = document.getElementById('category');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function productCard(data, divType) {
  shuffleArray(data); // Shuffle the data array randomly
  divType.innerHTML = '';
  data.forEach(product => {
    divType.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card">
          <img src="${product.thumbnail}" class="card-img-top" alt="Product Image">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">$${product.price}</p>
            <p class="card-text">Rating: ${product.rating}</p>
            <p class="card-text">Category: ${product.category}</p>
          </div>
        </div>
      </div>
    `;
  });
}

async function makeRequest() {
  // Fetch products
  const res = await fetch('https://dummyjson.com/products');
  const data = await res.json();
  productCard(data.products, productList);

  // Fetch categories
  const response = await fetch('https://dummyjson.com/products/categories');
  const categories = await response.json();
  categories.forEach(categoryName => {
    category.innerHTML += `<option value="${categoryName}">${categoryName}</option>`;
  });
}

async function getCategory(selectCategory) {
  const url = selectCategory
    ? `https://dummyjson.com/products/category/${selectCategory}`
    : `https://dummyjson.com/products/categories`;
  const res = await fetch(url);
  const data = await res.json();
  return data.products;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  searchContent.innerHTML = '';
  alertMessage.style.display = 'none';

  const searchText = e.target.searchText.value;
  const checkPrice = e.target.checkPrice.checked;
  const selectCategory = e.target.selectCategory.value;

  if (searchText) {
    const res = await fetch(`https://dummyjson.com/products/search?q=${searchText}`);
    const data = await res.json();

    if (data.products.length === 0) {
      alertMessage.style.display = 'block';
      alertMessage.textContent = 'No matching results';
      return;
    }

    if (checkPrice) {
      data.products.sort((a, b) => a.price - b.price);
    }

    if (selectCategory !== '') {
      const categoryData = await getCategory(selectCategory);
      categoryData.sort((a, b) => a.price - b.price);
      productCard(categoryData, searchContent);
    } else {
      productCard(data.products, searchContent);
    }
  } else {
    alertMessage.style.display = 'block';
    alertMessage.textContent = 'Please enter a search query';
  }
});

window.onload = (event) => {
  makeRequest();
};
