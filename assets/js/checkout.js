var config = {};
var orderCartData = {};
var discountPrice = 0;

function loadCheckoutPageContent(page, data) {
    config = data;
    if (page === "checkoutpage") {
        insertDistributorAddress();
        insertOrderSummary();
        insertDeliveryDetails();

        $('.more__cta').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            expandMore(this);
        });

        $('.buyout__btn1').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            sendDataToBot();
        });

        $('input').on('input', function() {
            if(this.type === "search") return;
            this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/^0[^.]/, '0');
            return;
        });
    
    }
}

function insertOrderCart(orderCart, skuid) {
    if (Object.keys($(`#${skuid}`)).length !== 0) {
        let product = orderCart[skuid]["product_data"]
        let type = orderCart[skuid]["product_data"]["listing_type"];
        if (type) {
            type = `- ${type}`
        } else {
            type = '';
        }
        if(orderCart[skuid]["quantity"] !== 0) {
            $(`#${skuid}`).replaceWith(`
                <div class="order__section" id=${product.sku}>
                    <div class="details__section">
                        <div class="name">${product.name} ${type}</div>
                        <div class="discount__offer">
                            <span class="price">Rs. ${numberWithCommas(product.price)}</span>
                        </div>
                        <div class="discount__detail">${product.discount_detail}</div>
                        <div class="discount__detail__bar">
                            <div class="description">${product.discount_description}</div>
                        </div>
                    </div>
                    <div class="product__counter">
                        <div class="icon__wrapper">
                            <img src=${product.icon} />
                        </div>

                        <div class="counter__wrapper checkout">
                            <div class="counter__container checkout">
                                <div class="counter__box__container">
                                    <div class="counter__minus" id="minus" product="${encodeURIComponent(JSON.stringify(product))}" onclick="updateCounterDataFromCheckout('minus')">
                                        <img src="/coke/assets/images/png/minus.png" />
                                    </div>
                                </div>
                            
                                <input id="counter_input_${product.sku}" class="counter__input checkout" type="text" value='${orderCart[skuid]["quantity"]}' size="2" maxlength="2" autocomplete="off" previous-value=${orderCart[skuid]["quantity"]} />
                                <div class="counter__box__container">
                                    <div class="counter__plus" id="plus" product="${encodeURIComponent(JSON.stringify(product))}" onclick="updateCounterDataFromCheckout('add')">
                                        <img src="/coke/assets/images/png/plus.png" />
                                    </div>
                                </div>
                                <div class="addmore__qty checkout">
                                    <div class="submit checkout" product="${encodeURIComponent(JSON.stringify(product))}">
                                        <img src="/coke/assets/images/svg/icons8-ok.svg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
        } else {
            $(`#${product.sku}`).remove();
        }
    } else {
        let product = orderCart[skuid]["product_data"]
        let type = orderCart[skuid]["product_data"]["listing_type"];
        if (type) {
            type = `- ${type}`
        } else {
            type = '';
        }
        $("#order_checkout_cart").append(`
            <div class="order__section" id=${product.sku}>
                <div class="details__section">
                    <div class="name">${product.name} ${type}</div>
                    <div class="discount__offer">
                        <span class="price">Rs. ${numberWithCommas(product.price)}</span>
                    </div>
                    <div class="discount__detail">${product.discount_detail}</div>
                    <div class="discount__detail__bar">
                        <div class="description">${product.discount_description}</div>
                    </div>
                </div>
                <div class="product__counter">
                    <div class="icon__wrapper">
                        <img src=${product.icon} />
                    </div>

                    <div class="counter__wrapper checkout" id="checkout-counter-${product.sku}">
                        <div class="counter__container checkout">
                            <div class="counter__box__container">
                                <div class="counter__minus" id="minus" product="${encodeURIComponent(JSON.stringify(product))}" onclick="updateCounterDataFromCheckout('minus')">
                                    <img src="/coke/assets/images/png/minus.png" />
                                </div>
                            </div>
                        
                            <input id="counter_input_${product.sku}" class="counter__input checkout" type="text" value="1" size="2" maxlength="2" autocomplete="off" previous-value=${orderCart[skuid]["quantity"]} />
                            <div class="counter__box__container">
                                <div class="counter__plus" id="plus" product="${encodeURIComponent(JSON.stringify(product))}" onclick="updateCounterDataFromCheckout('add')">
                                    <img src="/coke/assets/images/png/plus.png" />
                                </div>
                            </div>
                            <div class="addmore__qty checkout">
                                <div class="submit checkout" product="${encodeURIComponent(JSON.stringify(product))}">
                                    <img src="/coke/assets/images/svg/icons8-ok.svg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }

    $('.counter__input.checkout').blur(function () {
        setTimeout(() => {
            if(this.type === "search") return;
            $($(this).siblings()[0]).fadeIn("slow").show();
            $($(this).siblings()[1]).fadeIn("slow").show();
            $(this).siblings(".addmore__qty").css("opacity", "0");
            $(this).siblings(".addmore__qty").css("display", "none");
        }, 500);
    });
    
    $('.counter__input.checkout').focus(function () {
        if(this.type === "search") return;
        $($(this).siblings()[0]).fadeIn("slow").hide();
        $($(this).siblings()[1]).fadeIn("slow").hide();
        $(this).siblings(".addmore__qty").css("opacity", "1");
        $(this).siblings(".addmore__qty").css("display", "block");
    });

    $('input').on('input', function() {
        if(this.type === "search") return;
        this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/^0[^.]/, '0');
        return;
    });

    $('.submit.checkout').click(function () {
        let counterInput = $(this).parent().siblings(".counter__input");
        let currentValue = $(counterInput).val();
        let previousValue = $(counterInput).attr("previous-value");
        $(counterInput).val(parseInt(previousValue));
        $(counterInput).change();
        $($(this).parent().siblings()[0]).fadeIn("slow").show();
        $($(this).parent().siblings()[2]).fadeIn("slow").show();
        $(this).parent(".addmore__qty").css("opacity", "0");
        $(this).parent(".addmore__qty").css("display", "none");

        if (currentValue != 0) {
            let productData = $(this).attr("product");
            let decodedProductData = JSON.parse(decodeURIComponent(productData));
            delete cartData[decodedProductData.sku];
            counterInput.val(0);
            counterInput.change();
            counterInput.attr("previous-value", 0);
            let numberCircleCount = $("#numberCircle").attr("value");
            let parseCount = Number(numberCircleCount)
            let updatedValue = parseCount - previousValue;
            $("#numberCircle").attr("value", updatedValue);
            $("#numberCircle").text(updatedValue);
            for (let i = 0; i < currentValue; i++) {
                updateCounterDataFromCheckout("add", "bulk")
            }
            passDataToBot(cartData, "bulk");
        }
    });
}

function insertSelectedCoupon(discountData, type, data) {
    if (!discountData && !type && !data) return;
    if (Object.keys(cartData).length === 0) {
        emptyContainerData();
        return;
    }

    var elementNode = "";
    if (type === "update") {
        elementNode = ".coupon__banner__container";
    } else {
        elementNode = "#coupon_container";
    }
    $(elementNode).empty();
    discountPrice = 0;
    $('#title_loader').empty();
    discountData.map((discount, index) => {
        discountPrice += discount.discountedPrice;
        let qty = discount.quantity > 0 ? `<span>${discount.quantity}</span>` : "";
        $(elementNode).append(`
            <div class="coupon__banner__container">
                <div class="banner__wrapper">
                    <div class="svg__box">
                        <svg width="84" height="146" viewBox="0 0 84 146" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M83.0244 3.05176e-05H0V2.93142C2.30098 2.93142 4.16068 4.79111 4.16068 7.09209C4.16068 9.39307 2.30098 11.2528 0 11.2528V13.9005C2.30098 13.9005 4.16068 15.7602 4.16068 18.0612C4.16068 20.3621 2.30098 22.2218 0 22.2218V24.8695C2.30098 24.8695 4.16068 26.7292 4.16068 29.0302C4.16068 31.3312 2.30098 33.1909 0 33.1909V35.8386C2.30098 35.8386 4.16068 37.6983 4.16068 39.9993C4.16068 42.3002 2.30098 44.1599 0 44.1599V46.8076C2.30098 46.8076 4.16068 48.6673 4.16068 50.9683C4.16068 53.2693 2.30098 55.129 0 55.129V58.4701C7.56487 58.6278 13.6483 64.8057 13.6483 72.4021C13.6483 79.9985 7.56487 86.271 0 86.4286V89.9904C2.30098 89.9904 4.16068 91.8501 4.16068 94.1511C4.16068 96.4521 2.30098 98.3118 0 98.3118V100.959C2.30098 100.959 4.16068 102.819 4.16068 105.12C4.16068 107.421 2.30098 109.281 0 109.281V111.929C2.30098 111.929 4.16068 113.788 4.16068 116.089C4.16068 118.39 2.30098 120.25 0 120.25V122.898C2.30098 122.898 4.16068 124.757 4.16068 127.058C4.16068 129.359 2.30098 131.219 0 131.219V133.867C2.30098 133.867 4.16068 135.726 4.16068 138.027C4.16068 140.328 2.30098 142.188 0 142.188V145.844H83.0244V3.05176e-05Z" fill="#F4000B"/>
                        </svg>
                        <div class="coupon__name__box">
                            <div class="name">
                                PROMO
                            </div>
                            <div class="stripes"></div>
                        </div>
                    </div>
                    <div class="detail__box">
                        <div class="box__wrapper">
                            <div class="discount__info">
                                <div class="title">Applied Promo</div>
                                <div class="discount_name">${discount.offer_name}</div>
                            </div>
                            <div class="discount__detail">${discount.display_message}</div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    });

    if (+discountPrice > 0) {
        showDiscountLable();
    } else {
        hideDiscountLable();
    }
    recalculateOrderSummary(data);
}

/* function insertDiscountSection(discountAvailable) {
        $("#offers_height_box").empty();
        discountAvailable.map((discount, index) => {
        $("#offers_height_box").prepend(`
            <div class="offer__info__wrapper">
                <div class="offer__info__container">
                    <div class="offer__info__section">
                        <div class="offer__bar__box">
                            <div class="offer__name__box">
                                <div class="icon">
                                    <img src="/coke/assets/images/svg/discount_coke_ico.svg" />
                                </div>
                                <div class="name">${discount.name}</div>
                            </div>
                            <div class="offer__apply" discount-data=${encodeURIComponent(JSON.stringify(discount))}>APPLY</div>
                        </div>
                        <div class="offer__info">${discount.info}</div>
                    </div>
                    <div class="offer__info__section">
                        <div class="offer__info__description">${discount.description}</div>
                        <div class="more__descriptionbox">
                            <div class="more__cta">+ MORE</div>
                            <div class="description__details" id="description_details">
                                <div id="tnc" class="tnc__box">
                                    <div class="title">${discount.details.title}</div>
                                    <div class="list__points">Valid on Monday & Tuesday</div>
                                    <div class="list__points">Applicable only once per user per week</div>
                                    <div class="list__points">Valid only on ICICI debit & credit card</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        `)
    });
    // $("#offers_height_box").append(`<div class="view__less" onclick="hideDiscount()">View less</div>`);
    // $('.offer__apply').click(function () {
    //     addDiscount(this);
    // });
    // recalculateCart();
} */

function insertDistributorAddress() {
    $("#distributor_details_container").append(`
        <div class="title">Distributor Details</div>
        <div class="summary__wrapper">
            <div class="detail" style="margin:0;">${config.checkout.distributor_details.id}</div>
            <div class="detail" style="margin:0;">${config.checkout.distributor_details.name}</div>
        </div>
    `)
}

function insertOrderSummary() {
    $("#order_summary").append(`
        <div class="summary__wrapper">
            <div class="price__cart__box">
                <div class="price__item">
                    <div class="key bold">Item total</div>
                    <div class="item" orderValue="0" id="item_total">0</div>
                </div>
                <div class="price__item" id="discount_perc">
                    <div class="key red">Discount</div>
                    <div class="item red" orderValue="0" id="discout_perc">0</div>
                </div>
            </div>
            <div class="price__item total">
                <div class="key bold total">Grand Total</div>
                <div class="item red total" orderValue="0" id="grand_total">0</div>
            </div>
        </div>
    `)

    hideDiscountLable();
}

function hideDiscountLable() {
    $("#discount_perc").hide();
}

function showDiscountLable() {
    $("#discount_perc").show();
}

// function insertDeliveryDetails() {
//     $("#delivery_details_container").append(`
//         <div class="title">Delivery details</div>
//         <div class="details__wrapper">
//             <div class="address">${config.checkout.delivery_details.address}</div>
//             <div class="mobile">${config.checkout.delivery_details.phone}</div>
//             <div class="email">${config.checkout.delivery_details.email}</div>
//         </div>
//     `)
// }

        // Jay code

// function insertDeliveryDetails() {
//     $("#delivery_details_container").append(`
//         <div class="title">Delivery details</div>
//         <div class="details__wrapper">
//             <div class="grayColour">${config.checkout.delivery_details.id}</div>
//             <div class="grayColour">${config.checkout.delivery_details.name}</div>
//             <div class="grayColour">${config.checkout.delivery_details.address}</div>
//             <div class="grayColour">${config.checkout.delivery_details.phone}</div>
//         </div>
//     `)
// }

function insertDeliveryDetails() {
    // <div class="address">${config.checkout.delivery_details.address}</div>
    //         <div class="mobile">${config.checkout.delivery_details.phone}</div>
    //         <div class="email">${config.checkout.delivery_details.email}</div>
    $("#delivery_details_container").append(`
        <div class="title">Delivery details</div>
        <div class="details__wrapper">
            <div class="grayColour">${config.checkout.delivery_details.name}</div>
            <div class="grayColour">${config.checkout.delivery_details.address}</div>
            <div class="grayColour">${config.checkout.delivery_details.phone}</div>
        </div>
    `)
}

$(document).ready(function () {
    $('#minus').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $input = $('#counter_input');
        var count = parseInt($input.val()) - 1;
        count = count < 1 ? 1 : count;
        $input.val(count);
        $input.change();
        return false;
    });
    $('#plus').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $input = $('#counter_input');
        $input.val(parseInt($input.val()) + 1);
        $input.change();
        return false;
    });
});

