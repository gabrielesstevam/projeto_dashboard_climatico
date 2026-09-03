// imports ///////////////////////////////////////////
import * as UI from "./ui.js"
import * as WS from "./weatherService.js"

// variables ///////////////////////////////////////////
const htmlElements = { // elementos html
    button_theme:document.getElementById("button-theme"),
    button_modal_fixed:document.getElementById("button-fixed-modal"),
    button_reset:document.getElementById("button-reset"),
    content_form:document.querySelector('form')
}
export let systemVariables = { // variáveis de sistema
    isClick:true,
    itens_fixed_qnt: 0,
    modal_item_loc:""
}

//functions ///////////////////////////////////////////
function limitActive(f1= ()=>{}, f2= ()=>{}, f3= ()=>{}, f4= ()=>{}) { // limitador
    if (systemVariables.isClick) {
        systemVariables.isClick = false
        f1()
        f2()
        f3()
        f4()
        setTimeout(() => {
            systemVariables.isClick = true
        }, 500)
    }
}

// events ///////////////////////////////////////////
window.addEventListener("load", () => { // carrega página // tema - loading // dados
    UI.loadAnimation()
    UI.themeLoad()
    WS.loadData()
})
htmlElements.button_theme.addEventListener("click",() => { // trocar de tema
    limitActive(
        () => UI.themeSwitch())
})
htmlElements.button_modal_fixed.addEventListener("click",(event) => { // abrir/fechar modal de fixos
    if (systemVariables.itens_fixed_qnt > 0){
        limitActive(
            () => UI.modal("fixed", event.target.id))
    } else {
        limitActive(
            () => UI.warn("Nenhuma cidade fixada"))
    }
})
htmlElements.button_reset.addEventListener("click",(event) => { // reset de dados
    UI.alert("Todos os dados seram reiniciados")
    setTimeout(() => {
        localStorage.clear()
        location.reload()
    }, 1000);
})
document.addEventListener("click",(event) => { // abrir/fechar modal de documentação
    if (event.target.id == "button-view" || event.target.id == "button-view-i"){
        if (document.querySelector(".container-modal-description").classList.contains("opened")){
            if (systemVariables.modal_item_loc != event.target.closest(".item-response").querySelector(".item-city").innerHTML){
                limitActive(
                    () => UI.clickAnimation(event.target),
                    () => UI.documentPosition(event.target.closest(".item-response")),
                    () => UI.updateDocument(event.target.closest(".item-response").querySelector(".item-city").innerHTML.split(",")[0]),
                    () => { systemVariables.modal_item_loc = event.target.closest(".item-response").querySelector(".item-city").innerHTML })
                
            } else if (systemVariables.modal_item_loc == event.target.closest(".item-response").querySelector(".item-city").innerHTML){
                limitActive(
                    () => UI.clickAnimation(event.target),
                    () => UI.modal("document"))
            }
        } else {
            limitActive(
                () => UI.clickAnimation(event.target),
                () => UI.documentPosition(event.target.closest(".item-response")),
                () => UI.modal("document"),
                () => UI.updateDocument(event.target.closest(".item-response").querySelector(".item-city").innerHTML.split(",")[0]))
        }
    } else if (event.target.id == "button-fixed" || event.target.id == "button-fixed-i"){
        if (systemVariables.itens_fixed_qnt < 3){
            limitActive(
                () => UI.clickAnimation(event.target),
                () => WS.fixedCity(event.target.closest(".item-response").querySelector(".item-city").innerHTML.split(",")[0], true)
            )   
        } else {
            UI.warn("Só é possível fixar 3 cidades")
        }
    } else if (event.target.id == "button-trash" || event.target.id == "button-trash-i"){
        limitActive(
            () => UI.clickAnimation(event.target),
            () => WS.deleteFixed(event.target.closest(".item-modal-fixed").querySelector(".item-city"))
        )
    }
})
htmlElements.content_form.addEventListener('submit', (event) => { // pesquisar, salvar e criar UI
    event.preventDefault(); // bloqueia o reload da página
    const inputValue = document.getElementById("isearch-bar").value
    if (/\d/.test(inputValue) || /[!@#$%^&*(),.?":{}|<>]/.test(inputValue)) { // contém números
        UI.warn("Digite apenas letras")
    } else if (inputValue.length <= 1){ // menor ou igual a d
        UI.warn("Digite mais que uma letra")
    } else {
        limitActive(
            () => WS.saveCityDocument(inputValue.trim(), true))
    }
    document.getElementById("isearch-bar").value = ""

});

setInterval(() => {
    WS.updateAll()
    UI.alert("Dados Atualizados!")
}, 300000); // 5 minutos = 300000