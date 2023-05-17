let snakeBody = [{x:3,y:1},{x:2,y:1},{x:1,y:1} ]
let myScore = 0
let gameOver = false
let allOver = false
let level = 1
let inputDirection = {x:0,y:0}
let lastInput = {x:0,y:0}
let reset = false
let newSegment = 0
const keys = document.querySelectorAll(".keys i")
const audio = new Audio('../Sound/eat.mpeg')
const foodColors = ["crimson","blue","green","purple","gray","darkcyan","darkorchid","goldenrod"]
const cBox = document.getElementsByClassName("c")
const uBox = document.getElementsByClassName("u")
const max_score = document.getElementById("maxScore")
const my_score = document.getElementById("myScore")
let uSeq =[]
const life = document.querySelector(".lives")
const time = document.querySelector(".time")
const gridSize = document.querySelector("#gridSize")
const submit = document.querySelector("#btn")
let c=1
let snakeSpeed = 10
let pause = true
let lastTime = 0
const gameBoard = document.getElementById("board")

window.addEventListener('keydown', e => {changeDirection(e)})

max_score.innerHTML = localStorage.getItem("highScore")
//------------------------ updating time and //incrementing on level ups// ----
setInterval(
    ()=> {
        let n = time.innerHTML 
        if(!pause) time.innerHTML = n-1
    },1000
)
//increasing snake speed for every 15sec
setInterval(
    () => {
        snakeSpeed += 1
    },25000
)

//----grid size from user---------
const newGrid = grid => {
    document.documentElement.style.setProperty('--grid',grid)
    let set = []
    for(i=1;i<=grid;i++){
        set.push(i)
    }
    return set
}

let numberSet = newGrid(21)
submit.addEventListener("click", () => {
    numberSet = newGrid(gridSize.value)
    toReset()
})

//---------------------getting direction from keyboard ---------------------------

const changeDirection = e => {
    // console.log(e.key)
    switch (e.key){
        case 'ArrowUp':
            if (lastInput.y !== 0) break
            inputDirection = { x: 0, y: -1}
            pause = false
            break
        case 'ArrowDown':
            if (lastInput.y !== 0) break
            inputDirection = { x: 0, y: 1}
            pause = false
            break
        case 'ArrowLeft':
            if (lastInput.x !== 0) break
            inputDirection = { x: -1, y: 0}
            pause = false
            break
        case 'ArrowRight':
            if (lastInput.x !== 0) break
            pause = false
            inputDirection = { x: 1, y: 0}
            break
        case ' '://click any direction to continue playing
            inputDirection = { x: 0, y: 0}
            pause = true
            break
    }
}

const getDirection = () =>{
    lastInput = inputDirection
    return inputDirection
} 

//--------- getting direction from keys ------------
keys.forEach(key=>{
    key.addEventListener("click", () => {changeDirection({key: key.dataset.key})} )
})


//------------------------food positions /not repeating and /not on snake  ---------

const onSnake = (position, head=false) => {
    if(head===true){
        return snakeBody.some((segment,index) => {
            if(index!==0) {
                // console.log("intersedct",segment,snakeBody[0])
                return (
                    segment.x === snakeBody[0].x &&
                    segment.y === snakeBody[0].y
                )
            }
        })
    }
    else{
        return snakeBody.some((segment,index) => {
            return (
                segment.x === position.x &&
                segment.y === position.y
            )
        })
    }
}

const getRandomFoodPositions = () => {
    let newFoodPosition
    let xPos = [...numberSet]
    let yPos = [...numberSet]
    const foodPos_X = xPos.sort(()=> 0.5 -Math.random())
    const foodPos_Y = yPos.sort(()=> 0.5 -Math.random())
    let foodPos = []
    i=0
    while(foodPos.length<4){
        newFoodPosition = {x:foodPos_X[i],y:foodPos_Y[i]}
        if(!onSnake(newFoodPosition)){
            foodPos.push(newFoodPosition)
        }
        i++
    }
    return foodPos
}

//----------------------generating random color sequence ----------------------------------------------
const colorSeq = () => {
    let compSeq = []
    let cpFood = foodColors.slice()
    for(let i=0;i<4;i++){
        const shuffled = cpFood.sort(()=> 0.5 -Math.random())
        let food = cpFood.shift()
        compSeq.push(food)
        cBox[i].style.backgroundColor=compSeq[i]
    }
    return compSeq
}

//--------color:food pos combo

let food = getRandomFoodPositions()
let cSeq = colorSeq()
let fc= new Map()
for(i=0;i<4;i++){
    fc.set(cSeq[i],food[i])
}

