var config = {};

function loadPageContent(page, data) {
    config = data;
    if (page === "homepage") {
        insertSearchBar();
        insertTabContainer();
        insertPromotionsContainer();
        // JAY
        // insertOrderHistoryProducts();
        insertFilterBar();

        let sortedProducts = groupProductsByCategory(config.products, "volume");
        insertProducts(sortedProducts, "volume_name");
        insertInnerProducts(sortedProducts);

        $('input').blur(function () {
            setTimeout(() => {
                if (this.type === "search") return;
                $(this).val($(this).attr("previous-value"));
                $($(this).siblings()[0]).fadeIn("slow").show();
                $($(this).siblings()[1]).fadeIn("slow").show();
                $(this).siblings(".addmore__qty").css("opacity", "0");
                $(this).siblings(".addmore__qty").css("display", "none");
                emptySearch();
            }, 500);
        });

        $('input').focus(function () {
            if (this.type === "search") return;
            $($(this).siblings()[0]).fadeIn("slow").hide();
            $($(this).siblings()[1]).fadeIn("slow").hide();
            $(this).siblings(".addmore__qty").css("opacity", "1");
            $(this).siblings(".addmore__qty").css("display", "block");
            emptySearch();
        });

        for (let pObj of config.products) {
            getAllProducts.push(...pObj.items);
        }

        $('input').on('input', function () {
            if (this.type === "search") return;
            this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/^0[^.]/, '0');
            return;
        });
    }

    $('#search_input').on("input", function (e) {
        e.preventDefault();
        e.stopPropagation();
        processChange(this);
    });

    $('.close__icon__box').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        emptySearch(this);
    });

    $('.product-bottom-details').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        addProducts(this);
        emptySearch(this);
    });

    $('.counter__minus').click(function (e) {
        updateCounter(this, "minus");
        emptySearch();
    });

    $('.counter__plus').click(function (e) {
        updateCounter(this, "add");
        emptySearch();
    });

    $('.item-drop').click(function (e) {
        // e.preventDefault();
        // e.stopPropagation();
        updateDropDownMenu(this);
    });

    $('.submit').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
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
                updateCounter($($(counterInput).siblings()[1]).children()[0], "add", "", "bulk");
            }
            passDataToBot(cartData, "bulk");
        }
    });
}

function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function insertSearchBar() {
    document.getElementById("search_input").placeholder = config.search.placeholder;
}

function insertTabContainer() {
    $("#tab_container").prepend(`<p class="title">${config.tabs_section.tabs_title}</p>`)
    config.tabs_section.tabs.map((val, tabNum) => {
        let classname = val.active ? "'grid__item active'" : "'grid__item'";
        $("#griddy").append(`
            <div id=${"tab_grid_item" + tabNum} class=${classname} onclick="switchTabs(${tabNum})">
                <div class="icon__wrapper">
                    <img class="icon" src=${val.tab_icon} alt="Promotions & Products" />
                </div>
                <div class="detail">${val.tab_description}</div>
            </div>
        `)
    });
}

function removeTabContainer(id) {
    document.getElementById(id).remove();
}

function detectIsOverflow(element) {
    return element.scrollHeight > element.clientHeight
}

