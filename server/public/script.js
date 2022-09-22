const button = document.querySelector('button')
button.addEventListener("click", () => {
    donationIndex = document.getElementById('donate').selectedIndex + 1;
    fetch('/donate-to-the-lads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            items: [
                { id: donationIndex, quantity: 1}
            ]
        })
    }).then(res => {
        if (res.ok) return res.json()
        return res.json().then(json => Promise.reject(json))
    }).then(({ url }) => {
        window.location = url;
    }).catch(e => {
        console.error(e.error)
    })
})