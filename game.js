let snakeBody = [ {x:1,y:1} ]
let myScore = 0
let level = 1

//------------------------ updating time and //incrementing on level ups// --------------------------------
const time = document.querySelector(".time")
setInterval(
    ()=> {
        let n = time.innerHTML 
        time.innerHTML = n-1
    },1000
)
    

//---------------------getting direction from keys ---------------------------

let inputDirection = {x:0,y:0}
let lastInput = {x:0,y:0}

window.addEventListener('keydown', e => {
    // console.log(e.key)
    switch (e.key){
        case 'ArrowUp':
            if (lastInput.y !== 0) break
            inputDirection = { x: 0, y: -1}
            break
        case 'ArrowDown':
            if (lastInput.y !== 0) break
            inputDirection = { x: 0, y: 1}
            break
        case 'ArrowLeft':
            if (lastInput.x !== 0) break
            inputDirection = { x: -1, y: 0}
            break
        case 'ArrowRight':
            if (lastInput.x !== 0) break
            inputDirection = { x: 1, y: 0}
            break
    }
})

const getDirection = () =>{
    lastInput = inputDirection
    return inputDirection
} 


//------------------------food positions /not repeating and /not on snake --line 40--  -----------------------

const onSnake = position => {
    return snakeBody.some((segment,index) => {
        if(index===0) return false
        return (
            segment.x === position.x &&
            segment.y === position.y
        )
    })
}


const getRandomFoodPositions = () => {
    let newFoodPosition
    let xPos = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]
    let yPos = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]
    
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

const foodColors = ["green","blue","orange","red","purple","violet","pink","grey"];
const cBox = document.getElementsByClassName("c")

const colorSeq = () => {
    let compSeq = []
    let cpFood = foodColors
    for(let i=0;i<4;i++){
        const shuffled = cpFood.sort(()=> 0.5 -Math.random())
        let food = cpFood.shift()
        compSeq.push(food)
    }
    return compSeq
}

cSeq=colorSeq()
for(i=0;i<4;++i){
    cBox[i].style.backgroundColor=cSeq[i]
}




//-------------------------draw func called in main to draw snake, food----------------------------------------

let food = getRandomFoodPositions()

//--------color:food pos combo
// console.log(food,cSeq)
let fc= new Map()
for(i=0;i<4;i++){
    fc.set(cSeq[i],food[i])
}


const draw = () =>{
    gameBoard.innerHTML=""
    //draw snake
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement("div")
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        snakeElement.classList.add("snake")
        gameBoard.appendChild(snakeElement)
    })

    //draw food

    fc.forEach((value,key) => {
        const foodElement = document.createElement('div')
        foodElement.style.gridRowStart = value.y
        foodElement.style.gridColumnStart = value.x
        foodElement.style.backgroundColor = key
        foodElement.classList.add('i'+String(i))
        gameBoard.appendChild(foodElement)
    } )
    
} 


//-------------------------------------------update function called in main to update snakedirection, foodPosition, game ending status --------------------------

const uBox = document.getElementsByClassName("u")
const max_score = document.getElementById("maxScore")
const my_score = document.getElementById("myScore")
let v=0
uSeq =[]


const update = () => {
    // update snake
    const direction = getDirection()
    for( i =1;i>=0;i--){
        snakeBody[i+1] = {...snakeBody[i]}
    }

    snakeBody[0].x+=direction.x
    snakeBody[0].y+=direction.y

    //update food -remove on eating and create on finishing
    fc.forEach((value,key) => {
        if(onSnake(value)){
            fc.delete(key)
            uSeq.push(key)
            uBox[v].style.backgroundColor = key
            v++
        }
    })

    //score update
    // my_score.innerHTML = myScore
    // if(myScore>max_score.innerHTML){
    //     max_score.innerHTML = my_score
    // }

    //check death 
    const outside = pos => {
        return( pos.x<1 || pos.x > 21 || pos.y<1 || pos.y >21 )
    }
    const timeup = () => {
        return(time.innerHTML == 0)
    }
    const wrongSeq = () => {
        if(uSeq.length === 4){
            let res = JSON.stringify(uSeq) === JSON.stringify(cSeq)
            //win
            if(res){
                level++
                myScore+=4
                time.innerHTML=time.innerHTML+10
                return false
            }
            return true
        }
    }
    gameOver = outside(snakeBody[0])||timeup()||wrongSeq()
}


//---------------------------------main function to run everything called every 200ms---------------------------
let lastTime = 0
let gameOver = false
const gameBoard = document.getElementById("board")
// const snakeSpeed = 5

const main = currentTime => {
    if(gameOver){
        if(confirm('You lost. Press ok to restart')){
            window.location = '/'
        }
        
        return
    }

    window.requestAnimationFrame(main)
    const secDiff = (currentTime - lastTime)/1000
    if(secDiff < 1/5) return
    lastTime = currentTime

    update()
    draw()
}

window.requestAnimationFrame(main)




// console.log(fc)
