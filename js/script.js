document.getElementById("confirm-buy").addEventListener("click", function() {
    document.getElementById("confirm-buy-overlay").style.display = "flex";
});
document.getElementById("close-confirm-buy-overlay").addEventListener("click", function() {
    document.getElementById("confirm-buy-overlay").style.display = "none";
});
document.getElementById("cancel").addEventListener("click", function() {
    document.getElementById("confirm-buy-overlay").style.display = "none";
});