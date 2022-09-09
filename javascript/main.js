//Get Element By ID
const formSubmit = document.getElementById('submit-button')
const inputElement = document.getElementById('form-input')
const listElement = document.getElementById('list-container')
const editorElement = document.getElementById('editor')
const textUpdateEl = document.getElementById("textUpdate")
const selectElement = document.getElementById('selectElement')

//call render when insert/update localStorage Data
const render = () =>{
    const getData = getLocalStorageData()
    let stringElement = ''

    getData?.forEach(item => {

        let addItem = `
        <div id="list">
            <div id="editor">
                <textarea id="textUpdate" cols="28" rows="1">${item?.name}</textarea>
                <button value="${item?.name}" id="updateButton"onClick="handelUpdate(this)">update</button>
                <button type="submit" id="cancelButton"onClick="cancelHandel()">cancel</button>
            </div>
            
            <div id="content">
                <div>
                    <p>${item?.name}</p>
                </div>
            
                <div id="add-remove-button">

                    <button class="edit-button" onClick="editHandle(this)">Edit</button>
                    <button class="remove-button" value="${item?.name}"onClick="handleRemove(this)">Remove</button>  
                </div>
            </div>
        </div>`
         
        stringElement = addItem + stringElement;
    });

    listElement.innerHTML = stringElement;
}

//localStorage data insert/update & call render
const setLocalStorageData = (items) =>{
    localStorage.setItem('data', JSON.stringify(items))
    render()
}

//get localStorage Data
const getLocalStorageData = () =>{
    return JSON.parse(localStorage.getItem('data'))
}

//sort localStorage data
const sortByName = () =>{
    selectElement.selectedIndex = 1
    localStorage.setItem('sortBy','name')
    const getData = getLocalStorageData()
    let newData=[];
    const leters = 'ZYXWVUTSRQPONMLKJIHGFEDCBA'

    for(let i=0;i<26;i++){
        for(let j=0;j<getData.length;j++){
            if(leters[i]===getData[j].name[0].toUpperCase()) newData.push(getData[j])
        }
    }
    
    setLocalStorageData(newData)
}
//sort by latest
const sortByLatest = () => {
    localStorage.setItem('sortBy','latest')
    selectElement.selectedIndex = 0
    const largeId = localStorage.getItem('count')
    const getData = getLocalStorageData()
    const newData = []
    let finded
    
    for(let i=1;i<=largeId+1;i++){
        finded = getData.find(n=> n.id===i)
        if(finded) newData.push(finded)
    }

    setLocalStorageData(newData)
}


//sort option handeler
const handleSelect = (selected)=>{
    // console.dir(selected)
    if(selected.options.selectedIndex) sortByName();
    else sortByLatest()
}

//Remove item handeler
const handleRemove = (element) => {
    const getData = getLocalStorageData()
    const newData = getData.filter((item)=> item.name !== element.value)
    setLocalStorageData(newData)
}

//Show & Hide update option
let getEditButton;
 const editHandle = (editButton) =>{
    editButton.parentElement.parentElement.style.display = "none"
    editButton.parentElement.parentElement.previousElementSibling.style.display = "flex"
    getEditButton = editButton
 }
 const cancelHandel = () =>{
    getEditButton.parentElement.parentElement.style.display = "flex"
    getEditButton.parentElement.parentElement.previousElementSibling.firstElementChild.value  = getEditButton.parentElement.parentElement.firstElementChild.firstElementChild.innerText
    getEditButton.parentElement.parentElement.previousElementSibling.style.display = "none"
 }

//content update & call sort function
const updateLocalStorage = (stayName, changed) => {
    const getData = getLocalStorageData()
    const newData = []

    getData.forEach(i => {
        if(i.name===stayName){
            const id = i.id;
            newData.push({id,name: changed})
        }
        else newData.push(i)
    });

    setLocalStorageData(newData)
    if(localStorage.getItem('sortBy')==='name') sortByName()
}
//update handeler
const handelUpdate = (obj) => {
    const edited = getEditButton.parentElement.parentElement.previousElementSibling.firstElementChild.value
    updateLocalStorage(obj.value,edited)
}


//add new Data in Local Storage
const insertLocalStorage = (newItem) =>{
    const stay = getLocalStorageData()
    const id = JSON.parse(localStorage.getItem('count')) + 1
    localStorage.setItem('count',id)

    const newData = [...stay,{id, name: newItem}]
    setLocalStorageData(newData)
    
    if(localStorage.getItem('sortBy')==='name') sortByName()
    else sortByLatest()
}

//when click add button
formSubmit.addEventListener('click',(event)=>{
    event.preventDefault();
    insertLocalStorage(inputElement.value)
    inputElement.value = ''
})


//set initial data
const initialData =[
    {id:1, name: 'Eloquent JavaScript'},
    {id:2,name: 'The Alchemist'},
]
//First Time Render
if(getLocalStorageData()?.length){
    if(localStorage.getItem('sortBy')==='name'){
        selectElement.selectedIndex = 1
    }
    else selectElement.selectedIndex = 0
    render()
}
else{
    localStorage.setItem('count', 2)
    localStorage.setItem('sortBy','latest')
    setLocalStorageData(initialData)
}