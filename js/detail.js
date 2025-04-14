const menu = document.getElementById('menu');
const categoryData = [];
const modal = document.getElementById('modal');

const endpoints = [
    { url: "https://papajson.vercel.app/category", container: null, handler: handleHeader },
    { url: "https://papajson.vercel.app/papadias", container: "papadias" },
    { url: "https://papajson.vercel.app/pizza", container: "pizza" },
    { url: "https://papajson.vercel.app/qalyanaltilar", container: "qalyanaltilar" },
    { url: "https://papajson.vercel.app/salat", container: "salat" },
    { url: "https://papajson.vercel.app/pasta", container: "pasta" },
    { url: "https://papajson.vercel.app/souses", container: "souses" },
    { url: "https://papajson.vercel.app/icki", container: "icki" },
    { url: "https://papajson.vercel.app/desertlar", container: "desertlar" }
];

const containerToSectionMap = {
    "papadias": "sec1",
    "pizza": "sec2",
    "qalyanaltilar": "sec3",
    "salat": "sec4",
    "pasta": "sec5",
    "souses": "sec6",
    "icki": "sec7",
    "desertlar": "sec8"
};

let currentItem = null;
let quantity = 1;

// Load cart from localStorage if it exists
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateBasketDisplay();
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

let cart = [];

// Fetch data for categories and items
async function fetchData(url, containerId, handler) {
    try {
        const res = await fetch(url);
        const info = await res.json();
        if (containerId === null) {
            categoryData.push(...info);
            if (handler) handler();
        } else {
            handler(containerId, info);
        }
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
    }
}

// Handle displaying products
function handleProducts(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(item => `
        <article onclick="openModal(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="h-[250px] shadow-lg flex justify-between flex-col gap-0 w-[175px] cursor-pointer">
            <img src="${item.img}" class="w-[175px] rounded-[7px] h-[116px]">
            <h1 class="text-[14px] px-[5px] font-[900]">${item.title}</h1>
            <p class="text-[12px] px-[5px] mb-[8px]">${item.composition}</p>
            <button class="text-[12px] ml-[4px] font-bold mb-[4px] flex justify-center bg-[#c7c0c0] w-[60px] rounded-[7px] text-left">
                <span>${item.price} AZN</span>
            </button>
        </article>
    `).join('');
}

// Handle categories in the header
function handleHeader() {
    menu.innerHTML = categoryData.map(item => {
        const containerId = item.category.toLowerCase();
        const sectionId = containerToSectionMap[containerId];
        return `<div class="cursor-pointer px-2 py-1 rounded transition-all" 
                    id="menu-${containerId}" 
                    onclick="scrollToSection('${sectionId}')">
                    ${item.category}
                </div>`;
    }).join('');

    observeSections(); 
}

// Scroll to the respective section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const sectionPosition = section.offsetTop - headerHeight - 10;
        window.scrollTo({ top: sectionPosition, behavior: 'smooth' });
    }
}

// Observe sections for active state
function observeSections() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            const containerId = Object.keys(containerToSectionMap).find(key => containerToSectionMap[key] === sectionId);
            const menuItem = document.getElementById(`menu-${containerId}`);

            if (entry.isIntersecting) {
                document.querySelectorAll('#menu div').forEach(div => {
                    div.style.backgroundColor = '';
                    div.style.color = '';
                    div.style.borderRadius = '';
                });

                if (menuItem) {
                    menuItem.style.backgroundColor = 'black';
                    menuItem.style.color = 'white';
                    menuItem.style.borderRadius = '8px';
                }
            }
        });
    });

    Object.values(containerToSectionMap).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            observer.observe(section);
        }
    });
}

// Open modal to view item details
function openModal(item = null) {
    const modalContent = document.getElementById('modal-content');
    if (item) {
        currentItem = item;
        quantity = 1;
        modalContent.innerHTML = `
            <div class="flex flex-col w-full bg-[rgb(246,246,246)]">
                <div onclick='modal.classList.toggle("hidden")' class="ml-auto mr-[12px] mt-[8px]">
                    <i class="fa-solid fa-xmark text-[28px]"></i>
                </div>
                <div class="flex flex-col justify-center items-center w-full  py-[20px]">
                    <div class="flex flex-col w-full justify-center items-center ">
                        <img src="${item.img}" class="w-[317px] h-[211px] rounded-[20px]">
                        <h2 class="text-[24px] mt-[20px] text-left font-bold">${item.title}</h2>
                        <p class="text-[14px] text-center mt-[8px]">${item.composition}</p>
                    </div>
                    <div class="flex items-center p-[24px] gap-4 text-nowrap justify-between mt-[280px]">
                        <div class="flex items-center gap-7 h-[60px]">
                            <p class="text-[18px] w-[80px] font-[900] text-[#2D5D2A]" id="total-price">${item.price} AZN</p>
                            <div class="flex items-center gap-2">
                                <button class="flex items-center justify-center w-8 h-8 rounded-full p-2 text-[#2D5D2A] border-[grey] text-[12px] border-[1px]" onclick="changeQuantity(-1)">
                                    <i class="fa-solid fa-minus"></i>
                                </button>
                                <span class="text-[18px] font-[900] text-[#2D5D2A]" id="quantity">1</span>
                                <button class="flex items-center justify-center w-8 h-8 rounded-full p-2 text-[#2D5D2A] border-[grey] text-[12px] border-[1px]" onclick="changeQuantity(1)">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <button class="px-6 py-2 bg-[#CFEB0B] text-[black] border-[1px] border-black rounded-[30px]" onclick="addToCart()">
                            ƏLAVƏ ET
                        </button>
                    </div>       
                </div>
            </div>
        `;
    }
    
    modal.classList.toggle("hidden");
}

