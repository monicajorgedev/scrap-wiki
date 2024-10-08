//mi ejercicio

const axios = require("axios")
const cheerio = require("cheerio")
const express = require("express")
const app = express()

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'
const urlbase = "https://es.wikipedia.org"
const links = []

const obtainInfoFromUrl = (link, res) => {
    axios.get(urlbase + link).then((response)=> {
        if(response.status === 200) {
            const html = response.data
            const $ = cheerio.load(html)
            const titulo = $("h1").text();
            const imagenes = []
            $('img').each((index,element) => {
                const img = $(element).attr("src")
                imagenes.push(img)
            })
            const parrafos = []
            $('p').each((index,element) => {
                const p = $(element).text()
                parrafos.push(p)
            })
            res.json({titulo, imagenes, parrafos})
        }
    });
}

app.get("/", (req,res) => {
    axios.get(url).then((response)=> {
        if(response.status === 200) {
            const html = response.data
            const $ = cheerio.load(html)
        
            $('#mw-pages a').each((index,element) => {
                const link = $(element).attr("href")
                links.push(link)
            })
            //create
            links.forEach(link => app.get(`${link}`, (req, res) => {
                obtainInfoFromUrl(link, res)
                
            }))
            res.send(`
                <h1>Enlaces</h1>
                <ul>
                    ${links.map(link => `<li><a href="http://localhost:3000${link}" target="_blank">${link}</a></li>`).join("")}
                </ul>
                `)
            
        }
    })
})


app.listen(3000, () => {
    console.log("Express está escuchando en el puerto 3000")
})