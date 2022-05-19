window.addEventListener('message', function (eventData) {
    console.log("Get the sent data ", eventData);
    const parsedEventData = JSON.parse(eventData.data)
    console.log("received data from parent iframe ", parsedEventData);
    if (parsedEventData.event_code === "custom-child-client-event") {
        console.log("\n\n\n\n\n\n\n HEYYYYYYYYYYYYYYYYYYY \n\n\n\n\n\n\n\n");
        console.log(parsedEventData);

        console.log("hitesh sir =-> ", document.getElementById('bodyContent'));
        var scriptTag = document.createElement('script');
        scriptTag.src = "/coke/assets/js/custom.js";
        scriptTag.type = "text/javascript";
        document.getElementById('bodyContent').append(scriptTag);
        setTimeout(() => {
            loadPageContent("homepage", parsedEventData.data);
            loadCheckoutPageContent("checkoutpage", parsedEventData.data);
        }, 500);
    }
    
    if (parsedEventData.event_code === "custom-parentchild-client-checkout-event") {
        console.log("\n\n\n\n\n\n\n discount data received \n\n\n\n\n\n\n\n");
        console.log(parsedEventData);
        let data = [
            {
                offerType: "rupee",
                product_name: "",
                quantity: "",
                product_price: "",
                discountedPrice:"",
                discountPrice: "",
                display_message: "test test test test",
                offer_name:"TEST"
            },
            {
                offerType: "percentage",
                product_name: "",
                quantity:"",
                product_price:"",
                discountedPrice: "",
                discountedPercent:"",
                display_message: "test test test",
                offer_name:"TEST2"
            },           
            {
                offerType: "product",
                product_name: "*Free* " + "productName",
                quantity: "",
                product_price: "Rs.0",
                unit_price: 0,
                discountedPrice: 0,
                display_message: "test test test",
                offer_name:"TEST"
            }
        ]
        insertSelectedCoupon(parsedEventData.data, false, orderCartData);
    }

    if (parsedEventData.event_code === "custom-parentchild-client-recent-order-event") {
        console.log("\n\n\n\n\n\n\n Recent Order data received \n\n\n\n\n\n\n\n");
        console.log(parsedEventData);
        insertOrderHistoryProducts(parsedEventData.data)
    }
});

