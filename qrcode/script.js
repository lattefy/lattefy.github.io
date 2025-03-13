document.getElementById("generate").addEventListener("click", function() {
    const url = document.getElementById("url").value;
    const color = document.getElementById("color").value;
    const bgColor = document.getElementById("bgColor").value;
    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = "";

    if (!url) {
        alert("Please enter a valid URL.");
        return;
    }

    new QRCode(qrContainer, {
        text: url,
        width: 256,
        height: 256,
        colorDark: color,
        colorLight: bgColor,
        correctLevel: QRCode.CorrectLevel.H
    });

    document.getElementById("download").style.display = "block";
});

document.getElementById("download").addEventListener("click", function() {
    const qrCanvas = document.querySelector("#qrcode canvas");
    if (!qrCanvas) return;
    
    const link = document.createElement("a");
    link.href = qrCanvas.toDataURL("image/png");
    link.download = "qrcode.png";
    link.click();
});
