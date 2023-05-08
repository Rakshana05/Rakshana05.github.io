const foodColors = ["green","blue","orange","red","purple","violet","pink","grey"];
const cBox = document.getElementsByClassName("c")

//generate random sequence of 4 colors
const colorSeq = () => {
    let compSeq = []
    cpFood = foodColors
    for(let i=0;i<4;i++){
        const shuffled = cpFood.sort(()=> 0.5 -Math.random())
        let food = cpFood.shift()
        compSeq.push(food)
    }
    return compSeq
}

// Update random colors to cSeq
cSeq=colorSeq()
for(i=0;i<4;++i){
    cBox[i].style.backgroundColor=cSeq[i]
}

//make snake with len 3
let snakeBody = [
    {x:1,y:1}
]

//update time
const time = document.querySelector(".time")
setInterval(
    ()=> {
        let n = time.innerHTML 
        time.innerHTML = n-1
    },1000
)
    

//animation to run every 1/5 seconds
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

const update = () => {
    // update snake
    // const direction = {x: 0,y:0}
    const direction = getDirection()
    for( i =1;i>=0;i--){
        snakeBody[i+1] = {...snakeBody[i]}
    }

    snakeBody[0].x+=direction.x
    snakeBody[0].y+=direction.y
    // console.log(snakeBody)

    //update food
    // let food = randomGridPosition()


    //check death
    const outside = pos => {
        return( pos.x<1 || pos.x > 21 || pos.y<1 || pos.y >21 )
    }
    const timeup = () => {
        return(time.innerHTML == 0)
    }
    gameOver = outside(snakeBody[0])||timeup()
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
    // const foodElement = document.createElement('div')
    // foodElement.style.gridRowStart = food.y
    // foodElement.style.gridColumnStart = food.x
    // foodElement.classList.add('food')
    // gameBoard.appendChild(foodElement)
}

// avoid food place on snake
// avoided ------ learn ----------- ignore head
const onSnake = position => {
    return snakeBody.some((segment,index) => {
        if(index===0) return false
        return (
            segment.x === position.x &&
            segment.y === position.y
        )
    })
}


// input direction from keypress
// check 180 deg not allowed
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



const getRandomFoodPosition = () => {
    let newFoodPosition
    let foodPlaces = []
    console.log(foodPlaces.length)
    while(foodPlaces.length <= 4){
        console.log("in")
        while((!(newFoodPosition in foodPlaces)) && (newFoodPosition==null || onSnake(newFoodPosition) )){
            newFoodPosition = {
                x: Math.floor(Math.random()*21)+1,
                y: Math.floor(Math.random()*21)
            }
            foodPlaces.push(newFoodPosition)
        }
    }
    return foodPlaces
}

console.log(getRandomFoodPosition())