function insertPromotionsContainer() {
    $("#promotions_container").prepend(`<p class="products__title">${config.promotions.promotions_title}</p>`)
    config.promotions.products.map((promotion) => {
        let isdisabled = promotion.quantity_available ? false : true;
        let btnName = isdisabled ? "Out of stock" : "ADD";
        $("#promotions_products_container").append(`
            <div class="product-card">
                <div class="product-tumb">
                    <div class="icon"></div>
                    <img class="img__wrapper" src=${promotion.icon} alt="">
                </div>
                <div class="product__details">
                    <div class="product__text__wrapper">
                        <p class="product__name">${promotion.name}</p>
                        <p class="product__quantity">${promotion.description}</p>
                        ${promotion.description.length > 60 ? `<div class="readmore">read more</div>` : ""}
                        <div class="readless hide">read less</div>
                        <p class="product__price">Rs. ${numberWithCommas(promotion.price)}</p>
                    </div>
                    <div isdisabled=${isdisabled} class="product-bottom-details" id="promotions-add-${promotion.sku}" product="${encodeURIComponent(JSON.stringify(promotion))}">
                        <div class="btn" isdisabled=${isdisabled}>${btnName}</div>
                    </div>
                    <div class="counter__wrapper hide" id="promotions-counter-${promotion.sku}">
                        <div class="counter__container">
                            <div class="counter__box__container">
                                <div class="counter__minus" id="minus" product="${encodeURIComponent(JSON.stringify(promotion))}">
                                    <img src="/coke/assets/images/png/minus.png" />
                                </div>
                            </div>
                        
                            <input id="counter_input_${promotion.sku}" class="counter__input home" type="text" value="1" size="2" maxlength="2" autocomplete="off" previous-value="1" />
                            <div class="counter__box__container">
                                <div class="counter__plus" id="plus" product="${encodeURIComponent(JSON.stringify(promotion))}">
                                    <img src="/coke/assets/images/png/plus.png" />
                                </div>
                            </div>
                            <div class="addmore__qty">
                                <div class="submit" product="${encodeURIComponent(JSON.stringify(promotion))}">
                                    <img src="/coke/assets/images/svg/icons8-ok.svg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });

    $('.readmore').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        let readlessSibling = $(this).siblings(".readless")[0];
        let readmoreSibling = $(this).siblings(".product__quantity")[0];
        $(this).hide();
        $(readlessSibling).show();
        $(readmoreSibling).css("display", "block");
    });

    $('.readless').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        let readlessSibling = $(this).siblings(".readmore")[0];
        let readmoreSibling = $(this).siblings(".product__quantity")[0];
        $(this).hide();
        $(readlessSibling).show();
        $(readmoreSibling).css("display", "-webkit-box");
    });

}

function insertOrderHistoryProducts(data) {
    var titleEle = ".recent_order_title";
    $(titleEle).empty();
    $("#orderhistory_container").prepend(`<p class="products__title recent_order_title">${config.recent_order.title}</p>`)
    var elementNode = "#orderhistory_container__inner";
    $(elementNode).empty();
    // JAY
    data.map((product) => {
    // config.recent_order.products.map((product) => {
        $(elementNode).append(`
            
            <div class="order__history__wrapper">
                <div class="history__details">
                    <div class="date">${product.order_date}</div>
                    <div class="price">Rs. ${product.order_amount}</div>
                </div>
                <div class="order__section">
                    <div class="details__section">
                        <div class="name">${product.name}</div>
                        <div class="units">SKU:&nbsp;${product.unit}</div>
                        <div class="discount__detail">${product.discount_detail}</div>
                        <div class="discount__detail__bar"><div class="description">${product.discount_description}</div></div>
                    </div>
                    <div class="product__counter">
                        <div class="icon__wrapper">
                            <img src="https://cdn.yellowmessenger.com/lz1hLoQ0Vqo91653626367953.svg"/>
                        </div>
                        <div class="repeat orderhistory" id="product-bottom-details" product="${encodeURIComponent(JSON.stringify(product))}">
                            <div class="btn">REPEAT</div>
                        </div>
                        <div class="counter__wrapper orderhistory hide" id="product-bottom-details-repeat" product="${encodeURIComponent(JSON.stringify(product))}">
                            <div class="btn">
                                ADDED 
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24px" height="24px">
                                        <g id="surface84587172">
                                        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;" d="M 4.707031 3.292969 L 3.292969 4.707031 L 10.585938 12 L 3.292969 19.292969 L 4.707031 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.707031 L 19.292969 3.292969 L 12 10.585938 Z M 4.707031 3.292969 "/>
                                        </g>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    });

    $(".counter__wrapper.orderhistory").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        updateProductsBasedOnProducts(this, "minus");
    });
    $(".repeat.orderhistory").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        updateProductsBasedOnProducts(this, "add");
    });
}

