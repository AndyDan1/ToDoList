
// ! selectors
const addBtn = document.getElementById('add')
const input = document.querySelector('#input')
const result = document.getElementById('result')
let select = document.getElementById('select')
const delGroup = document.getElementById('del-group')
const addGroup = document.getElementById('add-group')
const sortSelect = document.getElementById('sort-select')

//! arr, obj
let tasks
let groups
let arr = []
let todoItemElems = []

document.addEventListener('DOMContentLoaded', getLocalSelect)

//! Создание и вывод задачи на екран

//? получение данных из LS
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'))

//? отправка массива в LS   taski
const updateLocal = () => {
   localStorage.setItem('tasks', JSON.stringify(tasks))
}
//? ф-я конструктор
function Task(description, group) {
   this.description = description
   this.completed = false
   this.group = group
}

//? САМ ШАБЛОН
const createTemplate = (item, index) => {
   return `
         <li class = "todo-item ${item.completed ? 'checked' : ''}">
         <span>${item.description}</span>
         <div>
         <input  onclick = 'completeTask(${index})' type = "checkbox" ${item.completed ? 'checked' : ''}>
         <button onclick = 'reName(${index})'>Изменить</button>
         <button onclick = 'delTask(${index})'>Удалить</button>
         </div>
         </li>
   `
}

//? массив для шаблона
const fillHTML = function () {
   result.innerHTML = ''
   if (tasks.length > 0) {
      tasks.forEach((item, index) => {
         result.innerHTML += createTemplate(item, index)
      })
      todoItemElems = document.querySelectorAll('.todo-item')
   }
}

fillHTML()

//? слушатель кнопки
addBtn.addEventListener('click', function () {
   tasks.push(new Task(input.value, select.options[select.selectedIndex].text))
   input.value = ''
   updateLocal()
   fillHTML()
})


//? Завершенные task
const completeTask = (index) => {
   tasks[index].completed = !tasks[index].completed
   if (tasks[index].completed) {
      todoItemElems[index].classList.add('checked')
   } else {
      todoItemElems[index].classList.remove('checked')
   }
   updateLocal()
   fillHTML()
}

//? Удаление task
const delTask = (index) => {
   tasks.splice(index, 1)
   updateLocal()
   fillHTML()
}
//? изменить название task'i
const reName = (index) => {
   tasks[index].description = prompt('Не меняй меня')
   updateLocal()
   fillHTML()
}

//? Кнопка добавить группу
addGroup.addEventListener('click', function () {
   let nameGroup = input.value
   let myOption = document.createElement('option')
   myOption.text += nameGroup
   select.appendChild(myOption)
   //* Добавление в LS
   selectSinhro()

   saveLocalSelect(nameGroup)
   input.value = ''
   selectSinhro()
})

// ? Кнопка удалить группу

delGroup.addEventListener('click', function (e) {
   const item = select
   const group = item.parentElement
   dellLocalSelect(group)
   let dell = select.selectedIndex
   select.children[dell].remove()
   selectSinhro()
})

//? selectSort синхронизация значений двух селектов

const selectSinhro = () => {
   let a1 = [...Array.from(select.children)]
   const options = document.querySelectorAll('#sort-select option');
   options.forEach(o => o.remove());
   const all = document.createElement('option')
   all.innerHTML = 'ALL'
   sortSelect.appendChild(all)
   a1.forEach(function (item) {

      let a7 = item.cloneNode(true)
      sortSelect.appendChild(a7)

   })
}
selectSinhro()

//? сохранение в LS group
function saveLocalSelect(group) {
   let groups
   if (localStorage.getItem('groups') === null) {
      groups = []
   } else {
      groups = JSON.parse(localStorage.getItem('groups'))
   }

   groups.push(group)
   selectSinhro()
   localStorage.setItem('groups', JSON.stringify(groups))

}

//? Получение  LS group
function getLocalSelect() {
   let groups
   if (localStorage.getItem('groups') === null) {
      groups = []
   } else {
      groups = JSON.parse(localStorage.getItem('groups'))
   }
   groups.forEach(function (group) {
      let nameGroup = group
      let myOption = document.createElement('option')
      myOption.text += nameGroup
      select.appendChild(myOption)
   })
}

//? удаление из LS 
function dellLocalSelect(group) {
   let groups
   if (localStorage.getItem('groups') === null) {
      groups = []
   } else {
      groups = JSON.parse(localStorage.getItem('groups'))
   }

   const dellIndex = group.children[1][0].innerText
   groups.splice(groups.indexOf(dellIndex), 1)
   localStorage.setItem('groups', JSON.stringify(groups))
}

//?Сортировка tasks по подклассу
sortSelect.addEventListener('change', function () {
   tasks.filter(function (item, index) {

      if (sortSelect.options[sortSelect.selectedIndex].text === 'ALL') {
         document.getElementsByTagName('li')[index].style.display = 'flex'
      }
      else if (item.group == sortSelect.options[sortSelect.selectedIndex].text) {
         document.getElementsByTagName('li')[index].style.display = 'flex'
      }
      else {
         document.getElementsByTagName('li')[index].style.display = 'none'
      }
   })
})