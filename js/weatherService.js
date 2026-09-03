// imports ///////////////////////////////////////////
import * as UI from "./ui.js"
import * as MAIN from "./main.js"

// class ///////////////////////////////////////////
class citySearch { // objeto para construção da cidade e sua documentação completa
    constructor (json){
        const {image, climatic} = citySearch.getClimaticImage(json.weather[0].id, "./assets/images/")
        this.type_climatic = climatic
        this.image = image
        this.name = json.name
        this.country = json.sys.country
        this.temp = json.main.temp
        this.tempMax = json.main.temp_max
        this.tempMin = json.main.temp_min
        this.humidity = json.main.humidity
        this.clouds = json.clouds.all
        this.windSpeed = json.wind.speed
        this.pressure = json.main.pressure
        this.time = citySearch.getLocalTime(json.dt, json.timezone)
    }
    static getClimaticImage(id, roteImage){
        if (id >= 200 && id <= 232) {
            return {
                image: `${roteImage}tempest.jpg`,
                climatic: "Tempestade"}
        } else if (id >= 300 && id <= 321) {
            return {
                image: `${roteImage}drizzle.jpg`,
                climatic: "Garoa"}
        } else if (id >= 500 && id <= 531) {
            return {
                image: `${roteImage}rain.jpg`,
                climatic: "Chuva"}
        } else if (id >= 600 && id <= 622) {
            return {
                image: `${roteImage}snow.jpg`,
                climatic:"Neve"}
        } else if (id == 701) {
            return {
                image: `${roteImage}mist.jpg`,
                climatic: "Névoa"}
        } else if (id == 711) {
            return {
                image: `${roteImage}smoke.jpg`,
                climatic: "Fumaça"}
        } else if (id == 721) {
            return {
                image: `${roteImage}mist.jpg`,
                climatic: "Bruma"}
        } else if (id == 731) {
            return {
                image: `${roteImage}tornado-sand.jpg`,
                climatic: "Tornado de Areia"}
        } else if (id == 741) {
            return {
                image: `${roteImage}mist.jpg`,
                climatic: "Nevoeiro"}
        } else if (id == 751) {
            return {
                image: `${roteImage}sand.jpg`,
                climatic: "Areia"}
        } else if (id == 761) {
            return {
                image: `${roteImage}sand.jpg`,
                climatic: "Poeira"}
        } else if (id == 762) {
            return {
                image: `${roteImage}volcanic.jpg`,
                climatic: "Cinza Vulcânica"}
        } else if (id == 771) {
            return {
                image: `${roteImage}wind-force.jpg`,
                climatic: "Rajada de vento"}
        } else if (id == 781) {
            return {
                image: `${roteImage}tornado.jpg`,
                climatic: "Tornado"}
        } else if (id == 800) {
            return {
                image: `${roteImage}clear.jpg`,
                climatic: "Céu limpo"}
        } else if (id >= 801 && id <= 804) {
            return {
                image: `${roteImage}clouds.jpg`,
                climatic: "Nuvens"}
        }
    }
    static getLocalTime(dt, timezone) {
        const dataCidade = new Date((dt + timezone) * 1000)
        const horas = String(dataCidade.getUTCHours()).padStart(2, "0")
        const minutos = String(dataCidade.getUTCMinutes()).padStart(2, "0")
        return `${horas}:${minutos}`
    }
}

// function ///////////////////////////////////////////
export async function saveCityDocument(cityName, bool) {
    try {
        const searchLocal = getLocalItem("searchStorage") || {}
        if (bool){
            for (const i in searchLocal){ // verifica se ja foi armazenada
            if (searchLocal[i].name.toLowerCase() == cityName.toLowerCase()){ throw new Error(`Os dados de ${cityName} ja estão armazenados`)}}
        }

        const response = await fetchCity(cityName)
    
        if (!response.ok){ // verifica os erros na requisição
            if (response.status === 404) {
                throw new Error("Cidade não encontrada");
            } else if (response.status === 401) {
                throw new Error("Chave de API inválida");
            } else if (response.status === 429) {
                throw new Error("Limite de requisições excedido");
            } else {
                throw new Error(`Erro inesperado na requisição: ${response.status}`);
            }
        }

        const responseJSON = await response.json()
        const city = new citySearch(responseJSON)
        searchLocal[responseJSON.name] = city
        UI.makeItemStorage(city)

        if (bool){
            localStorage.setItem("searchStorage", JSON.stringify(searchLocal))
            UI.alert(`Os dados de ${cityName} foram armazenados `)
        }

    } catch (erro) {
        UI.warn(erro.message)
    }
}
export function fixedCity(cityName,bool){
    const fixedLocal = getLocalItem("fixedStorage") || {}
    if (bool){
        for (const i in fixedLocal){
            if (i == cityName){
                UI.warn(`Os dados de ${cityName} ja estão fixados`)
                return
            }
        }
    }
    
    const searchLocal = getLocalItem("searchStorage")
    UI.makeItemFixed(searchLocal[cityName])
    if (bool){
        fixedLocal[cityName] = {
            name:searchLocal[cityName].name,
            country:searchLocal[cityName].country,
            temp:searchLocal[cityName].temp
        }
        localStorage.setItem("fixedStorage",JSON.stringify(fixedLocal))
        UI.alert(`Os dados de ${cityName} foram fixados`) 
    }
    
    MAIN.systemVariables.itens_fixed_qnt ++
}
export function deleteFixed(cityName){
    setTimeout(() => {
        const fixedLocal = getLocalItem("fixedStorage")
        delete fixedLocal[cityName.innerHTML.split(",")[0]]
        localStorage.setItem("fixedStorage", JSON.stringify(fixedLocal))

        UI.deleteFixedInterface(cityName.innerHTML)
        MAIN.systemVariables.itens_fixed_qnt -= 1
        if (MAIN.systemVariables.itens_fixed_qnt == 0){
            UI.modal("fixed")
        }
    }, 500);
}
export function loadData(){
    const searchLocal = getLocalItem("searchStorage") || {}
    const fixedLocal = getLocalItem("fixedStorage") || {}
    for (const i in searchLocal) {
        saveCityDocument(searchLocal[i].name,false)
    }
    for (const i in fixedLocal) {
        fixedCity(fixedLocal[i].name,false)
    }
}
export async function updateAll(){
    const searchLocal = getLocalItem("searchStorage")
    const promises = Object.values(searchLocal).map(city => 
        fetchCity(city.name).then(r => r.json())
    )
    const results = await Promise.all(promises)

    const searchUpdateLocal = {}
    
    results.forEach(json => {
        const city = new citySearch(json)
        searchUpdateLocal[city.name] = city
    })
    localStorage.setItem("searchStorage",JSON.stringify(searchUpdateLocal))
    UI.updateItens()
}
export function getLocalItem(key){
    try{
        return JSON.parse(localStorage.getItem(key))
    } catch(erro){
        UI.warn(erro.message)
    }
}
async function fetchCity(cityName){
    return await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=42064ff7a59c148d8dbfe2b9bdf4b7cf&units=metric`)
}