function insertFilterBar() {
    if (!($("#product_header_bar").is(":visible"))) {
        $("#product_header_bar").css('display', 'flex');
    }
    $("#product_header_bar").prepend(`<p class="title">${config.filterbar.title}</p>`)
    config.filterbar.menu.map((item) => {
        $("#dropdown_items").append(`<li class="item-drop" item="${encodeURIComponent(JSON.stringify(item))}">${item.name}</li>`);
    });
}

function insertProducts(products, sortedBy) {
    let iconValue = sortedBy === "volume_name" ? "icon" : "bybrandsIcons";
    console.log("icon value --> ", iconValue);
    products.map((product, index) => {
        console.log("icon inner ", product[iconValue]);
        $("#product_item_container").append(`
            <div class="faq-drawer">
                <input class="faq-drawer__trigger" id=${"faq-drawer" + "-" + index} type="checkbox" autocomplete="off"/>
                <label class="faq-drawer__title" for=${"faq-drawer" + "-" + index}>
                    ${product[sortedBy]}
                    <div class="product__bar__icon"><img src=${product[iconValue]} /></div>
                </label>
                <div class="faq-drawer__content-wrapper">
                    <div class="faq-drawer__content">
                        <div class="products__container inner" id=${"products_container_inner" + index}>
                          
                        </div>
                    </div>
                </div>
            </div>
        `);
    });

    $(".faq-drawer__title").click(function () {
        let drawerContentBox = $(this).siblings(".faq-drawer__content-wrapper").children().children(".products__container.inner");
        let drawerContentBoxHeight = drawerContentBox[0].offsetHeight;
        if ($(this).siblings(".faq-drawer__content-wrapper").hasClass("ashish")) {
            $($(this).siblings(".faq-drawer__content-wrapper")).css("max-height", 0);
            $(this).siblings(".faq-drawer__content-wrapper").removeClass("ashish");
        } else {
            $($(this).siblings(".faq-drawer__content-wrapper")).css("max-height", drawerContentBoxHeight + 32);
            $(this).siblings(".faq-drawer__content-wrapper").addClass("ashish");
        }
    });
}

