window.addEventListener('message', function (eventData) {
    let parsedEventData = JSON.parse(eventData.data);
    if(parsedEventData.event_code === "custom-parent-client-event" && parsedEventData.data) {
        document.querySelector("iframe").contentWindow.postMessage(JSON.stringify({
            event_code: 'custom-child-client-event',
            data: parsedEventData.data
        }), '*');
    }

    if(parsedEventData.event_code === "custom-childtoparent-client-event" && parsedEventData.data) {
        parent.postMessage(JSON.stringify({
            event_code: 'custom-parenttoroot-client-event',
            data: parsedEventData.data
        }), '*');
    }

    if(parsedEventData.event_code === "custom-checkout-event") {
        parent.postMessage(JSON.stringify({
            event_code: 'custom-parenttoroot-checkout-event',
            data: parsedEventData.data
        }), '*');
    }

    if(parsedEventData.event_code === "custom-parent-client-checkout-event") {
        document.querySelector("iframe").contentWindow.postMessage(JSON.stringify({
            event_code: 'custom-parentchild-client-checkout-event',
            data: parsedEventData.data
        }), '*');
    }
});