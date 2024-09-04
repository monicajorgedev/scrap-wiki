// EJERCICIO DE CLASE CON ASINCRONIAS

const express = require("express")
const app = express()
const fs = require('node:fs/promises')

const axios = require("axios")
const cheerio = require("cheerio")

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)

    const links = []
    $("#mw-pages a").each((i, elemento) => {
      const link = $(elemento).attr('href')
      links.push(link)
    })
    // console.log(links)
    const data = []
    for (const link of links) {
      const linkData = await scrapingLinks(link)
      data.push(linkData)
      console.log(linkData)
    }
    await fs.writeFile('output.json', JSON.stringify(data, null, 2)) 
    res.send("el archivo se ha generado correctamente!")

  } catch (error) {
    console.error(`el error es el ${error}`)
    res.status(500).send(`Error interno ${error}`)
  }
})


//Leer el archivo generado por FS
// async function leerArchivo() {
//   try {
//     const data = await fs.readFile('output.json', 'utf-8')
//     const objeto = JSON.parse(data)

//     console.log(objeto)
//   } catch (err) {
//     console.log(`Este es el error: ${err}`)
//   }
// }

// leerArchivo()


async function scrapingLinks(link) {
  try {
    const response = await axios.get(`https://es.wikipedia.org${link}`)
    const html = response.data
    const $ = cheerio.load(html)

    const h1 = $("h1").text()
    const images = []
    $("img").each((i, elemento) => {
      const src = $(elemento).attr("src")
      images.push(src)
    })
    const texts = []
    $("p").each((i, elemento) => {
      const text = $(elemento).text()
      const imgSrc = $(elemento).find("img").attr("src")
      texts.push({text, img: imgSrc} )
    })
    
    return {h1, images, texts}

  } catch (error) {
    console.error(`el error es el ${error}`)
    res.status(500).send(`Error interno ${error}`)
  }
}

const PORT = 3000
app.listen(PORT, () => console.log(`Está escuchando en el puerto http://localhost:${PORT}`))