function expandMore(node) {
    node.classList.toggle("hide");
    let siblingWrapper = $(node).siblings(".description__details");
    siblingWrapper.show();
    let childWrapper = $(siblingWrapper).children('.tnc__box');
    let boxHeight = childWrapper[0].offsetHeight;
    siblingWrapper.css('height', boxHeight)
    let section_height = document.getElementById("offers_height_box").offsetHeight;
    let combinedHeight = boxHeight + section_height;
    $("#offers_parent_container").css('height', combinedHeight);
}

function viewDiscount() {
    $("#view_more").addClass("hide");
    $("#offers_parent_container").show();
    let boxHeight = document.getElementById("offers_height_box").offsetHeight;
    $("#offers_parent_container").css('height', boxHeight);
}

function hideDiscount() {
    $("#offers_parent_container").css('height', 0);
    $("#view_more").removeClass("hide");
}

/* function addDiscount(node) {
    let discountData = $(node).attr("discount-data");
    let decodedDiscountData = JSON.parse(decodeURIComponent(discountData));
    insertSelectedCoupon(decodedDiscountData, "update");
    hideDiscount();
    let filteredDiscounts = config.checkout.discounts.filter(val => {
        return val.name !== decodedDiscountData.name;
    })
    insertDiscountSection(filteredDiscounts);
    $("#view_more").fadeIn().removeClass("hide");
    recalculateCart(decodedDiscountData);
} */