//--------------------update function called in main to update snakedirection, foodPosition, game ending status 
const update = () => {
    // update snake
    const direction = getDirection()
    if (!(direction.x === 0 && direction.y ===0)){
        console.log("in")
        for(i= snakeBody.length-2;i>=0;i--){
            snakeBody[i+1] = {...snakeBody[i]}
        }
    
        snakeBody[0].x+=direction.x
        snakeBody[0].y+=direction.y
    }
    
    
    //game won
    fc = won()
    if(reset){
        fc = toReset()
        gameOver = false
        reset = false
    }

    //check death 
    const outside = pos => {
        return( pos.x<1 || pos.x > numberSet.length|| pos.y<1 || pos.y >numberSet.length)
    }
    const timeup = () => {
        return(time.innerHTML == 0)
    }
    const wrongSeq = () => {
        if (uSeq){
            for(i=0;i<uSeq.length;i++){
                if (uSeq[i] !== cSeq[i]) return true               
            }
        }
    }
    const snakeIntersection = () => {
        return (onSnake(snakeBody[0],true))
    }

    gameOver = outside(snakeBody[0])||timeup()||wrongSeq()||snakeIntersection()
    finalChk(gameOver)

    //update food -remove on eating and create on finishing
    fc.forEach((value,key,index) => {
        if(onSnake(value)){
            uSeq.push(key)
            uBox[4-fc.size].style.backgroundColor = key
            if(!wrongSeq(uSeq)) audio.play()
            // console.log(fc.size,key)
            fc.delete(key)
        }
    })
}



//-------------------------draw func called in main to draw snake, food-------------------


const draw = () =>{
    gameBoard.innerHTML=""
    //draw snake
    i=0
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement("div")
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        snakeElement.classList.add("snake")
        snakeElement.classList.add('i'+String(i))
        gameBoard.appendChild(snakeElement)
        i++
    })

    //draw food
    fc = won()
    if(reset){
        fc = toReset()
        gameOver = false
        reset = false
    }
    

    fc.forEach((value,key) => {
        // console.log(value,key)
        const foodElement = document.createElement('div')
        foodElement.style.gridRowStart = value.y
        foodElement.style.gridColumnStart = value.x
        foodElement.style.backgroundColor = key
        gameBoard.appendChild(foodElement)
    } )
    
} 


//-----------------high score-----------------
const highScore = () => {
    let maxScore = localStorage.getItem("highScore")
    if(maxScore == null || myScore>Number(maxScore)){
        localStorage.setItem("highScore", String(myScore))
    }
    max_score.innerHTML = localStorage.getItem("highScore")  
}

//-------------------game won --------------------------------
const newFC =()=>{
    //--------color:food pos combo
    let fc= new Map()
    for(i=0;i<4;i++){
        fc.set(cSeq[i],food[i])
    }
    // console.log(fc)
    return fc
}

const won = () => {
    if(uSeq.length == 4 && JSON.stringify(uSeq) === JSON.stringify(cSeq)){
        cSeq = colorSeq()
        food = getRandomFoodPositions()
        level++
        myScore+=4
        my_score.innerHTML = myScore
        highScore()
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] }) // use loop for multiple expansion expand snake
        time.innerHTML=Number(time.innerHTML)+10
        for(i=0;i<4;i++){
            uBox[i].style.backgroundColor=""
        }
        fc = newFC(cSeq,food)
        uSeq=[]
        
    }
    
    return fc
}

//----lives----------
const finalChk = gameOver => {
    if(gameOver){
        if(c<3){
            alert("Lost 1 life")
            console.log(gameOver,c,"Lost 1 life")
            reset = true
            toReset(reset)
            // gameOver = false
            console.log(c)
            life.removeChild(life.children[0])
            c++
        }else{
            life.removeChild(life.children[0])
            allOver = true
        }
    }
}

//-------reset------------
const toReset = () => {
    cSeq = colorSeq()
    food = getRandomFoodPositions()
    for(i=0;i<4;i++){
        uBox[i].style.backgroundColor=""
    }
    pause = true
    snakeBody = [{x:3,y:1},{x:2,y:1},{x:1,y:1} ]
    inputDirection ={x:0,y:0}
    fc = newFC(cSeq,food)
    uSeq=[]  
    return fc
}


//-------------------------main function to run everything called every 200ms---------------------------

const main = currentTime => {
    if(allOver){
        highScore()
        if(confirm('You lost all lives. Press ok to restart')){
            location.reload()
        }
        return
    }

    window.requestAnimationFrame(main)
    const secDiff = (currentTime - lastTime)/1000
    if(secDiff < 1/snakeSpeed) return
    lastTime = currentTime

    update()
    draw()
}

window.requestAnimationFrame(main)
