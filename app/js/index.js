const form = document.querySelector('#form')
const heightSelect = document.querySelector('.height__select')
const heightRadio = document.querySelectorAll('.height__radio')
const resultOutput = document.querySelector('.result__output')
const modalHelp = document.querySelector('.activity__select-rules')
const modalResult = document.querySelector('.result__output-modal')
const help = document.querySelector('.help')
const container = document.querySelector('.container')

class Calculate {
  constructor() {
    this.selectors = {
      genderSelector: true,
      weightSelector: true,
      heightSelector: true,
      unitSelector: true,
      formulaSelector: true,
    }
    this.elementArr = []
    this.elementArrCount = 0
    this.result = 0
  }

  selector() {
    const allRadio = document.querySelectorAll('.radio-input')
    const heightInput = document.querySelector('.height__input')
    const heightList = document.querySelector('.height__list')
    heightList.classList.add('hidden')
    allRadio.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.name === 'gender') {
          btn.id === 'gender__male' ? this.selectors.genderSelector = true : this.selectors.genderSelector = false
        }

        if (btn.name === 'weight') {
          btn.id === 'weight__kilos' ? this.selectors.weightSelector = true : this.selectors.weightSelector = false
        }

        if (btn.name === 'height') {
          if (btn.checked && btn.id === 'height__cm') {
            heightList.classList.add('hidden')
            heightInput.classList.remove('hidden')
            this.selectors.heightSelector = true
          } else {
            heightList.classList.remove('hidden')
            heightInput.classList.add('hidden')
            this.selectors.heightSelector = false
          }
        }

        if (btn.name === 'unit') {
          btn.id === 'unit__kcal' ? this.selectors.unitSelector = true : this.selectors.unitSelector = false
        }

        if (btn.name === 'formula') {
          btn.id === 'formula__mif' ? this.selectors.formulaSelector = true : this.selectors.formulaSelector = false
        }
      })
    })
  }

  addError(element, error, message) {
    error.style.opacity = '1'
    error.textContent = message
    element.classList.add('vibration', 'no-valid')
    setTimeout(() => {
      element.classList.remove('vibration')
    }, 500);
  }

  removeError(element, error) {
    element.classList.remove('no-valid')
    error.style.opacity = '0'
  }

  typeError(element, error) {
    const errorLine = element.previousElementSibling.textContent.replace(':', '').toLowerCase()
    if (!element.className.includes('hidden')) {
      this.elementArr.push(element)
      if (element.value.trim() === '') {
        const message = `* Поле ${ errorLine } должно быть заполнено`
        this.addError(element, error, message)
      } else if (element.className.includes('num') && isNaN(element.value.trim())) {
        const message = `* Поле ${ errorLine } должно быть числовым`
        this.addError(element, error, message)
      } else {
        this.elementArrCount++
      }
    }
  }

  validation() {
    for (let element of form.elements) {
      if (!element.className.includes('radio-input') && !element.className.includes('list') && element.tagName !== 'BUTTON') {
        const error = element.parentElement.lastElementChild
        this.typeError(element, error)
        element.addEventListener('focus', () => {
          this.removeError(element, error)
        })
        heightRadio.forEach(btn => {
          btn.addEventListener('click', () => {
            if (btn.checked && btn.id === 'height__feet') {
              this.removeError(heightSelect.previousElementSibling, heightSelect.parentElement.lastElementChild)
            }
          })
        })
      }
    }
    if (this.elementArr.length === this.elementArrCount) {
      this.submit()
    }
    this.elementArrCount = 0
    this.elementArr = []
  }

  submit() {
    let elementsArr = []
    let age,
      weight,
      height,
      activity,
      resultUnit

    for (let element of form.elements) {
      if (!element.className.includes('hidden') && (element.className.includes('text-input') || element.className.includes('list'))) {
        elementsArr.push(element)
      }
    }

    const find = cl => {
      let el = ''
      elementsArr.forEach(element => {
        if (element.className.includes(cl)) {
          el = element.value
        }
      })
      return el
    }

    age = find('age__input')
    if (this.selectors.weightSelector) {
      weight = find('weight__input')
    } else {
      weight = find('weight__input') * 0.454
    }
    if (this.selectors.heightSelector) {
      height = find('height__input')
    } else {
      height = find('height__list') * 30.19
    }
    activity = find('activity__list')

    if (this.selectors.genderSelector) {
      if (this.selectors.formulaSelector) {
        this.result = (10 * weight + 6.25 * height - 5 * age + 5) * activity
      } else {
        this.result = (66 + (13.7 * weight) + (5 * height) - (6.8 * age)) * activity
      }
    } else {
      if (this.selectors.formulaSelector) {
        this.result = (10 * weight + 6.25 * height - 5 * age - 161) * activity
      } else {
        this.result = (655 + (9.6 * weight) + (1.8 * height) - (4.7 * age)) * activity
      }
    }
    if (!this.selectors.unitSelector) {
      this.result *= 4.1868
      resultUnit = 'килоджоулей'
    } else {
      resultUnit = 'килокалорий'
    }
    this.modalResult()
    resultOutput.textContent = `Результат: ${ this.result } ${ resultUnit }`
  }

  modalResult(event) {
    if (event) {
      if (event.target.className.includes('modal-close') || event.target.className.includes('modal')) {
        modalResult.classList.add('hiddenOpacity')
        container.classList.remove('blured')

      }
    } else {
      modalResult.classList.remove('hiddenOpacity')
      container.classList.add('blured')
    }
  }

  modalHelp(event) {
    if (event.target.className.includes('modal-close') || event.target.className.includes('modal')) {
      modalHelp.classList.add('hiddenOpacity')
      container.classList.remove('blured')
    } else if (event.target.className.includes('help')) {
      modalHelp.classList.remove('hiddenOpacity')
      container.classList.add('blured')
    }
  }
}

const calc = new Calculate()

modalHelp.addEventListener('click', event => {
  calc.modalHelp(event)
})
help.addEventListener('click', event => {
  calc.modalHelp(event)
})
modalResult.addEventListener('click', event => {
  calc.modalResult(event)
})
form.addEventListener('submit', (event) => {
  event.preventDefault()
  calc.validation()
})
calc.selector()