function processQ(data, skuid, bulkType) {
    if (Object.keys(data).length === 0) {
        emptyContainerData();
        return;
    }
    insertOrderCart(data, skuid);

    if(!bulkType) {
        passDataToBot(data, bulkType);
    }
    recalculateCart();
}

/* function syncContainers(skuid) {
    for (let key in cartData) {
        // $(`#promotions-add-searchbox-${key}`).hide();
        // $(`#promotions-counter-searchbox-${key}`).show();
        // $(`#counter_input_searchbox_${key}`).val(parseInt(cartData[key].quantity));
        // $(`#counter_input_searchbox_${key}`).change();
        // $(`#counter_input_searchbox_${key}`).attr("previous-value", parseInt(cartData[key].quantity) - 1 > 0 ? parseInt(cartData[key].quantity) - 1 : 0);

        // $(`#promotions-add-${key}`).hide();
        // $(`#promotions-counter-${key}`).show();
        // $(`#counter_input_${key}`).val(parseInt(cartData[key].quantity));
        // $(`#counter_input_${key}`).change();
        // $(`#counter_input_${key}`).attr("previous-value", parseInt(cartData[key].quantity) - 1 > 0 ? parseInt(cartData[key].quantity) - 1 : 0);

    }
    if (!cartData[skuid]) {
        // $(`#promotions-add-${skuid}`).show();
        // $(`#promotions-counter-${skuid}`).hide();
        // $(`#counter_input_${skuid}`).val(1);
        // $(`#counter_input_${skuid}`).change();
        // $(`#counter_input_${skuid}`).attr("previous-value", 1);
    }
} */

