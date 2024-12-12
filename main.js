/**@type(HTMLCanvasElement) */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let color="black";
let lineWidth=1;
let RcolorMetrics= {red:0,green:255,blue:255};
let LangFlag=0;
const dictionary={
    EN:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    HE:"אבגדהוזחטיכלמנסעפצקרשת",
    "עברית":"English",
    "select your line color and width! and make a drawing!":"בחר/י צבע ועובי קו! וצייר/י ציור!",
    "Line width":"עובי קו",
    "Clear canvas":"נקה/י קנבס",
    "Practice writing a print letter😁":"תרגל/י כתיבת אות בכתב דפוס😁",
    "Practice writing a script letter😎":"תרגל/י כתיבת אות בכתב יד😎",
    "Click for a Random Color":"לחץ/י לצבע אקראי",
}
const outline={
    black:"red",
    red:"blue",
    green:"crimson",
    blue:"red",
    yellow:"green",
    purple:"aqua",
    pink:"black",
    aqua:"yellow",
}

document.addEventListener('DOMContentLoaded', function() {
    selectcolor("black",false);
});

function startDrawing(e) {
    drawing = true;
    draw(e); 
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath(); 
}

function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = lineWidth; 
    ctx.lineCap = 'round'; 
    ctx.strokeStyle = color; 

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop); 
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop); 
}

function selectcolor(Selcted_color,colorBox,negativeColor){
    color=Selcted_color;
    const elementsToTranslate = document.querySelectorAll('.color_selector');
    const outline_color=outline[Selcted_color]?outline[Selcted_color]:negativeColor;
    elementsToTranslate.forEach(function (element) {
        if (element!=colorBox){
            element.style.outline="none";
        }
    });
    if (colorBox){
        colorBox.style.outline=`5px solid ${outline_color}`;
    } else if (Selcted_color==="black"){
        document.getElementById("black").style.outline="5px solid red";
    }
}

function selectline(Selcted_width){
    lineWidth=Selcted_width;
}

function randomize(colorBox) {
    let i = 0;
    const interval = setInterval(() => {
        getRandomColor(colorBox); 
        i++;
        if (i >= 10) {
            clearInterval(interval);    
        }
    }, 100);
}

function getRandomColor(colorBox){
    const red = Math.floor(Math.random() * 256);  
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256); 
    const randomBtn=document.getElementById("random");
    const Rcolor=`rgb(${red},${green},${blue})`;
    RcolorMetrics= {red:red,green:green,blue:blue}
    const negativeColor= `rgb(${256 - red},${256 - green},${256 - blue})`;
    randomBtn.style.backgroundColor=Rcolor;
    randomBtn.style.border="none";
    randomBtn.style.color = negativeColor;
    selectcolor(Rcolor,colorBox,negativeColor);
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lineWidth=1;
    document.getElementById("Line_Width_select").value="1";

}

function drawRandomLetter(type) {
    let i = 0;
    const interval = setInterval(() => {
        createRandomLetter(type); 
        i++;
        if (i >= 10) {
            clearInterval(interval);    
        }
    }, 50);

}

function createRandomLetter(type){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const lang= LangFlag===0?"EN":"HE";
    const alphabet = dictionary[lang];
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    const negativeColor= `rgb(${256-RcolorMetrics.red},${256-RcolorMetrics.green},${256- RcolorMetrics.blue})`
    document.getElementById("Line_Width_select").value="8";
    const x = canvas.width / 2;
    let y = 0;
    selectline(8)
    if (type==='print'){
        Selcted_font=`400px ${LangFlag===0?"regular":"hebrew"}`;
        y=canvas.height / 2;
    }else if (type==='script'){
        Selcted_font=`300px ${LangFlag===0?"script":"HEscript"}`;
        y=LangFlag===0?canvas.height / 1.5:canvas.height / 2;
    }
    ctx.font = Selcted_font;
    ctx.fillStyle= negativeColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(randomLetter, x, y);
}

function translateToHE(ENText) {
    return dictionary[ENText] || ENText;  // Default to original text if not found
}

function toggleLang() {
    const elementsToTranslate = document.querySelectorAll('.translatable');
    elementsToTranslate.forEach(function (element) {
        if (!element.dataset.originalText) {
            element.dataset.originalText = element.innerHTML.trim();
            element.innerHTML = element.dataset.originalText;
        }

        // Toggle translation based on the language flag
        if (LangFlag === 0) {
            element.innerHTML = translateToHE(element.innerHTML);  // Translate to He
            document.body.setAttribute('dir', 'rtl');
            document.body.style.fontFamily="hebrew";
            if (element.classList.contains("h1")){
                element.style.fontFamily="HEbold";
                if (element.innerHTML==="English"){
                    element.style.fontFamily="regular";
                }
            }
            } else {
                element.innerHTML = element.dataset.originalText;  // Restore En text
                document.body.setAttribute('dir', 'ltr');
                document.body.style.fontFamily="regular";
                if (element.innerHTML==="עברית"){
                    element.style.fontFamily="hebrew";
                }
        }
    });
    LangFlag = LangFlag === 0?1:0; 
};



canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);