const search = document.querySelector('.product-search')
const btn = document.querySelector('.btnn')
const input = document.querySelector('.input')

btn.addEventListener('click', () =>{
    search.classList.toggle('active')
    input.focus()
})

