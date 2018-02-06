
var inputEl = document.getElementById("a-input");
var outputEl = document.getElementById("a-output");
var tocEl = document.getElementById("a-toc");
var toolbarEl = document.getElementById("f-toolbar");

var headingChar = "\\";
var italicChar = "/";
var boldChar = "=";
var codeChar = "`";

function writeOutput(html, tochtml) {
    if (document.getElementById("f-btn-view-source").className == "") {
        outputEl.innerHTML = html;
    }
    else {
        outputEl.innerText = html;
    }
    tocEl.innerHTML = tochtml;
}

function processLine(line) {
    var co = false;
    var bo = false;
    var io = false;
    var prev_char = '';
    var out = "";
    for (var i = 0; i < line.length; ++i) {
        var c = line.charAt(i);
        switch (c) {
            case italicChar:
                if (co) { out += c; }
                else if (line.charAt(i + 1) == italicChar) {
                    out += c;
                    ++i;
                }
                else {
                    if (io == false) out += '<i>';
                    else out += "</i>"
                    io = !io;
                }
                break;
            case boldChar:
                if (co) { out += c; }
                else if (bo == false) out += '<b>';
                else out += "</b>";
                bo = !bo;
                break;
            case codeChar:
                if (co == false) out += '<code>';
                else out += '</code>';
                co = !co;
                break;

            default:
                out += c;
                break;
        }
        prev_char = c;
    }
    return out;
}

function generateHtml() {
    outputEl.innerHTML = "";
    var flags = function () {
        this.ul = false;
        this.pre = false;
    };
    var fp = new flags();
    var fc = new flags();
    var outToc = "";
    var outHtml = "";
    var autoid = 0;

    var lines = inputEl.value.trim().split('\n');
    var pre = false;

    document.getElementById("f-title").innerText = lines[0];
    for (var i = 1; i < lines.length; ++i) {
        var l = lines[i];
        var c0 = l.charAt(0);
        var c1 = l.charAt(1);
        var out = "";
        fc.ul = false;

        var markup = 0;
        if (c0 == codeChar && c1 == codeChar) {

            if (pre == false) {
                out += "<pre>" + l.substring(2);
            }
            else {
                out += "</pre>";
            }
            pre = !pre;
        }
        else if (pre == false) {
            l = l.trim();
            if (l == "") continue;
            l = processLine(l);
            if (c0 == headingChar) {
                markup++;
                switch (c1) {

                    default: tag = "h1"; break;
                    case headingChar:
                        markup++;
                        tag = "h2";
                        if (l.charAt(2) == headingChar) {
                            markup++;
                            if (l.charAt(3) == headingChar) {
                                markup++;
                                tag = "h4";
                            } else {
                                tag = "h3";
                            }
                        }

                        break;
                }

                var substr = l.substring(markup);
                out += "<" + tag + " id='autoid-" + autoid + "'>" + substr + "</" + tag + ">";
                outToc += "<a href='#autoid-" + autoid++ + "'><" + tag + ">" + substr + "</" + tag + "></a>";

            }
            else if (c0 == '-') {
                switch (c1) {
                    case '-':
                        out = "<hr/>" + l.substring(2);
                        break;
                    default:
                        fc.ul = true; // opened
                        if (fp.ul == false) {
                            out += "<ul>";
                        }
                        out += "<li>" + l.substring(1) + "</li>";
                        break;
                }
            }

            else {

                out += "<p>" + l + "</p>";
            }

            if (fc.ul === false && fp.ul === true) {
                out = "</ul>" + out;
            }
        }
        else { out += l + "\n"; }
        outHtml += out;
        writeOutput(outHtml, outToc);
        fp.ul = fc.ul;
    }
}

window.onbeforeunload = function () {
    window.localStorage.setItem("fml-lastcode", inputEl.value);
}
window.onload = function () {
    var code = window.localStorage.getItem("fml-lastcode")
    if (code != null || code != "") {
        inputEl.value = code;
        generateHtml();
    }
}

function toggleView(el) {
    if (el.className == "") {
        var html = outputEl.innerHTML;
        outputEl.innerHTML = "";
        outputEl.innerText = html;
        el.className = "f-btn-on";
    }
    else {
        var text = outputEl.innerText;
        outputEl.innerText = "";
        outputEl.innerHTML = text;
        el.className = "";
    }
}

function toggleMode(el) {
  
    el.classList.toggle("f-btn-on");
    inputEl.classList.toggle("f-hidden");
    outputEl.classList.toggle("f-center");
    document.getElementById("f-toolbar-container").classList.toggle("f-center");
    document.getElementById("f-btn-view-source").classList.toggle("f-hidden");
    document.getElementById("f-btn-save").classList.toggle("f-hidden");
}

function toggleToc(el) {
    el.classList.toggle("f-btn-on");
    tocEl.classList.toggle("f-toc-collapse");
    document.getElementById("f-toolbar-container").classList.toggle("f-expand-100");
    inputEl.classList.toggle("f-expand-50");
    outputEl.classList.toggle("f-expand-50");
}

function copyHtml() {
    var textArea = document.createElement("textarea");
    textArea.value = tocEl.innerHTML + "<br/>" + outputEl.innerHTML;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    var success = document.execCommand("copy");
    if (success == true) aalert("copied!");
    document.body.removeChild(textArea);
}

function download() {
    var text = inputEl.value;
    var blob = new Blob([text], { type: "text/plain" });
    var anchor = document.createElement("a");
    var filename = "markup.txt";
    if (document.getElementById("f-title").innerText.trim().length != 0) {
        filename = document.getElementById("f-title").innerText
            .trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }
    anchor.download = filename;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = "_blank";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

function openFile() {
    var el = document.getElementById("f-file-input");
    el.click();
}

function loadFile(e){    
    var el = document.getElementById("f-file-input");
    var reader = new FileReader();         
    reader.onload = function(e) {
        inputEl.value = e.target.result;
        generateHtml();
    }
    reader.readAsText(el.files[0]);
    
}

function dragenter() {
    document.getElementById("a-input").style.backgroundColor = "gray";
}

function dragleave() {
    document.getElementById("a-input").style.backgroundColor = "lightyellow";
}

function drop(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("a-input").style.backgroundColor = "lightyellow";
    var extention = e.dataTransfer.files[0].name.split('.').pop().toLowerCase();
    if(extention != "txt" && extention != "f")
    {
        aalert("Only .txt or .f");
        return;
    }    
    var reader = new FileReader();
    reader.onload = function(e){
        inputEl.value = e.target.result;
        generateHtml();
    }
    reader.readAsText(e.dataTransfer.files[0]);
}