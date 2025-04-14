function openModal(item = null) {
    if (!modal) return;
    
    const modalContent = document.getElementById('modal-content');
    if (item) {
        currentItem = item;
        quantity = 1;
        modalContent.innerHTML = `
            <div class="flex flex-col w-full">
                <div onclick='modal.classList.toggle("hidden")' class="ml-auto mr-[12px] mt-[8px]">
                    <i class="fa-solid fa-xmark text-[28px]"></i>
                </div>
                <div class="flex flex-col justify-center items-center w-full  py-[20px]">
                    <div class="flex flex-col w-full justify-center items-center ">
                        <img src="${item.img}" class="w-[317px] h-[211px] rounded-[20px]">
                        <h2 class="text-[24px] mt-[20px] text-left font-bold">${item.title}</h2>
                        <p class="text-[14px] text-center mt-[8px]">${item.composition}</p>
                    </div>
                    <div class="flex items-center p-[24px]  gap-4 text-nowrap justify-between mt-[200px]">
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

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateBasketDisplay() {
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
    
    refreshAllProductDisplays();
    saveCartToLocalStorage();
}

function showBasketDetails() {
    if (!totalBasket) return;
    
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
                    <div class="flex flex-col  border p-2 rounded">
                        <div class="flex items-center gap-3">
                            <div>
                                <h3 class="font-semibold">${item.title}</h3>
                                <p class="text-sm">${item.price} AZN</p>
                            </div>
                        </div>
                        <div class="flex items-center ml-auto  gap-2">
                            <button onclick="updateCartQuantity('${item.id}', -1)" class="flex items-center justify-center w-8 h-8 rounded-full p-2 text-[#2D5D2A] border-[grey] text-[12px] border-[1px]"> <i class="fa-solid fa-minus"></i></button>
                            <span class="font-[900]">${item.quantity}</span>
                            <button onclick="updateCartQuantity('${item.id}', 1)" class="flex items-center justify-center w-8 h-8 rounded-full p-2 text-[#2D5D2A] border-[grey] text-[12px] border-[1px]""><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <div class="font-bold">${item.totalPrice} AZN</div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-auto pt-4 border-t flex justify-between items-center">
                <span class="text-xl font-bold">Yekun:</span>
                <span class="text-xl font-bold">${cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)} AZN</span>
            </div>
            <div class="w-[400px] m-auto">
                <img src="../images/giphy.gif" alt="gif">
            </div>
        </div>
    `;
}

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
}

function closeBasket() {
    if (totalBasket) {
        totalBasket.classList.add("hidden");
    }
}

init();