function insertInnerProducts(products) {
    products.map((product, index) => {
        let listitem = "#products_container_inner" + index;
        product.items.map((item) => {
            let isdisabled = item.quantity_available ? false : true;
            let btnName = isdisabled ? "Out of stock" : "ADD";
            $(listitem).append(`
                <div class="product-card">
                    <div class="product-tumb inner">
                        <div class="innerbox">
                            <img class="img__wrapper inner" src=${item.icon} alt="">
                        </div>
                    </div>
                    <div class="product__details inner">
                        <div class="product__text__wrapper">
                            <p class="product__name">${item.name} - ${item.listing_type}</p>
                            <p class="product__quantity">${item.description}</p>
                            <p class="product__price">Rs. ${numberWithCommas(item.price)}</p>
                        </div>
                        <div isdisabled=${isdisabled} class="product-bottom-details" id="promotions-add-${item.sku}" product="${encodeURIComponent(JSON.stringify(item))}">
                            <div class="btn inner" isdisabled=${isdisabled}>${btnName}</div>
                        </div>
                        <div class="counter__wrapper hide" id="promotions-counter-${item.sku}">
                            <div class="counter__container">
                                <div class="counter__box__container">
                                    <div class="counter__minus" id="minus" product="${encodeURIComponent(JSON.stringify(item))}">
                                        <img src="/coke/assets/images/png/minus.png"/>
                                    </div>
                                </div>
                            
                                <input id="counter_input_${item.sku}" class="counter__input home" type="text" value="1" size="2" maxlength="2" autocomplete="off" previous-value="1" />
                                <div class="counter__box__container">
                                    <div class="counter__plus" id="plus" product="${encodeURIComponent(JSON.stringify(item))}">
                                        <img src="/coke/assets/images/png/plus.png" />
                                    </div>
                                </div>
                                <div class="addmore__qty">
                                    <div class="submit" product="${encodeURIComponent(JSON.stringify(item))}">
                                        <img src="/coke/assets/images/svg/icons8-ok.svg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    });
}

function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function saveInput(node) {
    var filter = "keywords";
    var keyword = node.value;
    var filteredData = getAllProducts.filter(function (obj) {
        console.log("\n\n\n search \n\n\n");
        console.log(obj[filter]);
        console.log(keyword.toLowerCase());

        if (obj[filter] != "") {
            return obj[filter].includes(keyword.toLowerCase());
        }
    });
    searchProducts(filteredData)
}


let processChange = debounce((node) => saveInput(node));

function searchProducts(node) {
    $("#search_product_box").fadeIn().show();
    $(".product.searchproducts").remove();
    $('.close__icon__box').show();
    node.map((item) => {
        let isdisabled = item.quantity_available ? false : true;
        let btnName = isdisabled ? "Out of stock" : "ADD";
        $("#search_product_wrap").append(`
            <div class="product searchproducts">
                <div class="left__wrapper">
                    <div class="name">${item.name} - ${item.listing_type}</div>
                    <div class="description">${item.description}</div>
                    <div class="price">Rs. ${numberWithCommas(item.price)}</div>
                </div>
                <div class="right__wrapper searchbox">
                    <div isdisabled=${isdisabled} class="product-bottom-details" id="promotions-add-searchbox-${item.sku}" product="${encodeURIComponent(JSON.stringify(item))}">
                        <div class="btn" isdisabled=${isdisabled}>${btnName}</div>
                    </div>
                    <div class="counter__wrapper hide" id="promotions-counter-searchbox-${item.sku}">
                        <div class="counter__container checkout">
                            <div class="counter__box__container">
                                <div class="counter__minus search" id="minus" product="${encodeURIComponent(JSON.stringify(item))}">
                                    <img src="/coke/assets/images/png/minus.png" />
                                </div>
                            </div>
                        
                            <input id="counter_input_${item.sku}" class="counter__input search" type="text" value=${cartData[item.sku] ? cartData[item.sku].quantity : "1"} size="2" maxlength="2" autocomplete="off" previous-value="1" />
                            <div class="counter__box__container">
                                <div class="counter__plus search" id="plus" product="${encodeURIComponent(JSON.stringify(item))}">
                                    <img src="/coke/assets/images/png/plus.png" />
                                </div>
                            </div>
                            <div class="addmore__qty searchbox">
                                <div class="submit search" product="${encodeURIComponent(JSON.stringify(item))}">
                                    <img src="/coke/assets/images/svg/icons8-ok.svg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
    if (node.length !== 0) {
        for (let key in cartData) {
            $(`#promotions-add-searchbox-${key}`).hide();
            $(`#promotions-counter-searchbox-${key}`).show();
        }

        $('.product-bottom-details').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            addProducts(this);
            let productData = $(this).attr("product");
            let decodedProductData = JSON.parse(decodeURIComponent(productData));
            $(`#promotions-add-${decodedProductData.sku}`).hide();
            $(`#promotions-counter-${decodedProductData.sku}`).show();
        });

        $('.counter__minus.search').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            updateCounter(this, "minus");
            let productData = $(this).attr("product");
            let decodedProductData = JSON.parse(decodeURIComponent(productData));
            if(cartData[decodedProductData.sku].quantity === 0) {
                $(`#promotions-add-${decodedProductData.sku}`).show();
                $(`#promotions-counter-${decodedProductData.sku}`).hide();
                return;
            } 
            $(`#promotions-add-${decodedProductData.sku}`).hide();
            let inputArr = [...document.querySelectorAll(`#counter_input_${decodedProductData.sku}`)];
            inputArr.map(v => {
                $(v).val(parseInt(cartData[decodedProductData.sku].quantity));
                $(v).change();
                // $(v).attr("previous-value", previousValue);
            })
            $(`#promotions-counter-${decodedProductData.sku}`).show();
        });

        $('.counter__plus.search').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            updateCounter(this, "add");
            
            let productData = $(this).attr("product");
            let decodedProductData = JSON.parse(decodeURIComponent(productData));
            $(`#promotions-add-${decodedProductData.sku}`).hide();
            let inputArr = [...document.querySelectorAll(`#counter_input_${decodedProductData.sku}`)];
            inputArr.map(v => {
                $(v).val(parseInt(cartData[decodedProductData.sku].quantity));
                $(v).change();
                // $(v).attr("previous-value", previousValue);
            })
            $(`#promotions-counter-${decodedProductData.sku}`).show();
        });

        $('.counter__input.search').blur(function (e) {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(() => {
                if (this.type === "search") return;
                $(this).val($(this).attr("previous-value"));
                $($(this).siblings()[0]).fadeIn("slow").show();
                $($(this).siblings()[1]).fadeIn("slow").show();
                $(this).siblings(".addmore__qty").css("opacity", "0");
                $(this).siblings(".addmore__qty").css("display", "none");
            }, 500);
        });

        $('.counter__input.search').focus(function (e) {
            if (this.type === "search") return;
            $($(this).siblings()[0]).fadeIn("slow").hide();
            $($(this).siblings()[1]).fadeIn("slow").hide();
            $(this).siblings(".addmore__qty").css("opacity", "1");
            $(this).siblings(".addmore__qty").css("display", "block");
        });

        $('.submit.search').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
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
                    updateCounter($($(counterInput).siblings()[1]).children()[0], "add", "", "bulk");
                }

                $(`#promotions-add-${decodedProductData.sku}`).hide();
                let inputArr = [...document.querySelectorAll(`#counter_input_${decodedProductData.sku}`)];
                inputArr.map(v => {
                    $(v).val(parseInt(cartData[decodedProductData.sku].quantity));
                    $(v).change();
                    $(v).attr("previous-value", previousValue);
                })
                $(`#promotions-counter-${decodedProductData.sku}`).show();
                passDataToBot(cartData, "bulk");
                // $(`#counter_input_${decodedProductData.sku}`).attr("previous-value", parseInt(cartData[decodedProductData.sku].quantity) - 1 > 0 ? parseInt(cartData[decodedProductData.sku].quantity) - 1 : 0);
            }
        });
    }
}