function emptyContainerData() {
    $("#order_checkout_cart").empty();

    $('#title_loader').html(``);
    $('#loader_coupon').html(``);
    $('#loader_summary_bar').html(``);
    
    $('#text__loading').text(``);
    $('#continue_cta').addClass("disabled");

    $('#item_total').text(0);
    $('#item_total').attr("orderValue", 0);

    $('#discout_perc').text(0);
    $('#discout_perc').attr("orderValue", 0);

    $('#grand_total').text(0);
    $('#grand_total').attr("orderValue", 0);

    $('#sticky_cart_price').text(`Rs. 0`);
    $('#sticky_cart_quantity').text(`0 Item`);
    $(".sticky__footer").hide();

    $("#coupon_container").empty();
    $("#notification_bar").empty();
    $('#numberCircle').hide();
}


function recalculateOrderSummary(data) {
    /* Calculate totals */
    // let tax = subtotal * 0.28;
    let discount = discountPrice;
    let total = data.subtotal - discount;

    if (data.products) {
        const values = Object.values(data.products);
        const itemsWithNoQuantity = values.filter(obj => obj.quantity == 0);
        if (values.length == itemsWithNoQuantity.length) {
            data.subtotal = 0;
            total = 0;
        }
    }
    $('.item').fadeOut(300, function () {
        $('#title_loader').empty();
        $('#loader_coupon').empty();
        $('#loader_summary_bar').empty();
        $('#text__loading').empty();
        $('#continue_cta').removeClass("disabled");

        $('#item_total').text(numberWithCommas(data.subtotal.toFixed(2)));
        $('#item_total').attr("orderValue", data.subtotal.toFixed(2));

        $('#discout_perc').text(discount.toFixed(2));
        $('#discout_perc').attr("orderValue", discount.toFixed(2));

        $('#grand_total').text(total.toFixed(2));
        $('#grand_total').attr("orderValue", total.toFixed(2));

        $('.item').fadeIn(300);
    });

    orderCartData["discount"] = discount;
    orderCartData["total"] = total;
}

