import * as WS from "./weatherService.js"

// variables ///////////////////////////////////////////
const modais_element = {
    fixed:document.querySelector(".container-modal-fix"),
    document:document.querySelector(".container-modal-description")
}
const pop_pups_element = {
    alertInterface:document.querySelector(".alert"),
    warnInterface:document.querySelector(".warn")
}

// pop-up functions ///////////////////////////////////////////
export function alert(mensage){
    pop_pups_element.alertInterface.innerHTML = mensage
    open_close(pop_pups_element.alertInterface,"open")
    setTimeout(() => {
        open_close(pop_pups_element.alertInterface,"close")
    }, 2000);
}
export function warn(mensage){
    pop_pups_element.warnInterface.innerHTML = mensage
    open_close(pop_pups_element.warnInterface,"open")
    setTimeout(() => {
        open_close(pop_pups_element.warnInterface,"close")
    }, 2000);
}

// theme functions ///////////////////////////////////////////
export function themeLoad(){ // carrega o tema
    const theme = localStorage.getItem("themeStorage") || "light"
    switch (theme){
        case("light"):{
            themeModify("light")
            break
        }
        case("dark"):{
            themeModify("dark")
            break
        }
    }
}
export function themeSwitch(){ // troca o tema
    const theme = localStorage.getItem("themeStorage")
    switch (theme){
        case("light"):{
            themeModify("dark")
            break
        }
        case("dark"):{
            themeModify("light")
            break
        }
    }
}
function themeModify(theme) { // modifica o tema
    const textTheme = document.getElementById("button-theme")

    let bodyClass = document.body.classList
    if (theme == "light"){
        bodyClass.remove("darkMode")
        textTheme.innerHTML = "Modo Escuro"
    } else {
        bodyClass.add("darkMode")
        textTheme.innerHTML = "Modo Claro"
    }
    document.querySelector(".wallpaper-video").src = `assets/videos/${theme}-mode.webm`
    localStorage.setItem("themeStorage", theme)
}

// modais_element functions ///////////////////////////////////////////
export function modal(modal) {
    if (modais_element[modal].classList.contains("closed")){
        open_close(modais_element[modal],"open")
    } else if (modais_element[modal].classList.contains("opened")){
        open_close(modais_element[modal],"close")
    }
}
function open_close(UIelement, mode){
    let animation = null
    let mode1 = null
    let mode2 = null
    if (mode == "close"){
        animation = "disappear"
        mode1 = "opened"
        mode2 = "closed"

    } else if (mode == "open"){
        animation = "emerge"
        mode1 = "closed"
        mode2 = "opened"
    }

    UIelement.classList.add(animation)
    setTimeout(() => {
        UIelement.classList.remove(mode1)
        UIelement.classList.add(mode2)
        UIelement.classList.remove(animation)
    }, 200);
}
// itens functions ///////////////////////////////////////////
function createItem(element, classE=[], htmlE="", id="", ){
    const obj = document.createElement(element)
    obj.classList.add(...classE)
    obj.id = id
    obj.innerHTML = htmlE
    return obj
}
////////////////////////
export function makeItemStorage(city){
    const container = document.querySelector(".container-itens-response")

    // criação dos elementos //
    const item_container = createItem("div",["item-response","shadow","closed"])
    const span1 = createItem("span")
    const iconLocation = createItem("i",["fa-solid","fa-location-dot"])
    const cityName = createItem("p",["item-city"],`${city.name}, ${city.country}`)
    const iconTemperature = createItem("i",["fa-solid","fa-temperature-quarter"],)
    const cityTemperature = createItem("p",["item-temperature"],`${city.temp} °C`)
    //////////////
    const span2 = createItem("span")
    const button_fixed = createItem("button",["button-item-fixed"],``,"button-fixed")
    const button_doc = createItem("button",["button-item-view"],``,"button-view")
    const icon_fixed = createItem("i",["fa-solid","fa-thumbtack"],"","button-fixed-i")
    const icon_doc = createItem("i",["fa-solid","fa-clipboard"],"","button-view-i")
    // implementação //
    span1.append(iconLocation, cityName, iconTemperature, cityTemperature)
    button_fixed.append(icon_fixed)
    button_doc.append(icon_doc)
    span2.append(button_fixed, button_doc)
    item_container.append(span1, span2)
    container.append(item_container)
    open_close(item_container,"open")
}
export function makeItemFixed(city){
    const container_fixed = document.querySelector(".container-itens-fixed")
    const container_fixed_modal = document.querySelector(".container-modal-fix")

    // item fixado //
    const item_fixed = createItem("div",["item-fixed", "glass", "shadow"])
    const icone_location = createItem("i",["fa-solid","fa-location-dot"])
    const item_name = createItem("p",["item-city"],`${city.name}, ${city.country}`)
    const icone_temperature = createItem("i",["fa-solid","fa-temperature-quarterd"])
    const item_temperature = createItem("p",["item-temperature"],`${city.temp} °C`)
    // implementação //
    item_fixed.append(icone_location,item_name,icone_temperature,item_temperature)
    container_fixed.append(item_fixed)

    // item fixado modal //
    const item_modal_fixed = createItem("div",["item-modal-fixed", "glass", "shadow"])
    const span = createItem("span")
    const icone_location_modal = createItem("i",["fa-solid","fa-location-dot"])
    const item_name_modal = createItem("p",["item-city"],`${city.name}, ${city.country}`)
    const button_trash = createItem("button",["button-trash"],"","button-trash")
    const icone_trash = createItem("i",["fa-solid", "fa-trash"],"","button-trash-i")
    // implementação //
    span.append(icone_location_modal, item_name_modal)
    button_trash.append(icone_trash)
    item_modal_fixed.append(span, button_trash)
    container_fixed_modal.append(item_modal_fixed)

    open_close(item_fixed,"open")
}
export function updateItens(){
    const searchLocal = WS.getLocalItem("searchStorage")
    const elementsStorage = document.querySelector(".container-itens-response").children
    const elementsFixed = document.querySelector(".container-itens-fixed").children

    for (const i of elementsStorage){
        const city = searchLocal[i.querySelector(".item-city").innerHTML.split(",")[0]]
        i.querySelector(".item-temperature").innerHTML = `${city.temp} °C`
    }
    for (const i of elementsFixed){
        const city = searchLocal[i.querySelector(".item-city").innerHTML.split(",")[0]]
        i.querySelector(".item-temperature").innerHTML = `${city.temp} °C`
    }
}
export function deleteFixedInterface(cityName){
    function deleteElement(container, elementClass){
        container.querySelectorAll(elementClass).forEach(item => {
            const cityTitle = item.querySelector(".item-city")
            if (cityTitle && cityTitle.textContent === cityName) {
                open_close(item,"close")
                setTimeout(() => {
                    item.remove() 
                }, 500);
            }
        })
    }
    const container_fixed = document.querySelector(".container-itens-fixed")
    const container_fixed_modal = document.querySelector(".container-modal-fix")
    deleteElement(container_fixed, ".item-fixed")
    deleteElement(container_fixed_modal, ".item-modal-fixed")
}

