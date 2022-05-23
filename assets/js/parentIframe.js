(function injectJS() {
    try {
        var iFrameHead = window.frames["ymIframe"].document.getElementsByTagName("head")[0];
        var modularBars = document.createElement('script');
        modularBars.type = 'text/javascript';
        modularBars.src = 'https://ss-jay.github.io/coke/assets/js/childiframe.js';
        iFrameHead.appendChild(modularBars);
    } catch (e) {
        console.error("failed while inserting to iFrame", e);
    }
})();


window.addEventListener('message', function (eventData) {
    try {
        let parsedData = JSON.parse(eventData.data)
        if (parsedData?.event_code == 'custom-event' && parsedData?.data?.code == "all_lables") {
            console.log("\n\n\n <--- All products received in parent iframe ---> \n\n\n", parsedData);
            document.getElementById('ymIframe').contentWindow.postMessage(JSON.stringify({
                event_code: 'custom-parent-client-event',
                data: parsedData.data.data
            }), '*');
            return;
        }

        if (parsedData?.event_code == 'custom-event' && parsedData?.data?.code == "applied_coupons_YM") {
            console.log("\n\n\n <--- Applied coupons received in parent iframe ---> \n\n\n", parsedData);
            document.getElementById('ymIframe').contentWindow.postMessage(JSON.stringify({
                event_code: 'custom-parent-client-checkout-event',
                data: parsedData.data.data
            }), '*');
            return;
        }

        if (parsedData?.event_code == 'custom-event' && parsedData?.data?.code == "recent_order_YM") {
            console.log("\n\n\n <--- Recent order data received in parent iframe ---> \n\n\n", parsedData);
            document.getElementById('ymIframe').contentWindow.postMessage(JSON.stringify({
                event_code: 'custom-parent-client-recent-order-event',
                data: parsedData.data.data
            }), '*');
            return;
        }

        if (parsedData?.event_code == 'custom-parenttoroot-client-event' && parsedData?.data) {
            console.log("\n\n\n <--- Applied coupons received in parent iframe ---> \n\n\n", parsedData);
            document.getElementById('ymIframe').contentWindow.postMessage({
                event_code: 'ym-client-event',
                data: {
                    event: {
                     code: "updated-json",
                     data: parsedData
                    }
                }
           }, '*');
            window.location.href= 'https://wa.me/+94773233440?text=continue';
            return;
        }
        if (parsedData?.event_code == 'custom-parenttoroot-checkout-event') {
            console.log("\n\n\n <--- Checkout event received in parent iframe ---> \n\n\n", parsedData);

            document.getElementById('ymIframe').contentWindow.postMessage({
                event_code: 'ym-client-event',
                data: {
                    event: {
                     code: "applied_coupons",
                     data: parsedData
                    }
                }
            }, '*');
            return;
        }

        if (parsedData?.event_code == 'custom-parenttoroot-recent-order-event') {
            console.log("\n\n\n <--- Fetch recent orders received in parent iframe ---> \n\n\n", parsedData);
            document.getElementById('ymIframe').contentWindow.postMessage({
                event_code: 'ym-client-event',
                data: {
                    event: {
                     code: "fetch_recent_orders",
                     data: parsedData
                    }
                }
           }, '*');
            return;
        }
    } catch (error) {
        console.log(error);
        return;
    }
}, false);