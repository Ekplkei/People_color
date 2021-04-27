// Константы для хтмл
const input_file = document.getElementById("person_picture")
const img_canv = document.getElementById("imageCanvas")
const img_canv_cont = img_canv.getContext('2d')

const color_txt = document.getElementsByClassName("color")
const color_bgs = document.getElementsByClassName("color_bg")

const span = document.getElementsByClassName("predict")

// Цвет кожи определяется как сумма R G B. Приблезительные числа
const black_people = 108 + 83 + 70
const asial_people = 173 + 120 + 94
const white_people = 200 + 215 + 111


let count_click = 0
let colors_pick = []

//Перевод в 16ричную
function rgb_hex(color){
    return Number(color).toString(16).length == 1 
    ? "0" + Number(color).toString(16) 
    :    Number(color).toString(16)
}

// Обработка выбранного пикселя
function color_pick_Log(r, g, b){
    let this_block = count_click % color_bgs.length
    color_txt[this_block].textContent = `#${rgb_hex(r)}${rgb_hex(g)}${rgb_hex(b)}`
    color_bgs[this_block].style.backgroundColor = `rgb(${r}, ${g}, ${b})`

    colors_pick[this_block] = r + g + b

    count_click += 1
}

// картинка
let img = new Image

// Эвент для установки источника картинки по выбору файла
input_file.addEventListener("change", (event)=>{
    img.src = URL.createObjectURL(event.target.files[0])
})

// Отрисовка картинки на canvas
img.onload = function(e){
    img_canv.setAttribute("width", this.width)
    img_canv.setAttribute("height", this.height)
    img_canv_cont.drawImage(img, 0, 0)
}

// Основной этап. Выбор цвета
img_canv.addEventListener("click", (e) =>{
    let rect = e.target.getBoundingClientRect()
    let pixel = img_canv_cont.getImageData(e.clientX - rect.left, e.clientY - rect.top, 1, 1).data

    color_pick_Log(pixel[0], pixel[1], pixel[2])

    if (colors_pick.length == 3){
        let b = 0 //b- black. w- white. a- asian
        let w = 0
        let a = 0

        // Прогон по значениям. Выбор цвета на пикселе
        colors_pick.forEach(element => {
            if (element >= white_people){
                w += 1
            } else if (element <= black_people){
                b += 1
            } else {
                a += 1
            }
        })
        
        let most = Math.max(b, w, a) //Тупо можно было сравнить, но есть же функция

        if ([w, a, b].every(element => element == w)){ // Если значения равны
            span[0].textContent = "Мб азиат"
        } else if (most == w) {
            span[0].textContent = "Белый"
        }else if (most == b){
            span[0].textContent = "Чёрный"
        } else {
            span[0].textContent = "Азиат"
        }
    }

})