// document_modal functions ///////////////////////////////////////////
export function documentPosition(referenceBlock){
    const item = referenceBlock
    const itemPosition = item.getBoundingClientRect()
   
    modais_element["document"].style.position = "absolute";
    modais_element["document"].style.transform = "none";

    modais_element["document"].style.top = `${itemPosition.top + window.scrollY - modais_element["document"].offsetHeight - 10}px`;

    modais_element["document"].style.left = `${
        itemPosition.left +
        window.scrollX +
        (item.offsetWidth / 2) -
        (modais_element["document"].offsetWidth / 2)
    }px`;
}
export function updateDocument(cityName){
    const searchLocal = WS.getLocalItem("searchStorage")
    const cityObj = searchLocal[cityName]
    function syncInfo(query, object){
        modais_element.document.querySelector(`.description-${query}`).innerHTML = object
    }
    modais_element.document.querySelector(".front-image").style.backgroundImage = `url(${cityObj.image})`
    syncInfo("name", `${cityObj.name}, ${cityObj.country}`)
    syncInfo("climatic", `${cityObj.type_climatic}`)
    syncInfo("temperature", `${cityObj.temp} °C`)
    syncInfo("max-temperature", `${cityObj.tempMax} °C`)
    syncInfo("min-temperature", `${cityObj.tempMin} °C`)
    syncInfo("wind", `${cityObj.windSpeed} m/s`)
    syncInfo("cloud", `${cityObj.clouds} %`)
    syncInfo("humidity", `${cityObj.humidity} %`)
    syncInfo("pressure", `${cityObj.pressure} hPa`)
    syncInfo("time", `${cityObj.time}`)
}

//animation functions ///////////////////////////////////////////
export function clickAnimation(target){
    target.classList.add("click")
    setTimeout(() => {
        target.classList.remove("click")
    }, 1000);
}
export function loadAnimation(){
    const loading = document.querySelector(".loading")
    const loadingWallpaper = document.querySelector(".loading-wallpaper")
    loading.classList.add("loading-animation")
    setTimeout(() => {
        open_close(loading,"close")
        open_close(loadingWallpaper,"close")
        setTimeout(() => {
            loading.remove()
            loadingWallpaper.remove()
        }, 2000);
    }, 500);
}
