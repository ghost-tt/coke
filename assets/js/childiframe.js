// parent.postMessage(JSON.stringify({ message: 'Hello from iframe', date: Date.now()}), "*");


// parent.addEventListener('message', function (e) {
//     console.log("test 2 file called --> ", e)
//     console.log("testing 2 ashish case 2 ", e.data);
//     console.log(window.frames);
// });



window.addEventListener('message', function (eventData) {
    console.log("local test 2 file called --> ", eventData.data);
    let parsedEventData = JSON.parse(eventData.data);
    console.log("local testing 2 ashish case 2 ", parsedEventData.data);
    
    if(parsedEventData.event_code === "custom-parent-client-event" && parsedEventData.data) {
        console.log("innner iframe called with parsed Data ---> ", parsedEventData.data);
        document.querySelector("iframe").contentWindow.postMessage(JSON.stringify({
            event_code: 'custom-child-client-event',
            data: parsedEventData.data
        }), '*');
    }

    if(parsedEventData.event_code === "custom-childtoparent-client-event" && parsedEventData.data) {
        console.log("innner iframe called with parsed Data ---> ", parsedEventData.data);
        parent.postMessage(JSON.stringify({
            event_code: 'custom-parenttoroot-client-event',
            data: parsedEventData.data
        }), '*');
    }
});