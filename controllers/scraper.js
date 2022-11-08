
const BreweryModel = require ("../models/Brewery")
const mongoose = require ('mongoose')
const connectDB = require("../config/database");
require("dotenv").config({ path: "../config/.env" });
const puppeteer = require('puppeteer')


connectDB()

let breweries = []
const url = 'https://bccraftbeer.com/our-breweries/'
async function scrapeBreweries(url){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    breweries = await page.$$eval('ul.large-6 li a', (links)=>{
        return links.map(x => x.href)
    })
    console.log(breweries)
    await browser.close()
    
}

let brewArr = []
async function scrapeDetails(url){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    const brewName = await page.$$eval('article H1', (title)=>{
        return title.map(x=>x.textContent)
    })
    const brewBio = await page.$$eval('article .bio', (bio)=>{
        return bio.map(x=>x.textContent)
    })
    const brewDetails = await page.$$eval('.b-details li',(address)=>{
        return address.map(x=>x.textContent)
    })
    const brewLinks = await page.$$eval('.b-details li a',(website)=>{
        return website.map(x=> x.href)
    })
    const brewImg = await page.$$eval('img',(images)=>{
        return images.map(x=> x.src)
    })
    const brewProfile = await page.$$eval('.b-profile li',(website)=>{
        return website.map(x=> x.textContent)
    })
    const brewEmail = brewLinks.filter(x=> x.startsWith('mailto')).map(x=> x.split('%20')[1])
    const brewWebsite = brewLinks.filter(x=> !x.startsWith('mailto')) 
    const brewAddress = brewDetails.filter(x=> x.startsWith('LOCATION')).map(x=> x.split(": ")[1])
    const brewPhone = brewDetails.filter(x=> x.startsWith('PHONE'))
    const brewer = brewProfile.filter(x=> x.startsWith('Brewer'))
    const established = brewProfile.filter(x=> x.startsWith('Established'))
    // console.log(brewName,brewBio,brewEmail, brewWebsite, brewAddress,brewPhone, brewer, established)
    await browser.close()
    let brewLat = undefined
    let brewLon = undefined
    try{let coords = await getCoordinates(brewAddress[0],brewName)
    console.log(brewAddress, coords)
    brewLat = await coords[0].lat
    brewLon = await coords[0].lon
    }catch{
        console.log('GEOLOCATE ERROR')
    }

    

try{    
    let thisBrew = new Brewery(brewName,brewBio,brewImg,brewEmail, brewWebsite, brewAddress, brewCity, brewPhone, brewer, established,brewLat,brewLon)
    await BreweryModel.create(thisBrew)
    console.log(thisBrew.name + " added!")
}catch{
    console.log(thisBrew.name + " failed!")
}
}



class Brewery{
    constructor(brewName,brewBio,brewImg, brewEmail, brewWebsite, brewAddress,brewPhone, brewer, established,brewLat,brewLon){
        this.name = brewName[0],
        this.bio = brewBio[0],
        this.img = brewImg[0],
        this.email = brewEmail[0],
        this.website = brewWebsite[0],
        this.address = brewAddress[0],
        this.city = brewAddress[0].split(",")[1]
        this.phone = brewPhone[0],
        this.brewer = brewer[0],
        this.established = established[0],
        this.latitude = brewLat,
        this.longitude = brewLon
    }
}


async function scrape(){
    await scrapeBreweries('https://bccraftbeer.com/our-breweries/')
    for(let i = 0; i<breweries.length; i++){
    await scrapeDetails(breweries[i])
    console.log(brewArr[i])
}

    console.log(Array.from(brewArr))
    saveToMongo()
}

scrape()

async function getCoordinates(address = "British Columbia",name){
let fetchAddress = address.split("#").join('').split(' ').map(x=>x.trim()).join(' ')
let fetchURL = `https://us1.locationiq.com/v1/search.php?key=pk.0417799bcf835e7450de53ee367d9123&q=${name} ${fetchAddress}&format=json`
console.log(address,fetchURL)
try{
const response = await fetch(fetchURL)
const json = await response.json()
return json
}catch{
    console.log("GEOLOCATE ERROR!!")
}
}

async function saveToMongo(){
BreweryModel.create(brewArr)
 };

