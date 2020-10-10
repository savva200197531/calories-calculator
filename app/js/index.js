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
const resultOutput = document.querySelector('.result__output')

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
          console.log(this.selectors.genderSelector)
        }

        if (btn.name === 'weight') {
          btn.id === 'weight__kilos' ? this.selectors.weightSelector = true : this.selectors.weightSelector = false
          console.log(this.selectors.weightSelector)
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
          console.log(this.selectors.heightSelector)
        }

        if (btn.name === 'unit') {
          btn.id === 'unit__kcal' ? this.selectors.unitSelector = true : this.selectors.unitSelector = false
          console.log(this.selectors.unitSelector)
        }

        if (btn.name === 'formula') {
          btn.id === 'formula__mif' ? this.selectors.formulaSelector = true : this.selectors.formulaSelector = false
          console.log(this.selectors.formulaSelector)
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
        const message = `Поле ${ errorLine } должно быть заполнено`
        this.addError(element, error, message)
      } else if (element.className.includes('num') && isNaN(element.value.trim())) {
        const message = `Поле ${ errorLine } должно быть числовым`
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
      activity

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
    console.log(age, weight, height, activity)

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
    }
    resultOutput.textContent = `Результат: ${this.result}`
    // 2. Доработанный вариант формулы Миффлина-Сан Жеора, в отличие от упрощенного дает более точную информацию и учитывает степень физической активности человека:
    //
    //   для мужчин: (10 x вес (кг) + 6.25 x рост (см) – 5 x возраст (г) + 5) x A;
    // для женщин: (10 x вес (кг) + 6.25 x рост (см) – 5 x возраст (г) – 161) x A.
    //
    //   A – это уровень активности человека, его различают обычно по пяти степеням физических нагрузок в сутки:
    //
    //   1,2 – минимальная активность, сидячая работа, не требующая значительных физических нагрузок;
    // 1,375 – слабый уровень активности: интенсивные упражнения не менее 20 минут один-три раза в неделю. Это может быть езда на велосипеде, бег трусцой, баскетбол, плавание, катание на коньках и т. д. Если вы не тренируетесь регулярно, но сохраняете занятый стиль жизни, который требует частой ходьбы в течение длительного времени, то выберите этот коэффициент;
    // 1,55 – умеренный уровень активности: интенсивная тренировка не менее 30-60 мин три-четыре раза в неделю (любой из перечисленных выше видов спорта);
    // 1,7 – тяжелая или трудоемкая активность: интенсивные упражнения и занятия спортом 5-7 дней в неделю. Трудоемкие занятия также подходят для этого уровня, они включают строительные работы (кирпичная кладка, столярное дело и т. д.), занятость в сельском хозяйстве и т. п.;
    // 1,9 – экстремальный уровень: включает чрезвычайно активные и/или очень энергозатратные виды деятельности: занятия спортом с почти ежедневным графиком и несколькими тренировками в течение дня; очень трудоемкая работа, например, сгребание угля или длительный рабочий день на сборочной линии. Зачастую этого уровня активности очень трудно достичь.

  }
}

const calc = new Calculate()

form.addEventListener('submit', (event) => {
  event.preventDefault()
  calc.validation()
})
calc.selector()