function recalculateCart() {
    let subtotal = 0;
    /* Sum up row totals */
    for (const key in cartData) {
        // subtotal += parseFloat(cartData[key]["product_data"].price);
        if (cartData[key]["product_data"].unit) {
            subtotal = subtotal + parseFloat(cartData[key]["product_data"].price) * parseInt(cartData[key]["product_data"].unit * parseInt(cartData[key]["quantity"]));
        } else {
            subtotal = subtotal + parseFloat(cartData[key]["product_data"].price) * parseInt(cartData[key]["quantity"]);
            // subtotal = subtotal * (parseInt(cartData[key]["quantity"]) ? parseInt(cartData[key]["quantity"]) : 1);
        }
    }

    /* Update totals display */
    $('.item').fadeOut(0, function () {
        $('#title_loader').html(`<div>Personalizing Promotions...</div>`);
        $('#loader_coupon').html(`<div id="loading"></div>`);
        $('#loader_summary_bar').html(`<div id="loading"></div>`);
        $("#notification_bar").html(`<div class="checkout_notification">Promotions Applied!</div>`);
        $('#text__loading').text(`  (Recalculating...)`);
        $('#continue_cta').addClass("disabled");

        // $('#item_total').html(`<div id="loading"></div>`);
        $('#item_total').attr("orderValue", 0);

        $('#sticky_cart_price').text(`Rs. ${subtotal.toFixed(2)}`);
        $('#sticky_cart_quantity').text(`${$("#numberCircle").attr("value")} Item`);

        // $('#discout_perc').html(`<div id="loading"></div>`);
        $('#discout_perc').attr("orderValue", 0);

        // $('#grand_total').html(`<div id="loading"></div>`);
        $('#grand_total').attr("orderValue", 0);

        $('.item').fadeIn(0);
    });

    $('.sticky__footer').fadeIn().show();
    $("#numberCircle").fadeIn().css("display", "flex");

    if ($("#numberCircle").attr("value") == 0) {
        $(".sticky__footer").hide();
        $("#numberCircle").hide();
        setTimeout(() => {
            $("#notification_bar").empty();
        }, 400);
        return;
    }
    // $('.sticky__footer').fadeIn().show();
    // $("#numberCircle").fadeIn().css("display", "flex");
    orderCartData = {
        products: cartData,
        subtotal: subtotal,
    };

    return orderCartData;
}