function emptySearch(node) {
    $("#search_product_wrap").empty();
    $("#search_product_box").fadeIn().hide();
    $("#search_input").val("");
    $('.close__icon__box').hide();
}

function switchTabs(id) {
    let siblings = $(event.target).siblings();
    let parsedSiblings = [...siblings]
    parsedSiblings.forEach(ele => {
        $(ele).removeClass("active");
    });

    let gridItem = [...$(`.grid__item`)];

    gridItem.map(item => {
        $(item).removeClass("active");
        $("#promotions_products_container").hide();
        $("#promotions_container").hide();
        $("#product_wrapper").hide();
        $("#orderhistory_container").hide();
    })

    switch (id) {
        case 0:
            $(`#tab_grid_item${id}`).toggleClass("active");
            $("#product_wrapper").show();
            $("#promotions_container").show();
            $("#promotions_products_container").show();
            break;
        case 1:
            $(`#tab_grid_item${id}`).toggleClass("active");
            $("#promotions_container").show();
            $("#promotions_products_container").show();
            $("#product_wrapper").hide();
            break;
        case 2:
            $(`#tab_grid_item${id}`).toggleClass("active");
            $("#promotions_products_container").hide();
            $("#promotions_container").hide();
            $("#product_wrapper").hide();
            $("#orderhistory_container").show();
            break;
        default:
            break;
    }

    // JAY
    if (id == 2) {
        // fire an event to get order history
        window.parent.postMessage(JSON.stringify({
            event_code: 'custom-recent-order-event',
            data: { phone: config.phone }
        }), '*'); 
    }
}



