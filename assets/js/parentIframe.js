(function injectJS() {
    try {
        var iFrameHead = window.frames["ymIframe"].document.getElementsByTagName("head")[0];
        // console.log("iFrameHead -- > ", iFrameHead);
        var modularBars = document.createElement('script');
        modularBars.type = 'text/javascript';
        modularBars.src = 'https://ss-jay.github.io/coke/assets/js/childiframe.js';
        iFrameHead.appendChild(modularBars);
    } catch (e) {
        console.error("failed while inserting to iFrame", e);
    }
})();


window.addEventListener('message', function (eventData) {
    console.log("test js file called");
    try {
        console.table('Data----------------->>>', eventData.data);
        let parsedData = JSON.parse(eventData.data)
        if (parsedData?.event_code == 'custom-event' && parsedData?.data?.code == "all_lables") {
            console.log("document.getElementById('ymIframe') --> ", parsedData);
            document.getElementById('ymIframe').contentWindow.postMessage(JSON.stringify({
                event_code: 'custom-parent-client-event',
                data: parsedData.data.data
            }), '*');
            return;
        }

        if (parsedData?.event_code == 'custom-event' && parsedData?.data?.code == "applied_coupons_YM") {
            console.log(" applied coupons data in parentIframe.js --> ", parsedData);
            document.getElementById('ymIframe').contentWindow.postMessage(JSON.stringify({
                event_code: 'custom-parent-client-checkout-event',
                data: parsedData.data.data
            }), '*');
            return;
        }

        if (parsedData?.event_code == 'custom-event' && parsedData?.data?.code == "recent_order_YM") {
            console.log(" Recent order  data in parentIframe.js --> ", parsedData);
            document.getElementById('ymIframe').contentWindow.postMessage(JSON.stringify({
                event_code: 'custom-parent-client-recent-order-event',
                data: parsedData.data.data
            }), '*');
            return;
        }

        if (parsedData?.event_code == 'custom-parenttoroot-client-event' && parsedData?.data) {
            console.log("------- --- --- --- ------> ", parsedData);
            document.getElementById('ymIframe').contentWindow.postMessage({
                event_code: 'ym-client-event',
                data: {
                    event: {
                     code: "updated-json",
                     data: parsedData
                    }
                }
           }, '*');
            console.log("12", window.location);
            window.location.href= 'https://wa.me/+94773233440?text=continue';
                        console.log("34");
            return;
        }
        if (parsedData?.event_code == 'custom-parenttoroot-checkout-event') {
            console.log("Checkout data ------- --- --- --- ------> ", parsedData);
            setTimeout(() => {
                document.getElementById('ymIframe').contentWindow.postMessage({
                    event_code: 'ym-client-event',
                    data: {
                        event: {
                         code: "applied_coupons",
                         data: parsedData
                        }
                    }
               }, '*');
            }, 5000);

            //     document.getElementById('ymIframe').contentWindow.postMessage({
            //         event_code: 'ym-client-event',
            //         data: {
            //             event: {
            //              code: "applied_coupons",
            //              data: parsedData
            //             }
            //         }
            //    }, '*');
            return;
        }

        if (parsedData?.event_code == 'custom-parenttoroot-recent-order-event') {
            console.log("Recent order data ------- --- --- --- ------> ", parsedData);
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