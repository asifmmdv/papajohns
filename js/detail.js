const menu = document.getElementById('menu')
const data = []


fetch("https://papajson.vercel.app/category")
    .then(res => res.json())
    .then(info => {
        data.push(...info)
        handleHeader()
    })

function handleHeader(){
    menu.innerHTML = ""
    data.map(item => {
        menu.innerHTML += `<div class="cursor-pointer">${item.category}</div>`
    })
 }

const data2 = []

 fetch(`https://papajson.vercel.app/papadias`)
    .then(res => res.json())
    .then(info2 => {
        data2.push(...info2)
        handleProducts()
    })

    
    const papadias = document.getElementById('papadias')
    
    function handleProducts(){
        papadias.innerHTML = ''
        data2.map(item => {
            papadias.innerHTML += `<article class="h-[250px] flex flex-col w-[195px]">
            <img src="${item.img}" class="w-[195px] rounded-[7px] h-[116px]">
            <h1 class="text-[14px] mt-[4px] font-[900]">${item.title}</h1>
            <p class="text-[12px] mt-[4px]">${item.composition}</p>
            <button class="text-[12px] flex justify-center bg-[#c7c0c0] w-[60px] rounded-[7px] text-left mt-auto "><span>${item.price} AZN</span></button>
            </article>`
        })
    }
    const data3 = []
    
     fetch(`https://papajson.vercel.app/pizza`)
        .then(res => res.json())
        .then(info3 => {
            data3.push(...info3)
            handleProducts2()
        })
    
    const pizza = document.getElementById('pizza')

    function handleProducts2(){
        pizza.innerHTML=''
        data3.map(item => {
            pizza.innerHTML += `<article class="h-[250px] flex flex-col w-[195px]">
            <img src="${item.img}" class="w-[195px] rounded-[7px] h-[116px]">
            <h1 class="text-[14px] mt-[4px] font-[900]">${item.title}</h1>
            <p class="text-[12px] mt-[4px]">${item.composition}</p>
            <button class="text-[12px] flex justify-center bg-[#c7c0c0] w-[60px] rounded-[7px] text-left mt-auto "><span>${item.price} AZN</span></button>
            </article>`
        })
    }