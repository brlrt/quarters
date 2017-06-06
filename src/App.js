import React, { Component } from 'react'
import './App.css'
import Hammer from 'hammerjs'

const colorSet1 = [
  'rgb(239, 191, 194)', // pink
  'rgb(51,52,54)', // black
  'rgb(217,222,225)', // grey
  'rgb(232,234,228)',  //tan
  'rgb(242,242,242)' //white
]

const colorSet3 = [
  'rgb(243, 145, 160)', // hotpink
 'rgb(242, 116, 184)', // other pink
 'rgb(73, 176, 194)',
 'rgb(38, 95, 200)',
 'rgb(221, 237, 173)',
 'rgb(50, 40, 95)'
]

const colorSet = [
  '#edeae6',
  'pink',
  '#181c16',
  '#cf0015',
]

const colors = colorSet

class App extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      dimension: 3,
      colors: colors.concat('transparent'),
      fillColors: colors,
      padding: 60
    }
  }

  render() {

    const repeat = (fn, n) => {
      return Array(n).fill(0).map(fn)
    }
    
    const rand = (colSet) => {
      colSet = colSet || this.state.colors
      return colSet[Math.floor(Math.random() * colSet.length)]
    }

    const randFill = () => {
      return rand(this.state.fillColors)
    }

    const genColorArray = n => repeat(() => repeat(rand, n), n)
    const genFillColorArray = n => repeat(() => repeat(randFill, n), n)
    
    const colorArray = genColorArray(this.state.dimension)

    const minorArray = this.state.dimension <= 1 ? [] : genFillColorArray(this.state.dimension-1)

    const circles = colorArray.map((columns, i) => {
      const circleRow = columns.map((element, j) => {

        const leftEdge = i ===  0
        const rightEdge = i === (colorArray.length - 1)
        const topEdge = j === 0
        const bottomEdge = j === columns.length - 1

        const topLeftCorner = leftEdge && topEdge
        const topRightCorner = rightEdge && topEdge
        const bottomRightCorner = rightEdge && bottomEdge
        const bottomLeftCorner = bottomEdge && leftEdge

        let firstColor
        let secondColor
        let thirdColor
        let fourthColor

        if (this.state.dimension === 1) {
          firstColor = rand()
          secondColor = rand()
          thirdColor = rand()
          fourthColor = rand()
        } else if (topRightCorner) {
          firstColor = rand()
          secondColor = rand()
          thirdColor = minorArray[i - 1][0]
          fourthColor = rand()
        } else if (topLeftCorner) {
          firstColor = rand()
          secondColor = rand()
          thirdColor = rand()
          fourthColor = minorArray[0][0]
        } else if (bottomLeftCorner) {
          firstColor = minorArray[0][j-1]
          secondColor = rand()
          thirdColor = rand()
          fourthColor = rand()
        } else if (bottomRightCorner) {
          firstColor = rand()
          secondColor = minorArray[i -1][j-1]
          thirdColor = rand()
          fourthColor = rand()
        } else if (leftEdge) {
          firstColor  = minorArray[0][j-1]
          secondColor = rand()
          thirdColor = rand()
          fourthColor = minorArray[0][j]
        } else if (topEdge) {
          firstColor = rand()
          secondColor = rand()
          thirdColor = minorArray[i-1][0]
          fourthColor = minorArray[i][0]
        } else if (bottomEdge) {
          firstColor = minorArray[i][j-1]
          secondColor = minorArray[i-1][j-1]
          thirdColor = rand()
          fourthColor = rand()
        } else if (rightEdge) {
          firstColor = rand()
          secondColor = minorArray[i-1][j-1]
          thirdColor = minorArray[i-1][j]
          fourthColor = rand()
        } else {
          firstColor = minorArray[i][j-1]
          secondColor = minorArray[i-1][j-1]
          thirdColor = minorArray[i-1][j]
          fourthColor = minorArray[i][j]
        }

        return (
          <g data-id={`${i}-${j}`} key={j}>
            <path fill={firstColor}
              d={`M ${0.5 + i},${0 + j}
                  L ${0.5 + i},${0.5 + j}
                  L ${1 + i},${0.5 + j}
                  A ${0.5},${0.5} 0 0 0 ${0.5 + i},${0 + j}`} />

              <path fill={secondColor}
                d={`M ${0 + i}, ${0.5 + j}
                  L ${0.5+i},${0.5 + j}
                  L ${0.5+i},${0 + j}
                  A 0.5,0.5 0 0 0 ${0+i},${0.5 + j}`} />

              <path fill={thirdColor}
                d={`M ${0.5+i},${1+j} 
                    L ${0.5+i},${0.5 + j}
                    L ${0 +i},${0.5 + j}
                    A 0.5,0.5 0 0 0 ${0.5 + i},${1 + j}`} />

              <path fill={fourthColor}
                d={`M ${1 + i}, ${0.5 + j}
                    L ${0.5+i},${0.5 + j}
                    L ${0.5+i},${1+j}
                    A 0.5,0.5 0 0 0 ${1+i},${0.5 + j}`} />
          </g>
        );
      });
      return (
        <g data-row={i} key={i}>
          {circleRow}
        </g>
      );
    });


    return (
      <div className="App" style={{ padding: this.state.padding }}>
        <svg viewBox={`0 0 ${this.state.dimension} ${this.state.dimension}`} width={this.state.width-2*this.state.padding} height={this.state.height-2*this.state.padding}>
          <rect width={this.state.dimension} height={this.state.dimension} fill='#ffffff' />
          <g>{circles}</g>
        </svg>
      </div>
    );
  }

  componentWillMount () {
    this.updateDimensions()
  }

  componentDidMount () {
    window.addEventListener("resize", this.updateDimensions.bind(this), true)
    window.addEventListener('keydown', this.handleKeydown.bind(this), true)

    const mc = new Hammer(document, { preventDefault: true })

    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL })
    mc.get('pinch').set({ enable: true })

    mc.on("swipedown", ev => this.addPiece())
      .on("swipeup", ev => this.removePiece())
  }

  handleKeydown (ev) {
    if (ev.which === 67) {
      ev.preventDefault()
    } else if (ev.which === 82) {
      ev.preventDefault()
      this.forceUpdate()
    } else if (ev.which === 40) {
      ev.preventDefault()
      this.removePiece()
    } else if (ev.which === 38) {
      ev.preventDefault()
      this.addPiece()
    }
  }

  removePiece () {
    this.setState({dimension: Math.max(this.state.dimension-1, 1) })
  }

  addPiece () {
    this.setState({dimension: Math.min(this.state.dimension+1, 200) })
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.updateDimensions.bind(this), true)
    window.removeEventListener('keydown', this.handleKeydown.bind(this), true)
  }

  updateDimensions () {
    const w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0]
    
    const width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight

    const dim = Math.min(width, height)
    const settings = { width: dim , height: dim }

    this.setState(settings)
  }
}

export default App;
