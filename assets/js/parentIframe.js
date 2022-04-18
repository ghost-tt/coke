(function injectJS() {
    try {
        var iFrameHead = window.frames["ymIframe"].document.getElementsByTagName("head")[0];
        console.log("iFrameHead -- > ", iFrameHead);
        var modularBars = document.createElement('script');
        modularBars.type = 'text/javascript';
        modularBars.src = 'https://aporve.github.io/coke/assets/js/childiframe.js';
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
            console.log("document.getElementById('ymIframe') --> ", document.getElementById('ymIframe'));
            document.getElementById('ymIframe').contentWindow.postMessage(JSON.stringify({
                event_code: 'custom-parent-client-event',
                data: parsedData.data.data
            }), '*');
            return;
        }

        if (parsedData?.event_code == 'custom-parenttoroot-client-event' && parsedData?.data) {
            console.log("------- --- --- --- ------> ", parsedData);
            return;
        }
    } catch (error) {
        console.log(error);
        return;
    }
}, false);
