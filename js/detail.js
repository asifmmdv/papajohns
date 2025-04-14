const menu = document.getElementById('menu');
const categoryData = [];
const modal = document.getElementById('modal');

const endpoints = [
    { url: "http://localhost:3000/category", container: null, handler: handleHeader },
    { url: "https://papajson.vercel.app/papadias", container: "papadias" },
    { url: "http://localhost:3000/pizza", container: "pizza" },
    { url: "http://localhost:3000/qalyanaltilar", container: "qalyanaltilar" },
    { url: "http://localhost:3000/salat", container: "salat" },
    { url: "http://localhost:3000/pasta", container: "pasta" },
    { url: "http://localhost:3000/souses", container: "souses" },
    { url: "http://localhost:3000/icki", container: "icki" },
    { url: "http://localhost:3000/desertlar", container: "desertlar" }
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

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const sectionPosition = section.offsetTop - headerHeight - 10;
        window.scrollTo({ top: sectionPosition, behavior: 'smooth' });
    }
}

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

function openModal(item = null) {
    const modalContent = document.getElementById('modal-content');
    document.body.classList.style.overflow = 'hidden'
    if (item) {
        currentItem = item;
        quantity = 1;
        modalContent.innerHTML = `
            <div class="flex flex-col bg-[rgb(246,246,246)] h-full">
                <div onclick='modal.classList.toggle("hidden")' class="ml-auto mr-[12px] mt-[8px]">
                    <i class="fa-solid fa-xmark text-[28px]"></i>
                </div>
                <div class="flex flex-col justify-center h-full py-[20px]">
                    <div class="flex flex-col ">
                        <img src="${item.img}" class="w-[317px] h-[211px] rounded-[20px]">
                        <h2 class="text-[24px] mt-[20px] text-left font-bold">${item.title}</h2>
                        <p class="text-[14px] mt-[8px]">${item.composition}</p>
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

function changeQuantity(amount) {
    quantity = Math.max(1, quantity + amount);
    document.getElementById('quantity').textContent = quantity;
    
    if (currentItem) {
        const totalPrice = (currentItem.price * quantity).toFixed(2);
        document.getElementById('total-price').textContent = `${totalPrice} AZN`;
    }
}

function addToCart() {
    if (currentItem) {
        const cartItem = {
            ...currentItem,
            quantity: quantity,
            totalPrice: (currentItem.price * quantity).toFixed(2)
        };
        
        // In a real app, you would add to cart storage here
        console.log('Added to cart:', cartItem);
        alert(`Added ${quantity} x ${currentItem.title} to cart! Total: ${cartItem.totalPrice} AZN`);
        
        openModal();
    }
}

// Initialize the app
(async function init() {
    await Promise.all(endpoints.map(endpoint =>
        fetchData(endpoint.url, endpoint.container, endpoint.handler || handleProducts)
    ));
})();