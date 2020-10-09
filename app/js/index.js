// function calsPerDay() {
//   function find(id) { return document.getElementById(id) }
//
//   var age = find("age").value
//   var height = find("height").value * 2.54
//   var weight = find("weight").value / 2.2
//   var result = 0
//   if (find("male").checked)
//     result = 66.47 + (13.75 * weight) + (5.0 * height - (6.75 * age))
//   else if (find("female").checked)
//     result = 665.09 + (9.56 * weight) + (1.84 * height - (4.67 * age))
//   find("totalCals").innerHTML = Math.round( result )
// }
// calsPerDay()

const form = document.querySelector('#form')
const heightSelect = document.querySelector('.height__select')
const heightRadio = document.querySelectorAll('.height__radio')

class Calculate {
  constructor() {
    this.i = 0
    this.selectors = {
      genderSelector: 'male',
      weightSelector: 'kg',
      heightSelector: 'cm',
      unitSelector: 'kcal',
      formulaSelector: 'formula1',
    }
  }

  selectGender() {
    const genderRadio = document.querySelectorAll('.gender__radio')
    genderRadio.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.id === 'gender__male' ? this.selectors.genderSelector = 'male' : this.selectors.genderSelector = 'female'
        console.log(this.selectors.genderSelector)
      })
    })
  }

  selectWeight() {
    const weightRadio = document.querySelectorAll('.weight__radio')
    weightRadio.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.id === 'weight__kilos' ? this.selectors.weightSelector = 'kg' : this.selectors.weightSelector = 'lb'
        console.log(this.selectors.weightSelector)
      })
    })
  }

  selectHeight() {
    const heightInput = document.querySelector('.height__input')
    heightSelect.classList.add('hidden')
    heightRadio.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.checked && btn.id === 'height__cm') {
          heightSelect.classList.add('hidden')
          heightInput.classList.remove('hidden')
          this.selectors.heightSelector = 'cm'
        } else {
          heightSelect.classList.remove('hidden')
          heightInput.classList.add('hidden')
          this.selectors.heightSelector = 'ft'
        }
        console.log(this.selectors.heightSelector)
      })
    })
  }

  selectUnit() {
    const unitRadio = document.querySelectorAll('.unit__radio')
    unitRadio.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.id === 'unit__kcal' ? this.selectors.unitSelector = 'kcal' : this.selectors.unitSelector = 'kj'
        console.log(this.selectors.unitSelector)
      })
    })
  }

  selectFormula() {
    const formulaRadio = document.querySelectorAll('.formula__radio')
    formulaRadio.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.id === 'formula__mif' ? this.selectors.formulaSelector = 'formula1' : this.selectors.formulaSelector = 'formula2'
        console.log(this.selectors.formulaSelector)
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

  typeError(element, error, allInputs) {
    const errorLine = element.previousElementSibling.textContent.replace(':', '').toLowerCase()
    if (!element.className.includes('hidden')) {
      if (element.value.trim() === '') {
        const message = `Поле ${ errorLine } должно быть заполнено`
        this.addError(element, error, message)
      } else if (element.className.includes('num') && isNaN(element.value.trim())) {
        const message = `Поле ${ errorLine } должно быть числовым`
        this.addError(element, error, message)
      } else {
        this.i++
      }
      console.log(allInputs.length)
      console.log(this.i)
      if (this.i === allInputs.length) {
        // console.log('1')
      }
    }
  }

  validation() {
    let allInputs = []
    for (let element of form.elements) {
      if (!element.className.includes('radio-input') && !element.className.includes('list') && element.tagName !== 'BUTTON') {
        allInputs.push(element)
        const error = element.parentElement.lastElementChild
        this.typeError(element, error, allInputs)
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
  }
}

const calc = new Calculate()

form.addEventListener('submit', (event) => {
  event.preventDefault()
  calc.validation()
})
calc.selectGender()
calc.selectWeight()
calc.selectHeight()
calc.selectUnit()
calc.selectFormula()
