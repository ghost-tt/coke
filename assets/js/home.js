$(function () {
    $("#bodyContent").load("/views/body.html");
    $("#checkoutcart").load("/views/checkout.html");
});

function renderPage(page, sectionToScroll) {
    if (page === "homepage") {
        document.getElementById(`${page}`).style.display = "block";
        document.getElementById(`checkoutpage`).style.display = "none";
        $(window).scrollTop(0);
    }

    if (page === "checkoutpage") {
        $(window).scrollTop(0);
        if (sectionToScroll === "order_summary") {
            setTimeout(() => {
                $('html,body').animate({ scrollTop: $("#order_summary").offset().top }, 1000);
            }, 100);
        } else {
            $(window).scrollTop(0);
        }
        document.getElementById(`${page}`).style.display = "block";
        document.getElementById(`homepage`).style.display = "none";
    }

}

var cartData = {};