function updateCounterDataFromCheckout(type, bulk) {
    let targetNode = $(event.target).parent();
    let selectedProduct = $(targetNode).attr("product")
    let decodedselectedProduct = JSON.parse(decodeURIComponent(selectedProduct));
    updateCounter(targetNode, type, "checkout", bulk);
    let value = $(targetNode).parent().siblings(".counter__input").val();
    $(`#counter_input_${decodedselectedProduct.sku}`).val(value);
    $(`#counter_input_${decodedselectedProduct.sku}`).change();
}


function sendDataToBot() {
    window.parent.postMessage(JSON.stringify({
        event_code: 'custom-childtoparent-client-event',
        data: orderCartData
    }), '*');
}

function passDataToBot(data, bulkType) {
    window.parent.postMessage(JSON.stringify({
        event_code: 'custom-checkout-event',
        data: data
    }), '*');

    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n data ->>>>>>", data, "\n\n\n\n\n\n\n\n\n\n\n", bulkType);

    /* const values = Object.values(data);
    const totalLength = values ? values.length : 0;
    const itemsWithNoQuantity = values.filter(obj => obj.quantity == 0);
    
    if (totalLength == itemsWithNoQuantity.length) {
        $('#item_total').text(0);
        $('#item_total').attr("orderValue", 0);
    } */
}
