$(document).ready(function() {
    helperFunctions.init()
    centerPiece.init()
    leftPiece.init()
    rightPiece.init()
    controlButtons.init()
})

// Define objects for the centerPiece, leftPiece, and rightPiece
const centerPiece   = {}
centerPiece.scale   = 1
centerPiece.style   = $('div.center-piece')[0].style
centerPiece.height  = $('div.center-piece')[0].clientHeight
centerPiece.width   = $('div.center-piece')[0].clientWidth
centerPiece.offsetX = centerPiece.width / 2
centerPiece.offsetY = centerPiece.height / 2
centerPiece.init    = function() {
    helperFunctions.resetPos(this.style, 0.5, 0.5, this.offsetX, this.offsetY) // start with default position
    helperFunctions.rescale(this.scale)
}

const leftPiece     = {}
leftPiece.style     = $('div.left-piece')[0].style
leftPiece.height    = $('div.left-piece')[0].clientHeight
leftPiece.width     = $('div.left-piece')[0].clientWidth
leftPiece.offsetX   = leftPiece.width / 2
leftPiece.offsetY   = leftPiece.height / 2
leftPiece.init      = function() {
    helperFunctions.resetPos(this.style, 0.2, 0.35, this.offsetX, this.offsetY)
}

const rightPiece    = {}
rightPiece.style    = $('div.right-piece')[0].style
rightPiece.width    = $('div.right-piece')[0].clientWidth
rightPiece.height   = $('div.right-piece')[0].clientHeight
rightPiece.offsetX  = rightPiece.width / 2
rightPiece.offsetY  = rightPiece.height / 2
rightPiece.init     = function() {
    helperFunctions.resetPos(this.style, 0.65, 0.35, this.offsetX, this.offsetY)
}

// helperFunctions object houses the functions to calculate object positions and scale depending on the location of the pointer on the screen
const helperFunctions = {}
helperFunctions.getPointerPos = function() {
    $('body').on('mousemove', function(e) {
        let x = e.clientX
        let y = e.clientY 
        helperFunctions.newPos(x - 0.5*window.innerWidth, y - 0.5*window.innerHeight, centerPiece.style, 0.5, 0.5, centerPiece.offsetX, centerPiece.offsetY, 50)
        helperFunctions.newPos(x - 0.2*window.innerWidth, y - 0.35*window.innerHeight, leftPiece.style, 0.2, 0.35, leftPiece.offsetX, leftPiece.offsetY, 600)
        helperFunctions.newPos(x - 0.65*window.innerWidth, y - 0.35*window.innerHeight, rightPiece.style, 0.65, 0.35, rightPiece.offsetX, leftPiece.offsetY, 200)
    })
}
helperFunctions.newPos = function(x, y, style, horFrac, verFrac, offsetX, offsetY, slowness) {
    style.left = `calc(${ horFrac * 100 }vw - ${ offsetX }px - ${ x / slowness }px)`
    style.top  = `calc(${ verFrac * 100 }vh - ${ offsetY }px - ${ y / slowness }px)`
}
helperFunctions.resetPos = function(style, horFrac, verFrac, offsetX, offsetY) {
    style.left = `${ horFrac * window.innerWidth - offsetX}px`
    style.top  = `${ verFrac * window.innerHeight - offsetY}px`
}
helperFunctions.handleMouseLeave = function() {
    $('body').on('mouseleave', function() {
        resetPos(centerPiece.style, centerPiece.offsetX, centerPiece.offsetY)
        resetPos(centerPiece.style, leftPiece.offsetX, centerPiece.offsetY)
        resetPos(centerPiece.style, rightPiece.offsetX, centerPiece.offsetY)
    })
}
helperFunctions.rescale = function(scale) {
    $('.center-piece').on('wheel', function(e) {
        if (e.originalEvent.deltaY > 0) { scale += 0.1 } //same event but Chrome has +/-100 while Firefox has +/-3 for values
        else { scale -= 0.1 }
        if (scale < 0.5) { scale = 0.5 }
        else if (scale > 2.2) { scale = 2.2 }
        $(this)[0].style.transform = `scale(${ scale })`
        if (scale < 1) {  // allow the leftPiece and rightPiece to scale down with centerPiece but not up
            leftPiece.style.transform = `scale(${ scale })` 
            rightPiece.style.transform = `scale(${ scale })` 
        }
    })
}
helperFunctions.resetScale = function() {
    centerPiece.style.transform = 'scale(1)'
    leftPiece.style.transform = 'scale(1)'
    rightPiece.style.transform = 'scale(1)'
}
helperFunctions.init = function() {
    this.getPointerPos()
}

// Functions governing the behaviours of the control buttons
const controlButtons = {}
controlButtons.toggleBackground = function() {
    $('.toggle').on('click', function() { $('body').toggleClass('background2') })
    $('body').on('keydown', function(e) { if (e.which === 66) { $(this).toggleClass('background2') } })
}
controlButtons.rescaleToDefault = function() {
    $('.rescale').on('click', function() { helperFunctions.resetScale() })
    $('body').on('keydown', function(e) { if (e.which === 82) { helperFunctions.resetScale() } })
}
controlButtons.changeTheme = function() {
    $('.theme').on('click', function() { 
        $('.center-piece').toggleClass('center-alt')
        $('.left-piece').toggleClass('left-alt')
        $('.right-piece').toggleClass('right-alt')
    })
    $('body').on('keydown', function(e) { if (e.which === 84) { 
        $('.center-piece').toggleClass('center-alt')
        $('.left-piece').toggleClass('left-alt')
        $('.right-piece').toggleClass('right-alt')
    } })
}
controlButtons.openModal = function() {
    $('.modal').on('click', function() { $('.overlay')[0].style.display = 'grid' })
}
controlButtons.closeModal = function() {
    $('.close').on('click', function() { $('.overlay')[0].style.display = 'none' })
    $('.overlay').on('click', function() { $('.overlay')[0].style.display = 'none' })
}
controlButtons.init = function() {
    this.toggleBackground()
    this.rescaleToDefault()
    this.changeTheme()
    this.openModal()
    this.closeModal()
}