/* var config = {
    "search": {
        "placeholder": "Search for beverage..."
    },
    "tabs_section": {
        "tabs_title": "Drink what makes you happy!",
        "tabs": [
            {
                "tab_icon": "/coke/assets/images/svg/basket.svg",
                "tab_description": "Promotions <br />& Products",
                "active": true
            },
            {
                "tab_icon": "/coke/assets/images/svg/promotions.svg",
                "tab_description": "Promotions",
                "active": false
            },
            {
                "tab_icon": "/coke/assets/images/svg/recent_order.svg",
                "tab_description": "Recently Ordered",
                "active": false
            }
        ]
    },
    "promotions": {
        "promotions_title": "Promotions on",
        "products": [
            {
                "sku": "CCPPID1",
                "keywords": "Kinley case offer; 5 case offer; Kinley 5 case",
                "name": "Kinley 5 case offer",
                "description": "7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack",
                "price": "14.95",
                "itemspercase": 12,
                "costprice": "16.95",
                "icon": "/coke/assets/images/png/product.png",
                "quantity_available": false,
                "discount": "",
                "discount_detail": "5 case offer on 1L/500ML",
                "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
            },
            {
                "sku": "CCPPID2",
                "keywords": "coke case offer; 5 coke offer; coke 5 case",
                "name": "Coke 5 case offer",
                "description": "7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack 7.5 fl oz, 10 pack",
                "price": "14.95",
                "itemspercase": 12,
                "costprice": "16.95",
                "icon": "/coke/assets/images/png/product.png",
                "quantity_available": true,
                "discount": "",
                "discount_detail": "5 case offer on 1L/500ML",
                "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
            },
            {
                "sku": "CCPPID3",
                "keywords": "sprite case offer; 5 case offer; Kinley 5 case",
                "name": "Sprite 5 case offer",
                "description": "7.5 fl oz, 10 pack",
                "price": "14.95",
                "itemspercase": 12,
                "costprice": "16.95",
                "icon": "/coke/assets/images/png/product.png",
                "quantity_available": false,
                "discount": "",
                "discount_detail": "5 case offer on 1L/500ML",
                "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
            },
            {
                "sku": "CCPPID4",
                "keywords": "Diet coke offer; 10 case offer; ",
                "name": "Diet 5 case offer",
                "description": "7.5 fl oz, 10 pack",
                "price": "14.95",
                "itemspercase": 12,
                "costprice": "16.95",
                "icon": "/coke/assets/images/png/product.png",
                "quantity_available": true,
                "discount": "",
                "discount_detail": "5 case offer on 1L/500ML",
                "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
            }
        ]
    },
    "filterbar": {
        "title": "Products",
        "menu": [
            
            {
                "name": "Volume",
                "active": true,
                "sortBy": "volume",
            },
            {
                "name": "Brand",
                "active": false,
                "sortBy": "brand",
            },
        ]
    },
    "products": [
        {
            "icon": "/assets/images/svg/coke_product.svg",
            "volume_name": "2 Ltr",
            "volume": 2,
            "brand": "coke",
            "items": [
                {
                    "sku": "CCPPID5",
                    "keywords": "",
                    "name": "Coca-Cola",
                    "description": "7.5 fl oz, 10 pack",
                    "price": "14.95",
                    "itemspercase": 12,
                    "costprice": "16.95",
                    "icon": "/coke/assets/images/svg/coke_xl.svg",
                    "quantity_available": false,
                    "discount": "",
                    "discount_detail": "5 case offer on 1L/500ML",
                    "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                    "brand": "coke",
                    "volume": 2
                },
                {
                    "sku": "CCPPID6",
                    "keywords": "",
                    "name": "Sprite",
                    "description": "7.5 fl oz, 10 pack",
                    "price": "14.95",
                    "itemspercase": 12,
                    "costprice": "16.95",
                    "icon": "/coke/assets/images/svg/sprite_xl.svg",
                    "quantity_available": true,
                    "discount": "",
                    "discount_detail": "5 case offer on 1L/500ML",
                    "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                    "brand": "sprite",
                    "volume": 1
                },
                {
                    "sku": "CCPPID7",
                    "keywords": "",
                    "name": "Fanta",
                    "description": "7.5 fl oz, 10 pack",
                    "price": "14.95",
                    "itemspercase": 12,
                    "costprice": "16.95",
                    "icon": "/coke/assets/images/svg/fanta_xl.svg",
                    "quantity_available": true,
                    "discount": "",
                    "discount_detail": "5 case offer on 1L/500ML",
                    "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                    "brand": "coke",
                    "volume": 1
                },
                {
                    "sku": "CCPPID8",
                    "keywords": "zero",
                    "name": "Coke zero",
                    "description": "7.5 fl oz, 10 pack",
                    "price": "14.95",
                    "itemspercase": 12,
                    "costprice": "16.95",
                    "icon": "/coke/assets/images/svg/coke_zero_xl.svg",
                    "quantity_available": true,
                    "discount": "",
                    "discount_detail": "5 case offer on 1L/500ML",
                    "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                    "brand": "fanta",
                    "volume": 2
                }
            ]
        },
        {
            "icon": "/assets/images/svg/fanta_xl.svg",
            "volume_name": "1 Ltr",
            "volume": 1,
            "brand": "fanta",
            "items": [
                {
                    "sku": "CCPPID9",
                    "keywords": "",
                    "name": "Fanta",
                    "description": "7.5 fl oz, 10 pack",
                    "price": "14.95",
                    "itemspercase": 12,
                    "costprice": "16.95",
                    "icon": "/coke/assets/images/svg/fanta_xl.svg",
                    "quantity_available": true,
                    "discount": "",
                    "discount_detail": "5 case offer on 1L/500ML",
                    "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                    "brand": "fanta",
                    "volume": 0.250
                },
                {
                    "sku": "CCPPID10",
                    "keywords": "",
                    "name": "Coca-Cola",
                    "description": "7.5 fl oz, 10 pack",
                    "price": "14.95",
                    "itemspercase": 12,
                    "costprice": "16.95",
                    "icon": "/coke/assets/images/svg/coke_xl.svg",
                    "quantity_available": true,
                    "discount": "",
                    "discount_detail": "5 case offer on 1L/500ML",
                    "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                    "brand": "coke",
                    "volume": 0.250
                },
                {
                    "sku": "CCPPID11",
                    "keywords": "",
                    "name": "Sprite",
                    "description": "7.5 fl oz, 10 pack",
                    "price": "14.95",
                    "itemspercase": 12,
                    "costprice": "16.95",
                    "icon": "/coke/assets/images/svg/sprite_xl.svg",
                    "quantity_available": true,
                    "discount": "",
                    "discount_detail": "5 case offer on 1L/500ML",
                    "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                    "brand": "sprite",
                    "volume": 1
                },
                {
                    "sku": "CCPPID12",
                    "keywords": "",
                    "name": "Coke zero",
                    "description": "7.5 fl oz, 10 pack",
                    "price": "14.95",
                    "itemspercase": 12,
                    "costprice": "16.95",
                    "icon": "/coke/assets/images/svg/coke_zero_xl.svg",
                    "quantity_available": true,
                    "discount": "",
                    "discount_detail": "5 case offer on 1L/500ML",
                    "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                    "brand": "fanta",
                    "volume": 1
                }
            ]
        },
        {
            "icon": "/assets/images/svg/sprite_product.svg",
            "volume_name": "250 Ml",
            "volume": 0.250,
            "brand": "sprite",
            "items": [
                {
                    "sku": "CCPPID13",
                    "keywords": "",
                    "name": "Sprite",
                    "description": "7.5 fl oz, 10 pack",
                    "price": "14.95",
                    "itemspercase": 12,
                    "costprice": "16.95",
                    "icon": "/coke/assets/images/svg/sprite_xl.svg",
                    "quantity_available": true,
                    "discount": "",
                    "discount_detail": "5 case offer on 1L/500ML",
                    "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                    "brand": "coke",
                    "volume": 2
                },
                {
                    "sku": "CCPPID14",
                    "keywords": "",
                    "name": "Coca-Cola",
                    "description": "7.5 fl oz, 10 pack",
                    "price": "14.95",
                    "itemspercase": 12,
                    "costprice": "16.95",
                    "icon": "/coke/assets/images/svg/coke_xl.svg",
                    "quantity_available": true,
                    "discount": "",
                    "discount_detail": "5 case offer on 1L/500ML",
                    "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                    "brand": "sprite",
                    "volume": 0.250
                },
                {
                    "sku": "CCPPID15",
                    "keywords": "",
                    "name": "Fanta",
                    "description": "7.5 fl oz, 10 pack",
                    "price": "14.95",
                    "itemspercase": 12,
                    "costprice": "16.95",
                    "icon": "/coke/assets/images/svg/fanta_xl.svg",
                    "quantity_available": true,
                    "discount": "",
                    "discount_detail": "5 case offer on 1L/500ML",
                    "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                    "brand": "sprite",
                    "volume": 2
                },
                {
                    "sku": "CCPPID16",
                    "keywords": "",
                    "name": "Coke zero",
                    "description": "7.5 fl oz, 10 pack",
                    "price": "14.95",
                    "itemspercase": 12,
                    "costprice": "16.95",
                    "icon": "/coke/assets/images/svg/coke_zero_xl.svg",
                    "quantity_available": true,
                    "discount": "",
                    "discount_detail": "5 case offer on 1L/500ML",
                    "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                    "brand": "coke",
                    "volume": 1
                }
            ]
        }
    ],
    "checkout": {
        "discounts": [
            {
                "brand": "KINLEY",
                "name": "KINLEY20",
                "offer": "Congrats! you got 2 bottles free on this order",
                "info": "Get 20% off up to $10",
                "discount": "8",
                "description": "On orders above $46.95.",
                "details": {
                    "title": "Terms & conditions Apply",
                    "tnc": [
                        "Valid on Monday & Tuesday",
                        "Applicable only once per user per week",
                        "Valid only on ICICI debit & credit card"
                    ]
                }
            },
            {
                "brand": "COKE",
                "name": "COCACOLA20",
                "offer": "Congrats! you got 2 bottles free on this order",
                "info": "Get 20% off up to $10",
                "discount": "18",
                "description": "On orders above $46.95.",
                "details": {
                    "title": "Terms & conditions Apply",
                    "tnc": [
                        "Valid on Monday & Tuesday",
                        "Applicable only once per user per week",
                        "Valid only on ICICI debit & credit card"
                    ]
                }
            },
            {
                "brand": "DIET",
                "name": "DIET COLA",
                "offer": "Congrats! you got 2 bottles free on this order",
                "info": "Get 20% off up to $10",
                "discount": "80",
                "description": "On orders above $46.95.",
                "details": {
                    "title": "Terms & conditions Apply",
                    "tnc": [
                        "Valid on Monday & Tuesday",
                        "Applicable only once per user per week",
                        "Valid only on ICICI debit & credit card"
                    ]
                }
            }
        ],
        "distributor_details": {
            "name": "Ionic pvt ltd.",
            "address": "Mckayla McClure DDS,",
            "phone": "467-512-7188"
        },
        "delivery_details": {
            "address": "Mckayla McClure DDS, 1555 Alberta Unions, Ferrychester Louisiana",
            "phone": "05112 467-512-7188",
            "email": "conor56@ferry.net"
        },
    },
    "recent_order": {
        "title": "Order History",
        "products": [
            {
                "sku": "CCPPID17",
                "keywords": "",
                "name": "Kinley 5 case offer",
                "description": "7.5 fl oz, 10 pack",
                "price": "14.95",
                "itemspercase": 12,
                "costprice": "16.95",
                "icon": "/assets/images/png/product.png",
                "quantity_available": false,
                "discount": "",
                "discount_detail": "5 case offer on 1L/500ML",
                "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                "order_date" : "Dec 14, 2021",
                "order_amount" : "149.50",
                "products": {
                    "CCPPID17": {
                        "product_data" : {
                            "sku": "CCPPID17",
                            "keywords": "",
                            "name": "Kinley 5 case offer",
                            "description": "7.5 fl oz, 10 pack",
                            "price": "14.95",
                            "itemspercase": 12,
                            "costprice": "16.95",
                            "icon": "/assets/images/png/product.png",
                            "quantity_available": false,
                            "discount": "",
                            "discount_detail": "5 case offer on 1L/500ML",
                            "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                            "order_date" : "Dec 14, 2021",
                            "order_amount" : "149.50",
                        },
                        "quantity": 5
                    },
                    "CCPPID18": {
                        "product_data" : {
                            "sku": "CCPPID18",
                            "keywords": "",
                            "name": "Kinley 5 case offer",
                            "description": "7.5 fl oz, 10 pack",
                            "price": "14.95",
                            "itemspercase": 12,
                            "costprice": "16.95",
                            "icon": "/assets/images/png/product.png",
                            "quantity_available": false,
                            "discount": "",
                            "discount_detail": "5 case offer on 1L/500ML",
                            "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                            "order_date" : "Dec 14, 2021",
                            "order_amount" : "149.50",
                        },
                        "quantity": 15
                    }
                }
            },
            {
                "sku": "CCPPID18",
                "keywords": "",
                "name": "Kinley 5 case offer",
                "description": "7.5 fl oz, 10 pack",
                "price": "14.95",
                "itemspercase": 12,
                "costprice": "16.95",
                "icon": "/assets/images/png/product.png",
                "quantity_available": false,
                "discount": "",
                "discount_detail": "5 case offer on 1L/500ML",
                "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                "order_date" : "Dec 14, 2021",
                "order_amount" : "149.50",
                "products": {
                    "CCPPID18": {
                        "product_data" : {
                            "sku": "CCPPID18",
                            "keywords": "",
                            "name": "Kinley 5 case offer",
                            "description": "7.5 fl oz, 10 pack",
                            "price": "14.95",
                            "itemspercase": 12,
                            "costprice": "16.95",
                            "icon": "/assets/images/png/product.png",
                            "quantity_available": false,
                            "discount": "",
                            "discount_detail": "5 case offer on 1L/500ML",
                            "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                            "order_date" : "Dec 14, 2021",
                            "order_amount" : "149.50",
                        },
                        "quantity": 5
                    },
                    "CCPPID19": {
                        "product_data" : {
                            "sku": "CCPPID19",
                            "keywords": "",
                            "name": "Kinley 5 case offer",
                            "description": "7.5 fl oz, 10 pack",
                            "price": "14.95",
                            "itemspercase": 12,
                            "costprice": "16.95",
                            "icon": "/assets/images/png/product.png",
                            "quantity_available": false,
                            "discount": "",
                            "discount_detail": "5 case offer on 1L/500ML",
                            "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
                            "order_date" : "Dec 14, 2021",
                            "order_amount" : "149.50",
                        },
                        "quantity": 10
                    }
                }
            }
        ]
    },
    "favourites": {
        "title": "",
        "items": [
            {
                "sku": "CCPPID21",
                "keywords": "",
                "name": "Kinley 5 case offer",
                "description": "7.5 fl oz, 10 pack",
                "price": "14.95",
                "itemspercase": 12,
                "costprice": "16.95",
                "icon": "/coke/assets/images/svg/startlight_org_fv.svg",
                "quantity_available": false,
                "discount": "",
                "discount_detail": "5 case offer on 1L/500ML",
                "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
            },
            {
                "sku": "CCPPID22",
                "keywords": "",
                "name": "Kinley 5 case offer",
                "description": "7.5 fl oz, 10 pack",
                "price": "14.95",
                "itemspercase": 12,
                "costprice": "16.95",
                "icon": "/coke/assets/images/svg/startlight_fv.svg",
                "quantity_available": true,
                "discount": "",
                "discount_detail": "5 case offer on 1L/500ML",
                "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
            },
            {
                "sku": "CCPPID23",
                "keywords": "",
                "name": "Kinley 5 case offer",
                "description": "7.5 fl oz, 10 pack",
                "price": "14.95",
                "itemspercase": 12,
                "costprice": "16.95",
                "icon": "/coke/assets/images/svg/sprite_fv.svg",
                "quantity_available": true,
                "discount": "",
                "discount_detail": "5 case offer on 1L/500ML",
                "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
            },
            {
                "sku": "CCPPID24",
                "keywords": "",
                "name": "Kinley 5 case offer",
                "description": "7.5 fl oz, 10 pack",
                "price": "14.95",
                "itemspercase": 12,
                "costprice": "16.95",
                "icon": "/coke/assets/images/svg/startlight_7oz.fv.svg",
                "quantity_available": true,
                "discount": "",
                "discount_detail": "5 case offer on 1L/500ML",
                "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
            }
        ]
    }
}; */

