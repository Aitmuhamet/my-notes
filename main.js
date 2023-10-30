const themes = {
    light: {
        '--bg': '#deb887',
        '--color-text': '#000000',
        '--del-btn': '#810000',
        '--body-bg': '#f2f2f2',
    },
    dark: {
        '--bg': '#111111',
        '--color-text': '#ffffff',
        '--del-btn': '#ffbb00',
        '--body-bg': '#242424',
    }
}
function randomInt() {
    return Math.round(Math.random() * 10000)
}
const tasks = [];
(function(){
    // Массив
    // console.log(tasks);

    // Массив в объект
    // const taskObj = tasks.reduce(function(i, task){
    //     i[task.id] = task
    //     return i
    // }, {})
    // console.log(taskObj);

    // Объект в массив
    // console.log(Object.values(taskObj));

    // elemets
    const contentItems = document.querySelector('.content-items');
    const taskForm = document.taskForm;
    const title = taskForm.elements.title;
    const content = taskForm.elements.content;
    const themeBtn = document.querySelector('.navbar-theme');

    const themeName = localStorage.getItem('themeName');
    // установление темы, сохранённой из предыдущей сессии
    document.documentElement.style = localStorage.getItem('theme')
    
    themeBtn.classList.remove('light')
    themeBtn.classList.remove('dark')
    console.log(themeName);
    if(themeName == !null){
        themeBtn.classList.add(themeName)
    }else{
        themeBtn.classList.add('light')
    }
    themeBtn.setAttribute('data-theme', themeName)


    // events
    taskForm.addEventListener('submit', onFormSubmit)
    themeBtn.addEventListener('click', selectTheme)
    document.addEventListener('DOMContentLoaded', getTaskInLocalStore)
    document.addEventListener('click', deleteTask)

    // tasks.forEach(function(task){
    //     const card = createTemplateCard(task)
    //     contentItems.appendChild(card)
    // })

    
    // удаление карточки со страницы и из локальной истории
    function deleteTask(event){
        if(event.target.classList.contains('item__btnDel')){
            const parent = event.target.closest('.item')
            const parentID = parent.getAttribute('data-id')
            let arr;
            if(localStorage.getItem('tasks') === null){
                arr = []
            }else{
                arr = JSON.parse(localStorage.getItem('tasks'))
                parent.remove()
            }
            arr.forEach(function(task, key){
                if(parentID == task.id){
                    arr.splice(key,1)
                }
            })
            localStorage.setItem('tasks', JSON.stringify(arr))
            console.log(parent);
        }
    }
    // вывод записей из локальной истории
    function getTaskInLocalStore(){
        let arr;
        console.log(localStorage.getItem('tasks'));
        if(localStorage.getItem('tasks') == null){
            arr = []
        }else{
            arr = JSON.parse(localStorage.getItem('tasks'))
            arr.reverse()
            arr.forEach(function(task){
                contentItems.appendChild(createTemplateCard(task))
            })
        }
    }
    // выбор темы
    function selectTheme(){
        if(themeBtn.classList.contains('light')){
            themeBtn.classList.remove('light')
            themeBtn.classList.add('dark')
            themeBtn.setAttribute('data-theme', 'dark')
        }else{
            themeBtn.classList.remove('dark')
            themeBtn.classList.add('light')
            themeBtn.setAttribute('data-theme', 'light')
        }
        const myTheme = themeBtn.getAttribute('data-theme');
        const selectThemeObj = themes[myTheme]
        let strTheme = ''
        for(const key in selectThemeObj){
            strTheme += `${key}: ${selectThemeObj[key]}; `
        }
        document.documentElement.style = strTheme
        localStorage.setItem('theme', strTheme)
        localStorage.setItem('themeName', myTheme)
    }

    // отправка формы
    function onFormSubmit(event){
        // event.prevent.Default()
        const valueTitle = title.value;
        const valueContent = content.value;

        if(!valueTitle || !valueContent){
            alert('Заполните все поля')
            return
        }

        const taskObj = createNewTask(valueTitle, valueContent)
        const newItem = createTemplateCard(taskObj)
        contentItems.insertAdjacentElement('afterbegin', newItem)
        // event.target.reset()
    }
    function createNewTask(title, content){
        const newTask = {id: randomInt(), title, content}
        // tasks.push(newTask)
        taskInLocalStore(newTask)
        return newTask
    }
    function taskInLocalStore(obj){
        let arr;
        if(localStorage.getItem('tasks') === null){
            arr = []
        }else{
            arr = JSON.parse(localStorage.getItem('tasks'))
        }
        arr.push(obj)
        localStorage.setItem('tasks', JSON.stringify(arr))
    }

    // генерация карточки
    function createTemplateCard(obj) {
        const item = document.createElement('div')
              item.classList.add('item')
              item.setAttribute('data-id', obj.id)
        const itemText = document.createElement('div')
              itemText.classList.add('item__text')
        const h3 = document.createElement('h3')
              h3.innerHTML = obj.title
        const p = document.createElement('p')
              p.innerHTML = obj.content

        const itemButtons = document.createElement('div')
              itemButtons.classList.add('item__buttons')
        const delBtn = document.createElement('a')
              delBtn.classList.add('item__btnDel', 'icon-trash')
              delBtn.innerHTML = 'Удалить'
        const editBtn = document.createElement('a')
              editBtn.classList.add('item__btnEdit', 'icon-edit')
        
        itemText.appendChild(h3)
        itemText.appendChild(p)
        itemButtons.appendChild(delBtn)
        itemButtons.appendChild(editBtn)
        item.appendChild(itemText)
        item.appendChild(itemButtons)

        return item
    }
})()