function addProducts(quantityInput) {
    let siblingWrapper = $(quantityInput).siblings(".counter__wrapper");
    let productData = $(quantityInput).attr("product");
    let decodedProductData = JSON.parse(decodeURIComponent(productData));
    if (cartData && Object.keys(cartData).length !== 0 && cartData[decodedProductData.sku]?.quantity >= decodedProductData?.itemspercase) {
        showToastMessage(decodedProductData.itemspercase);
        return false;
    }
    $(quantityInput).hide();
    $(siblingWrapper).show();
    let numberCircleCount = $("#numberCircle").attr("value");
    let parseCount = Number(numberCircleCount)
    let updatedValue = parseCount + 1;
    $("#numberCircle").attr("value", updatedValue);
    $("#numberCircle").text(updatedValue);
    updateCheckoutCartData(decodedProductData, "add");
}


function updateCounter(counterInput, type, requestFrom, bulkType) {
    let siblingWrapper = $(counterInput).parent().siblings(".counter__input");
    if (type === "add") {
        var $input = $(siblingWrapper);
        let productData = $(counterInput).attr("product");
        let decodedProductData = JSON.parse(decodeURIComponent(productData));
        if (cartData && Object.keys(cartData).length !== 0 && cartData[decodedProductData.sku]?.quantity >= decodedProductData?.itemspercase) {
            showToastMessage(decodedProductData.itemspercase);
            return false;
        }

        if (decodedProductData.itemspercase <= parseInt($input.val())) {
            showToastMessage(decodedProductData.itemspercase);
            return false;
        }
        $input.val(parseInt($input.val()) + 1);
        $input.change();
        $input.attr("previous-value", $input.val());
        let numberCircleCount = $("#numberCircle").attr("value");
        let parseCount = Number(numberCircleCount)
        let updatedValue = parseCount + 1;
        $("#numberCircle").attr("value", updatedValue);
        $("#numberCircle").text(updatedValue);
        updateCheckoutCartData(decodedProductData, "add", bulkType);
        return false;
    }

    if (type === "minus") {
        var $input = $(siblingWrapper);
        var count = parseInt($input.val()) - 1;
        if (count >= 0) {
            let productData = $(counterInput).attr("product");
            let decodedProductData = JSON.parse(decodeURIComponent(productData));
            if (count == 0) {
                let parentAddWrapper = $(counterInput).parent().parent().parent();
                let siblingAddWrapper = $(counterInput).parent().parent().parent().siblings(".product-bottom-details");
                $(parentAddWrapper).hide();
                $(siblingAddWrapper).show();
                let numberCircleCount = $("#numberCircle").attr("value");
                let parseCount = Number(numberCircleCount)
                let updatedValue = parseCount - 1;
                $("#numberCircle").attr("value", updatedValue);
                $("#numberCircle").text(updatedValue);
                if (requestFrom && requestFrom === "checkout") {
                    $(`#promotions-add-${decodedProductData.sku}`).show()
                    $(`#promotions-counter-${decodedProductData.sku}`).hide()
                }
            } else {
                $input.val(count);
                $input.change();
                $input.attr("previous-value", $input.val());
                let numberCircleCount = $("#numberCircle").attr("value");
                let parseCount = Number(numberCircleCount)
                let updatedValue = parseCount - 1;
                $("#numberCircle").attr("value", updatedValue);
                $("#numberCircle").text(updatedValue);
            }

            updateCheckoutCartData(decodedProductData, "minus", bulkType);
            return false;
        }
        count = count < 1 ? 0 : count;
        /*  let parentAddWrapper = $(counterInput).parent().parent().parent();
         let siblingAddWrapper = $(counterInput).parent().parent().parent().siblings(".product-bottom-details");
         $(parentAddWrapper).hide();
         $(siblingAddWrapper).show(); */
    }
}

