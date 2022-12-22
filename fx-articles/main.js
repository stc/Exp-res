fetch('https://api.fxhash.xyz/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
        query: `{
            articles(filters: { searchQuery_eq: "resilientnetworks" }) {
                title 
                slug
                thumbnailUri
            }
        }`
    })
}).then(r => r.json()).then(data => initArticles(data));

function initArticles(data) {
    let aData = data.data.articles
    let prefix = `https://www.fxhash.xyz/article/`
    
    for (let a of aData) {
        const p = document.createElement("p")
        const el = document.createElement("a")
        const linktext = document.createTextNode(a.title)
        el.appendChild(linktext)
        el.title = a.title
        el.href = prefix + a.slug
        const element = document.getElementById("layout")
        p.appendChild(el)
        const img = document.createElement("img");
        const imgUri = "https://ipfs.io/ipfs/" + a.thumbnailUri.split("//")[1]
        img.src = imgUri;
        element.appendChild(img);
        element.appendChild(p)
    }
}

