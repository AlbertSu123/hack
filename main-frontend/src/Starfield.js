// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import { useTheme } from '@mui/material'

function getAngleRad(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1) % (2 * Math.PI)
}

function getAbsXY(width, height, x_p, y_p) {
  if (!isNaN(width) && !isNaN(height)) {
    const max = Math.max(width, height)
    const clip = (max - Math.min(width, height)) / 2 // frac bounds for diff from center
    let x
    let y
    if (max == width) {
      x = x_p * width
      y = y_p * width - clip
    } else {
      x = x_p * height - clip
      y = y_p * height
    }
    return {
      absX: x,
      absY: y,
    }
  } else {
    return {
      absX: x_p,
      absY: y_p,
    }
  }
}

function drawStar(absX, absY, star, width, height, ctx) {
  if (
    !isNaN(width) &&
    !isNaN(height) &&
    width > 0 &&
    height > 0 &&
    0 <= absX <= width &&
    0 <= absY <= height
  ) {
    ctx.beginPath()
    ctx.arc(absX, absY, star.radius, 0, 360)
    ctx.fillStyle = star.color
    ctx.fill()
  }
}

function euclidDist(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

// Random timer for shooting stars in  milliseconds
function getShootingStarTime() {
  return Math.random() * 1000 + 2000
}

function getSSY(MB, x) {
  return MB[0] * x + MB[1]
}

const Starfield = () => {
  const canvasRef = useRef(null)
  const theme = useTheme()

  useEffect(() => {
    const colors = [theme.palette.primary.main, theme.palette.primary.light]
    const bgColor = '#151520'
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    // Add behind elements.
    context.globalCompositeOperation = 'destination-under'
    // Now draw!
    context.fillStyle = bgColor
    context.fillRect(0, 0, canvas.width, canvas.height)

    let frameCount = 0
    let animationFrameId
    const stars = 400
    const radRate = 0.00025
    const drawnStars = []
    // Fraction of canvas dimensions from the top left

    let start = new Date().getTime()
    let shootingStarTime = getShootingStarTime()
    let hasShootingStar = false
    let shootingStarPos = [0, 0]
    // Move through a fraction of the x-axis each frame
    const sSMoveFrac = 0.005
    // M, B in fractional units
    let shootingStarMB = [0, 0]
    let startLeft = false
    const draw = (ctx, frameCount, colors) => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      let x
      let y
      if (frameCount == 1) {
        for (let i = 0; i < stars; i++) {
          for (let j = 0; j < colors.length; j++) {
            x = Math.random()
            y = Math.random()
            const radius = Math.random() * 1.2
            const star = {
              x: x,
              y: y,
              color: colors[j],
              radius: radius,
            }
            drawnStars.push(star)
            const { absX, absY } = getAbsXY(width, height, x, y)
            drawStar(absX, absY, star, width, height, ctx)
          }
        }
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = bgColor
        context.fillRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < drawnStars.length; i++) {
          const prevX = drawnStars[i].x
          const prevY = drawnStars[i].y
          const newRad = getAngleRad(0.5, 0.5, prevX, prevY) + radRate
          // Radius from the center
          const centerRad =
            euclidDist(prevX, prevY, 0.5, 0.5) + (Math.random() - 0.5) * 0.0005
          x = centerRad * Math.cos(newRad) + 0.5
          y = centerRad * Math.sin(newRad) + 0.5
          drawnStars[i] = {
            x: x,
            y: y,
            color: drawnStars[i].color,
            radius: drawnStars[i].radius,
          }
          const { absX, absY } = getAbsXY(width, height, x, y)
          drawStar(absX, absY, drawnStars[i], width, height, ctx)
        }
        // Handle shooting star
        const curr = new Date().getTime()
        if (!hasShootingStar && curr - start >= shootingStarTime) {
          hasShootingStar = true
          const randXs = [Math.random(), Math.random()]
          const randYs = [Math.random(), Math.random()]
          const grad = (randYs[1] - randYs[0]) / (randXs[1] - randXs[0])
          const b = randYs[0] - grad * randXs[0]
          shootingStarMB = [grad, b]
          startLeft = Math.random() >= 0.5
          if (startLeft) {
            shootingStarPos = [-sSMoveFrac, getSSY(shootingStarMB, -sSMoveFrac)]
          } else {
            shootingStarPos = [
              1 + sSMoveFrac,
              getSSY(shootingStarMB, 1 + sSMoveFrac),
            ]
          }
        }

        if (hasShootingStar) {
          let newX
          let starX
          if (startLeft) {
            newX = shootingStarPos[0] + sSMoveFrac
            starX = newX + 0.001
          } else {
            newX = shootingStarPos[0] - sSMoveFrac
            starX = newX - 0.001
          }
          shootingStarPos = [newX, getSSY(shootingStarMB, newX)]
          const starPos = [starX, getSSY(shootingStarMB, starX)]
          ctx.beginPath()
          ctx.ellipse(
            shootingStarPos[0] * width,
            shootingStarPos[1] * height,
            Math.random() * 5 + 3,
            1.2,
            Math.atan(shootingStarMB[0] * (height / width)),
            0,
            360,
          )
          ctx.fillStyle = colors[1]
          ctx.fill()
          ctx.beginPath()
          ctx.arc(starPos[0] * width, starPos[1] * height, 2.5, 0, 360)
          ctx.fillStyle = colors[0]
          ctx.fill()
        }

        if (
          hasShootingStar &&
          !(
            -0.1 <= shootingStarPos[0] &&
            shootingStarPos[0] <= 1.1 &&
            -0.1 <= shootingStarPos[1] &&
            shootingStarPos[1] <= 1.1
          )
        ) {
          hasShootingStar = false
          start = new Date().getTime()
          shootingStarTime = getShootingStarTime()
        }
      }
    }

    //Our draw came here
    const render = () => {
      frameCount++
      draw(context, frameCount, colors)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.palette])

  return <canvas ref={canvasRef} />
}

export default Starfield
