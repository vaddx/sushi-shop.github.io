// прослушка на все карточки


window.addEventListener("click", function (event) {

    if (event.target.dataset.action === "minus" || event.target.dataset.action === "plus") {
        const counterWrapper = event.target.closest(".counter-wrapper"); // находим див на который тыкнули
        var counter = counterWrapper.querySelector("[data-counter]");
    }

    // проверка на какую кнопку мы кликнули
    if (event.target.dataset.action === "plus") {
        counter.innerText = ++counter.innerText; // увеличиваем число сетов/число в counter
    }

    if (event.target.dataset.action === "minus") {
        if (parseInt(counter.innerText) > 1) {
            counter.innerText = --counter.innerText; // уменьшаем число сетов/число в counter
        }
        // удаление товаров из корзины
        else if (event.target.closest(".cart-wrapper") && parseInt(counter.innerText) === 1) { // проверка на товар если он находится в корзине в корзине
            event.target.closest(".cart-item").remove()
            toggleCartStatus();
            generalPriceAndDelivery()
        }
    }

    if (event.target.hasAttribute('[data-action]') || event.target.closest('.cart-item')) {
        generalPriceAndDelivery()

    }
});

//                          ДОБАВЛЕНИЕ В ТОВАРА В КОРЗИНУ 
window.addEventListener("click", function (event) {
    if (event.target.hasAttribute("data-cart")) {

        const card = event.target.closest(".card"); // проверка чтобы клик был совершен по кнопкм "добавить в корзину"

        const productInfo = {
            id: card.dataset.id,
            proImg: card.querySelector(".product-img").getAttribute("src"),
            title: card.querySelector(".item-title").innerText,
            muted: card.querySelector(".text-muted").innerText,
            weight: card.querySelector(".price__weight").innerText,
            price: card.querySelector(".price__currency").innerText,
            counter: card.querySelector("[data-counter]").innerText,
        };

        // проверка есть ли такой товар в корзине
        const cartWrapper = document.querySelector(".cart-wrapper");

        const doubleCartItem = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`);
        if (doubleCartItem) { // если товар есть в корзине


            const counterEl = doubleCartItem.querySelector("[data-counter]"); // для прибавления числа

            counterEl.innerText =
                parseInt(counterEl.innerText) + parseInt(productInfo.counter);  // сумируем число сетов
        } else {
            // если товара нет в корзине мы создаем


            // ИНФОРМАЦИЯ О КАРТЕ ДЛЯ КОРЗИНЫ
            const cartInfoHtml =
                `<div class="cart-item" data-id="${productInfo.id}"> 
        <div class="cart-item__top">
          <div class="cart-item__img">
            <img src="${productInfo.proImg}" alt="">
             </div>
           <div class="cart-item__desc">
            <div class="cart-item__title">${productInfo.title}</div>
            <div class="cart-item__weight">${productInfo.muted} / ${productInfo.weight}</div>

                <!-- cart-item__details -->
             <div class="cart-item__details">

            <div class="items items--small counter-wrapper">
                <div class="items__control" data-action="minus">-</div>
                <div class="items__current" data-counter="">${productInfo.counter}</div>
                <div class="items__control" data-action="plus">+</div>
            </div>

            <div class="price">
                <div class="price__currency">${productInfo.price}</div>
          </div>

      </div>`;

            // ДОБАВЛЕНИЕ КАРТОЧКИ С ИНФОЙ В КОРЗИНУ
            cartWrapper.insertAdjacentHTML("beforeend", cartInfoHtml);
        }
        generalPriceAndDelivery()

        card.querySelector('[data-counter]').innerText = '1' // сбросили счетчик после отправки в корзину

        toggleCartStatus();  // Отображение надписиси "корзина пуста"
    }
});

const cards = document.querySelectorAll('.card')


for (const card of cards) {
    const drag = document.querySelector('.drag')
    const cart = document.querySelector('.cart')
    const cartWrapper = document.querySelector(".cart-wrapper");

    card.addEventListener('dragstart', () => {
        card.classList.add('now')
        cart.classList.add('cart-drag')
        drag.classList.remove('none')
    })

    card.addEventListener('dragend', () => {
        card.classList.remove('now')
        cart.classList.remove('cart-drag')
        drag.classList.add('none')
    })

    card.addEventListener('dragover', (e) => {
        e.preventDefault()
    })

    cart.addEventListener('drop', () => {
        const now = document.querySelector('.now');
        const productInfo = {
            id: now.dataset.id,
            proImg: now.querySelector(".product-img").getAttribute("src"),
            title: now.querySelector(".item-title").innerText,
            muted: now.querySelector(".text-muted").innerText,
            weight: now.querySelector(".price__weight").innerText,
            price: now.querySelector(".price__currency").innerText,
            counter: now.querySelector("[data-counter]").innerText,
        };
        const doubleCartItem = cartWrapper.querySelector(`[data-id="${productInfo.id}`);
        if (doubleCartItem) {
            const counterEl = doubleCartItem.querySelector("[data-counter]");
            counterEl.innerText = parseInt(counterEl.innerText) + 1;
        } else {

            const cartInfoHtml =
                `<div class="cart-item" data-id="${productInfo.id}"> 
        <div class="cart-item__top">
          <div class="cart-item__img">
            <img src="${productInfo.proImg}" alt="">
             </div>
           <div class="cart-item__desc">
            <div class="cart-item__title">${productInfo.title}</div>
            <div class="cart-item__weight">${productInfo.muted} / ${productInfo.weight}</div>

                <!-- cart-item__details -->
             <div class="cart-item__details">

            <div class="items items--small counter-wrapper">
                <div class="items__control" data-action="minus">-</div>
                <div class="items__current" data-counter="">${productInfo.counter}</div>
                <div class="items__control" data-action="plus">+</div>
            </div>

            <div class="price">
                <div class="price__currency">${productInfo.price}</div>
          </div>

      </div>`;
            cartWrapper.insertAdjacentHTML("beforeend", cartInfoHtml);
            console.log(1);
        }

        toggleCartStatus();
        generalPriceAndDelivery();
    })
}




//    ДОБАВЛЕНИЕ ИНТЕРАКТИВНОСТИ В КОРЗИНУ    P.S: отображение нажписей, итоговая цена, офрмление заказа и т.д


function toggleCartStatus() { // Отображение надписиси "корзина пуста" и оформление заказа
    const cartWrapper = document.querySelector(".cart-wrapper"); // Прослушлка на див корзины

    const cartEmptyBadge = document.querySelector('[data-cart-empty]')

    const displayDelivery = document.querySelector('[data-cart-delivery]')  // селектор доставки

    const orderForm = document.querySelector('#order-form')

    const generalPrice = document.querySelector("#general-price"); // Прослушлка на див цены


    if (cartWrapper.children.length > 0) {
        cartEmptyBadge.classList.add('none') // убираем надпись корзина пуста

        displayDelivery.classList.remove('none')  // добавляем надпись "итоговая цена и доставка"

        orderForm.classList.remove('none') // добавляем надпись с оформлением заказа

        generalPrice.classList.remove('none') // добавление цены в корзину
    } else {
        cartEmptyBadge.classList.remove('none') // добавляем надпись корзина пуста

        displayDelivery.classList.add('none')

        orderForm.classList.add('none') // убираем надпись с оформлением заказа

        generalPrice.classList.add('none')  // скрываем цену в корзине
    }
}


function generalPriceAndDelivery() { // сумируем цену всех товаров  и и вычисляем статус доставки

    const cartItems = document.querySelectorAll(".cart-item"); // Прослушлка на див товара
    const generalPrice = document.querySelector(".total-price"); // Прослушлка на див цены
    const deliveryStatus = document.querySelector('.delivery-cost')  // селектор цены доставки

    const Drouble = document.querySelector('.Drouble')
    let totalPrice = 0

    cartItems.forEach(function (item) {
        const counter = item.querySelector('[data-counter]');
        const priceProduct = item.querySelector('.price__currency');
        const currentPrice = parseInt(counter.innerText) * parseInt(priceProduct.innerText);

        totalPrice = totalPrice + currentPrice
        generalPrice.innerText = totalPrice // отображаем цену на страницу
    })

    if (totalPrice <= 1000) {
        deliveryStatus.innerText = '300'
        deliveryStatus.classList.remove('free')
    } else if (totalPrice >= 2000) {
        deliveryStatus.innerText = 'Бесплатно'
        deliveryStatus.classList.add('free')
        Drouble.classList.add('none')
    } else if (totalPrice > 1000) {
        deliveryStatus.innerText = '200'
        deliveryStatus.classList.remove('free')
    }

}