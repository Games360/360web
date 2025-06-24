function loophalaman(a) {
    let e = "";
    let nomerkiri = parseInt(numshowpage / 2);
    
    if (nomerkiri === numshowpage - nomerkiri) {
        numshowpage = 2 * nomerkiri + 1;
    }
    
    let mulai = nomerhal - nomerkiri;
    if (mulai < 1) {
        mulai = 1;
    }
    
    let maksimal = Math.ceil(a / postperpage);
    if (maksimal - 1 === a / postperpage) {
        maksimal -= 1;
    }
    
    let akhir = mulai + numshowpage - 1;
    if (akhir > maksimal) {
        akhir = maksimal;
    }
    
    e += `<span class='showpageOf'>Page ${nomerhal} of ${maksimal}</span>`;
    
    let s = parseInt(nomerhal) - 1;
    if (nomerhal > 1) {
        e += (numshowpage === 2) 
            ? (jenis === "page" 
                ? `<span class="showpage"><a href="${home_page}">${upPageWord}</a></span>` 
                : `<span class="showpageNum"><a href="/search/label/${lblname1}?&max-results=${postperpage}">${upPageWord}</a></span>`) 
            : (jenis === "page" 
                ? `<span class="showpageNum"><a href="#" onclick="redirectpage(${s}); return false;">${upPageWord}</a></span>` 
                : `<span class="showpageNum"><a href="#" onclick="redirectlabel(${s}); return false;">${upPageWord}</a></span>`);
    }
    
    if (mulai > 1) {
        e += (jenis === "page") 
            ? `<span class="showpageNum"><a href="${home_page}">1</a></span>` 
            : `<span class="showpageNum"><a href="/search/label/${lblname1}?&max-results=${postperpage}">1</a></span>`;
    }
    
    if (mulai > 2) {
        e += ""; // Aquí puedes agregar más lógica si es necesario
    }
    
    for (let r = mulai; r <= akhir; r++) {
        e += (nomerhal === r) 
            ? `<span class="showpagePoint">${r}</span>` 
            : (r === 1 
                ? (jenis === "page" 
                    ? `<span class="showpageNum"><a href="${home_page}">1</a></span>` 
                    : `<span class="showpageNum"><a href="/search/label/${lblname1}?&max-results=${postperpage}">1</a></span>`) 
                : (jenis === "page" 
                    ? `<span class="showpageNum"><a href="#" onclick="redirectpage(${r}); return false;">${r}</a></span>` 
                    : `<span class="showpageNum"><a href="#" onclick="redirectlabel(${r}); return false;">${r}</a></span>`));
    }
    
    if (akhir < maksimal - 1) {
        e += ""; // Aquí puedes agregar más lógica si es necesario
    }
    
    if (akhir < maksimal) {
        e += (jenis === "page") 
            ? `<span class="showpageNum"><a href="#" onclick="redirectpage(${maksimal}); return false;">${maksimal}</a></span>` 
            : `<span class="showpageNum"><a href="#" onclick="redirectlabel(${maksimal}); return false;">${maksimal}</a></span>`;
    }
    
    let n = parseInt(nomerhal) + 1;
    if (nomerhal < maksimal) {
        e += (jenis === "page") 
            ? `<span class="showpageNum"><a href="#" onclick="redirectpage(${n}); return false;">${downPageWord}</a></span>` 
            : `<span class="showpageNum"><a href="#" onclick="redirectlabel(${n}); return false;">${downPageWord}</a></span>`;
    }
    
    const t = document.getElementsByName("pageArea");
    const l = document.getElementById("blog-pager");
    
    for (let p = 0; p < t.length; p++) {
        t[p].innerHTML = e;
    }
    
    if (t && t.length > 0) {
        e = "";
    }
    
    if (l) {
        l.innerHTML = e;
    }
}

function hitungtotaldata(a) {
    const e = a.feed;
    const s = parseInt(e.openSearch$totalResults.$t, 10);
    loophalaman(s);
}

function halamanblogger() {
    const a = urlactivepage;
    
    if (a.indexOf("/search/label/") !== -1) {
        lblname1 = a.indexOf("?updated-max") !== -1 
            ? a.substring(a.indexOf("/search/label/") + 14, a.indexOf("?updated-max")) 
            : a.substring(a.indexOf("/search/label/") + 14, a.indexOf("?&max"));
    }
    
    if (a.indexOf("?q=") === -1 && a.indexOf(".html") === -1) {
        if (a.indexOf("/search/label/") === -1) {
            jenis = "page";
            nomerhal = a.indexOf("#PageNo=") !== -1 
                ? a.substring(a.indexOf("#PageNo=") + 8) 
                : 1;
            const script = document.createElement('script');
            script.src = `${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=hitungtotaldata`;
            document.head.appendChild(script);
        } else {
            jenis = "label";
            if (a.indexOf("&max-results=") === -1) {
                postperpage = 20;
            }
            nomerhal = a.indexOf("#PageNo=") !== -1 
                ? a.substring(a.indexOf("#PageNo=") + 8) 
                : 1;
            const script = document.createElement('script');
            script.src = `${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=hitungtotaldata&max-results=1`;
            document.head.appendChild(script);
        }
    }
}

function redirectpage(a) {
    jsonstart = (a - 1) * postperpage;
    nopage = a;
    const script = document.createElement('script');
    script.src = `${home_page}feeds/posts/summary?start-index=${jsonstart}&max-results=1&alt=json-in-script&callback=finddatepost`;
    document.head.appendChild(script);
}

function redirectlabel(a) {
    jsonstart = (a - 1) * postperpage;
    nopage = a;
    const script = document.createElement('script');
    script.src = `${home_page}feeds/posts/summary/-/${lblname1}?start-index=${jsonstart}&max-results=1&alt=json-in-script&callback=finddatepost`;
    document.head.appendChild(script);
}

function finddatepost(a) {
    const post = a.feed.entry[0];
    const e = post.published.$t.substring(0, 19) + post.published.$t.substring(23, 29);
    const s = encodeURIComponent(e);
    
    const r = (jenis === "page") 
        ? `/search?updated-max=${s}&max-results=${postperpage}#PageNo=${nopage}` 
        : `/search/label/${lblname1}?updated-max=${s}&max-results=${postperpage}#PageNo=${nopage}`;
    
    location.href = r;
}

// Inicialización
let nopage, jenis, nomerhal, lblname1;
halamanblogger();