// Change quantity in modal
function changeQuantity(amount) {
    quantity = Math.max(1, quantity + amount);
    document.getElementById('quantity').textContent = quantity;
    
    if (currentItem) {
        const totalPrice = (currentItem.price * quantity).toFixed(2);
        document.getElementById('total-price').textContent = `${totalPrice} AZN`;
    }
}

// Add item to cart
function addToCart() {
    if (currentItem) {
        const existingItem = cart.find(item => item.id === currentItem.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.totalPrice = (existingItem.price * existingItem.quantity).toFixed(2);
        } else {
            const cartItem = {
                ...currentItem,
                quantity: quantity,
                totalPrice: (currentItem.price * quantity).toFixed(2)
            };
            cart.push(cartItem);
        }
        
        updateBasketDisplay();
        openModal();
    }
}

// Update Basket Display and save to localStorage
function updateBasketDisplay() {
    const basket = document.getElementById('basket');
    if (!basket) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

    if (totalItems > 0) {
        basket.innerHTML = `
            <div class="flex justify-between items-center w-full px-4 text-white">
                <div class="flex items-center gap-2">
                    <span class="font-bold"><i class="fa-solid fa-basket-shopping"></i> ${totalItems}</span>
                </div>
                <div class="flex items-center gap-4">
                    <span class="font-bold">${totalPrice} AZN</span>
                </div>
            </div>
        `;
        basket.classList.remove('hidden');
    } else {
        basket.classList.add('hidden');
    }
    
    saveCartToLocalStorage(); // Save cart to localStorage
}

// Show basket details
function showBasketDetails() {
    const totalBasket = document.getElementById("totalBasket");
    totalBasket.classList.remove("hidden");

    if (cart.length === 0) {
        totalBasket.innerHTML = `
            <div class="p-4 flex flex-col justify-center items-center">
                <p class="text-xl font-semibold">Səbətiniz Boşdur</p>
                <button onclick="closeBasket()" class="mt-4 bg-gray-500 text-white py-2 px-6 rounded-full">Bağla</button>
            </div>
        `;
        return; 
    }

    totalBasket.innerHTML = `
        <div class="p-4 flex flex-col gap-4">
            <div class="flex justify-between items-center border-b pb-2">
                <h2 class="text-2xl font-bold">Səbət</h2>
                <button onclick="closeBasket()" class="text-lg font-bold text-red-500">
                    <i class="fa-solid fa-xmark text-[28px]"></i>
                </button>
            </div>
            <div id="basket-items" class="flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
                ${cart.map(item => `
                    <div class="flex items-center justify-between border p-2 rounded">
                        <div class="flex items-center gap-3">
                            <img src="${item.img}" class="w-16 h-16 object-cover rounded" />
                            <div>
                                <h3 class="font-semibold">${item.title}</h3>
                                <p class="text-sm">${item.price} AZN</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="updateCartQuantity('${item.id}', -1)" class="w-6 h-6 border rounded-full flex items-center justify-center">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateCartQuantity('${item.id}', 1)" class="w-6 h-6 border rounded-full flex items-center justify-center">+</button>
                        </div>
                        <div class="font-bold">${item.totalPrice} AZN</div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-auto pt-4 border-t flex justify-between items-center">
                <span class="text-xl font-bold">Cəmi:</span>
                <span class="text-xl font-bold">${cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)} AZN</span>
            </div>
        </div>
    `;
}

// Update item quantity in cart
function updateCartQuantity(itemId, amount) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    item.quantity = Math.max(0, item.quantity + amount);

    if (item.quantity === 0) {
        cart = cart.filter(i => i.id !== itemId);
    } else {
        item.totalPrice = (item.price * item.quantity).toFixed(2);
    }

    updateBasketDisplay();
    showBasketDetails(); 

    if (cart.length === 0) {
        closeBasket();
    }

    saveCartToLocalStorage(); // Save cart to localStorage
}

// Close basket modal
function closeBasket() {
    const totalBasket = document.getElementById("totalBasket");
    totalBasket.classList.add("hidden");
}

// Initialize the page and load data
(async function init() {
    await Promise.all(endpoints.map(endpoint =>
        fetchData(endpoint.url, endpoint.container, endpoint.handler || handleProducts)
    ));
    loadCartFromLocalStorage();  // Load cart from local storage on page load
})();
