function aalert(text) {


    var bd = document.createElement('div');
    var style = "position: fixed; top:0; left:0;background-color:rgba(0, 0, 0, 0.4);width:100%; height:100%;";
    bd.style = style;
    bd.addEventListener('click', function (event) {
        this.parentElement.removeChild(this);
    })
    
    
    var d = document.createElement('div');
    d.innerHTML = text;
    d.style = "background-color: white;margin:0;"
        + "padding: 10px;box-shadow: 10px 10px; width:40%;padding:20px;"
        + "border: 1px double #cccccc;user-select:none;margin: 0 auto;"
        + "transition: margin-top 0.2s; "
    
    
    
    d.addEventListener('click', function (e) {
        e.stopPropagation();
    });
    
    bd.appendChild(d);

    
    document.body.appendChild(bd);

    setTimeout(() => {
        d.style["margin-top"] = "10%";
    }, 1);
}