var getAllProducts = [
    {
        "sku": "CCPPID1",
        "keywords": "Kinley case offer; 5 case offer; Kinley 5 case",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/png/product.png",
        "quantity_available": false,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID2",
        "keywords": "Coke case offer; 5 coke offer; coke 5 case",
        "name": "Coke 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/png/product.png",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID3",
        "keywords": "sprite case offer; 5 case offer; sprite 5 case",
        "name": "Sprite 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/png/product.png",
        "quantity_available": false,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID4",
        "keywords": "Diet coke offer; 10 case offer; ",
        "name": "Black Diet 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/png/product.png",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID5",
        "keywords": "",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/svg/coke_xl.svg",
        "quantity_available": false,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID6",
        "keywords": "",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/svg/sprite_xl.svg",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID7",
        "keywords": "",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/svg/fanta_xl.svg",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID8",
        "keywords": "zero",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/svg/coke_zero_xl.svg",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID9",
        "keywords": "",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/svg/fanta_xl.svg",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID10",
        "keywords": "",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/svg/coke_xl.svg",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID11",
        "keywords": "",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/svg/sprite_xl.svg",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID12",
        "keywords": "",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/svg/coke_zero_xl.svg",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID13",
        "keywords": "",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/svg/sprite_xl.svg",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID14",
        "keywords": "",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/svg/coke_xl.svg",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID15",
        "keywords": "",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/svg/fanta_xl.svg",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    },
    {
        "sku": "CCPPID16",
        "keywords": "",
        "name": "Kinley 5 case offer",
        "description": "7.5 fl oz, 10 pack",
        "price": "14.95",
        "itemspercase": 12,
        "costprice": "16.95",
        "icon": "/coke/assets/images/svg/coke_zero_xl.svg",
        "quantity_available": true,
        "discount": "",
        "discount_detail": "5 case offer on 1L/500ML",
        "discount_description": "Kinley 5 case sit amet, consectetur amet consectetur",
    }
];
