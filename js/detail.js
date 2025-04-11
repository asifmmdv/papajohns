
const menu = document.getElementById('menu');
const categoryData = [];

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
        <article class="h-[250px] shadow-lg flex justify-between flex-col gap-0 w-[175px]">
            <img src="${item.img}" class="w-[175px] rounded-[7px] h-[116px]">
            <h1 class="text-[14px] px-[5px] font-[900]">${item.title}</h1>
            <p class="text-[12px] px-[5px] mb-[8px] ">${item.composition}</p>
            <button class="text-[12px] ml-[4px] font-bold mb-[4px] flex justify-center bg-[#c7c0c0] w-[60px] rounded-[7px] text-left ">
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
        section.scrollIntoView({ behavior: 'smooth' });
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

(async function init() {
    await Promise.all(endpoints.map(endpoint =>
        fetchData(endpoint.url, endpoint.container, endpoint.handler || handleProducts)
    ));
})();