function updateDropDownMenu(dpItem) {
    $("#dpValue").text($(dpItem).text());
    $("#product_item_container").empty();
    let dpItemAttr = JSON.parse(decodeURIComponent($(dpItem).attr("item")));
    let sortedProducts = groupProductsByCategory(config.products, dpItemAttr.sortBy);
    // let products = sortProducts(config.products, dpItemAttr.sortBy);
    let sortedBy = dpItemAttr.sortBy === "volume" ? "volume_name" : dpItemAttr.sortBy;
    insertProducts(sortedProducts, sortedBy);
    insertInnerProducts(sortedProducts);
    if (cartData && Object.keys(cartData).length !== 0) {
        for (let key in cartData) {
            $(`#promotions-add-${key}`).hide();
            $(`#promotions-counter-${key}`).show();
            $(`#counter_input_${key}`).val(parseInt(cartData[key].quantity));
            $(`#counter_input_${key}`).change();
            $(`#counter_input_${key}`).attr("previous-value", parseInt(cartData[key].quantity) - 1 > 0 ? parseInt(cartData[key].quantity) - 1 : 0);
        }

        $('.counter__minus').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            updateCounter(this, "minus");
        });

        $('.counter__plus').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            updateCounter(this, "add");
        });

        $('.product-bottom-details').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            addProducts(this)
        });
    }

}

function groupProductsByCategory(productsItemsJson, sortBy) {
    let sortedProducts = [];
    let productsArrayCopy = JSON.parse(JSON.stringify(productsItemsJson));
    let groupedItems = groupProductsIntoItems(productsArrayCopy, sortBy);
    let sortCategory = sortProductsByCategory(groupedItems);
    if(sortBy === "brand") {
        let uniqueListArr = getUniqueListBy(productsArrayCopy, 'brand');
        sortedProducts = sortedByProducts(sortCategory, uniqueListArr, sortBy);
    } else {
        sortedProducts = sortedByProducts(sortCategory, productsArrayCopy, sortBy);
    }
    return sortedProducts;
}

function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

function groupProductsIntoItems(productsArray, sortBy) {
    let groupProductsMultiJson = [];
    for (let i = 0; i < productsArray.length; i++) {
        groupProductsMultiJson.push(groupBy(productsArray[i].items, sortBy));
    }
    return groupProductsMultiJson;
}

function sortProductsByCategory(groupedItems) {
    let sorted = {};
    for (let i = 0; i < groupedItems.length; i++) {
        for (let key in groupedItems[i]) {
            if (sorted[key]) {
                sorted[key] = [...sorted[key], ...groupedItems[i][key]];
            } else {
                sorted[key] = [...groupedItems[i][key]];
            }
        }
    }
    return sorted;
}

function sortedByProducts(sorted, productsArray, sortBy) {
    for (let i = 0; i < productsArray.length; i++) {
        productsArray[i].items = sorted[productsArray[i][sortBy]];
    }
    return productsArray;
}

function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
        let key = obj[property]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj)
        return acc
    }, {})
}

function sortProducts(products, sortBy) {
    if (sortBy === "name") {
        return products.sort(function (a, b) {
            const bandA = a[sortBy].toUpperCase();
            const bandB = b[sortBy].toUpperCase();

            let comparison = 0;
            if (bandA > bandB) {
                comparison = -1;
            } else if (bandA < bandB) {
                comparison = 1;
            }
            return comparison;
        });
    }
    return products.sort(function (a, b) {
        return parseFloat(a.sortBy) - parseFloat(b.sortBy);
    });
}

