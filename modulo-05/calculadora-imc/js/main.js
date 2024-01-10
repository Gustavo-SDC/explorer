// Objetos
import {Modal} from './modal.js'
import {imcCalculator} from './imcCalculator.js'
import {alert} from './alert.js'

// IMC é o peso vezes a altura ao quadrado

// Variaveis
let responseMenssage, heightValue, weightValue
const form = document.querySelector('form')
const responseContent = document.querySelector('#response h2')
const buttonCloseModal = document.querySelector('#closeModal')


// Eventos

buttonCloseModal.addEventListener('click', Modal.boxToggle)
form.onsubmit = event =>{
    event.preventDefault()
    
    heightValue= Modal.height.value
    weightValue= Modal.weight.value

    if (!weightValue || !heightValue){      
        clearInput()
        alert.errorEmptyInput()
        
    } else{
        alert.alertBox.classList.remove('open')
        
        const result = imcCalculator(heightValue, weightValue)
        responseContent.innerText= result
        
        clearInput()
        Modal.boxToggle()
    }
}

// Funções
function clearInput(){
    Modal.weight.value=''
    Modal.height.value=''
}