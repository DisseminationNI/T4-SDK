t4Sdk.html2pdf = t4Sdk.html2pdf || {};

t4Sdk.html2pdf.disableHrefs = function (e) {

    var ch = t4Sdk.html2pdf.downloadSelectionUL;
    if (ch) {
        ch.classList.add("moduleBody");
        ch.style.backgroundColor = "white";
        ch.style.listStyleType = "none";
        ch.style.lineHeight = "180%";
        for (var i = 0; i < ch.children.length; i++) {
            var cbox = ch.children[i];
            cbox.children[1].style.display = "none";
            var sp = document.createElement("span");
            sp.style.margin = "8px";
            sp.innerHTML = cbox.children[1].innerHTML;
            cbox.appendChild(sp);
        }
        t4Sdk.html2pdf.downloadSelectionUL.children[t4Sdk.html2pdf.downloadSelectionUL.children.length - 1].style.display = "none";
        t4Sdk.html2pdf.downloadSelectionParentDIV = t4Sdk.html2pdf.downloadSelectionUL.parentElement;

        t4Sdk.html2pdf.btnReverse = document.createElement("a");
        t4Sdk.html2pdf.btnReverse.style.display = "block";
        t4Sdk.html2pdf.btnReverse.setAttribute("href", "");
        t4Sdk.html2pdf.downloadPDF = document.createElement("button");
        t4Sdk.html2pdf.btnReverse.innerHTML = "Select all";
        t4Sdk.html2pdf.downloadPDF.className = "btn";
        t4Sdk.html2pdf.downloadPDF.style.border = "none";
        t4Sdk.html2pdf.downloadPDF.innerHTML = "Download PDF";
        t4Sdk.html2pdf.downloadPDF.style.cursor = "pointer";
        ch.parentElement.appendChild(t4Sdk.html2pdf.btnReverse);

        t4Sdk.html2pdf.btnReverse.style.marginLeft = "10px";

        t4Sdk.html2pdf.downloadSelectionParentDIV.appendChild(t4Sdk.html2pdf.downloadPDF);

        t4Sdk.html2pdf.btnReverse.addEventListener("click", t4Sdk.html2pdf.fnT4Reverse);
        t4Sdk.html2pdf.downloadPDF.addEventListener("click", t4Sdk.html2pdf.fnT4Download);

    }

    //   t4Sdk.html2pdf.fnExportPDF(inp);
    //JSON.stringify(inp)
    // alert();
}

t4Sdk.html2pdf.dataURItoBlob = function (dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'application/pdf' });
    return blob;
}
t4Sdk.html2pdf.callApiRead = function (input, callback = t4Sdk.html2pdf.callApiReadCallback, server = "https://pdf.cso.ie/api.jsonrpc") {
    var xObj = new XMLHttpRequest();
    xObj.overrideMimeType("application/json");
    xObj.open('POST', server, true);
    xObj.onreadystatechange = function () {
        if (xObj.readyState === 4 && xObj.status === 200) {
            t4Sdk.html2pdf.downloadPDF.style.backgroundColor = "#006168";
            t4Sdk.html2pdf.downloadPDF.disabled = false;
            t4Sdk.html2pdf.downloadPDF.style.cursor = "pointer";
            t4Sdk.html2pdf.processing = false;
            t4Sdk.html2pdf.downloadPDF.innerHTML = "Download PDF";
            const downloadLink = window.document.createElement('a');
            var res = JSON.parse(this.response)
            if (res["error"]) {
                alert(this.response);
                return
            }
            var data = res["result"];
            const blob = t4Sdk.html2pdf.dataURItoBlob(data.substring(28, data.length - 28));
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        }
    };
    xObj.send(
        JSON.stringify(input));
}
t4Sdk.html2pdf.fnExportPDF = function (inp) {
    var toSend = {
        "urls": inp,
        "chromeCommandLineOptions": [
            "headless",
            "disable-gpu",
            "run-all-compositor-stages-before-draw"
        ],
        "printOptions": {
            "paperWidth": 8.3,
            "paperHeight": 11.7,
            "scale": 1.0,
            "pageRanges": ""
        },
        "returnType": "base64String"
    };
    var url = "https://pdf.cso.ie/api.jsonrpc";
    var inp2 = { "jsonrpc": "2.0", "method": "PDFapi.Data.Convert_API.Create", "params": toSend };
    t4Sdk.html2pdf.callApiRead(inp2, t4Sdk.html2pdf.callApiReadCallback, url);
}

window.addEventListener("load", t4Sdk.html2pdf.disableHrefs());