function updateCheckoutCartData(data, type, bulkType) {
    if (Object.keys(cartData).length == 0) {
        cartData[data.sku] = {
            "product_data": data,
            "quantity": 1
        }
        processQ(cartData, data.sku, bulkType);
        return;
    }

    for (const key in cartData) {
        if (data.sku === key) {
            let q = cartData[key]["quantity"];
            if (type === "add") {
                cartData[key] = {
                    "product_data": data,
                    "quantity": q + 1
                }
            }

            if (type === "minus") {
                cartData[key] = {
                    "product_data": data,
                    "quantity": q - 1
                }
            }
        } else {
            if (!cartData[data.sku]) {
                cartData[data.sku] = {
                    "product_data": data,
                    "quantity": 1
                }
            }
        }

    }
    processQ(cartData, data.sku, bulkType);
}

function updateProductsBasedOnProducts(node, type) {
    let orderhistoryNode = "";
    /* let productData = $(node).attr("product");
    let decodedProductData = JSON.parse(decodeURIComponent(productData));
    if (type === "add") {
        orderhistoryNode = $(node).siblings(".counter__wrapper.orderhistory");
        let numberCircleCount = $("#numberCircle").attr("value");
        let parseCount = Number(numberCircleCount)
        let updatedValue = parseCount + 1;
        $("#numberCircle").attr("value", updatedValue);
        $("#numberCircle").text(updatedValue);
    }
    if (type === "minus") {
        orderhistoryNode = $(node).siblings(".repeat.orderhistory");
        let numberCircleCount = $("#numberCircle").attr("value");
        let parseCount = Number(numberCircleCount)`
        let updatedValue = parseCount - 1;
        $("#numberCircle").attr("value", updatedValue);
        $("#numberCircle").text(updatedValue);
    }
    $(orderhistoryNode).show();
    $(node).hide(); */
    // updateCheckoutCartData(decodedProductData, type);

    let productDataa = $(node).attr("product");
    let decodedProductDataa = JSON.parse(decodeURIComponent(productDataa));
    let products = decodedProductDataa.products;
    let count = 0;
    for (const key in products) {
        count++;
        let data = products[key].product_data;
        for (let i = 0; i < products[key].quantity; i++) {
            if (type === "add") {
                if (data.itemspercase <= parseInt(products[key].quantity)) {
                    showToastMessage(data.itemspercase);
                    $(orderhistoryNode).show();
                    $(node).hide();
                    passDataToBot(cartData);
                    return false;
                }
                orderhistoryNode = $(node).siblings(".counter__wrapper.orderhistory");
                let numberCircleCount = $("#numberCircle").attr("value");
                let parseCount = Number(numberCircleCount)
                let updatedValue = parseCount + 1;
                $("#numberCircle").attr("value", updatedValue);
                $("#numberCircle").text(updatedValue);
            }
            if (type === "minus") {
                if (data.itemspercase <= parseInt(products[key].quantity)) {
                    $(node).hide();
                    $(orderhistoryNode).show();
                    return false;
                }
                orderhistoryNode = $(node).siblings(".repeat.orderhistory");
                let numberCircleCount = $("#numberCircle").attr("value");
                let parseCount = Number(numberCircleCount);
                let updatedValue = parseCount - 1;
                $("#numberCircle").attr("value", updatedValue);
                $("#numberCircle").text(updatedValue);
            }
            updateCheckoutCartData(data, type, "bulk");
            if(count === Object.keys(products).length && i === products[key].quantity - 1) {
                passDataToBot(cartData);
            }
        }
        // processQ({[key] : data}, key);

    }
    $(orderhistoryNode).show();
    $(node).hide();
}

function showToastMessage(maxItems) {
    var x = document.querySelector("#simpleToast");
    x.className = "show";
    $(x).children(".toastMsg").text(`Max limit reached | ${maxItems} units`)
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}