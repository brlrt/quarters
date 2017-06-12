import React, { Component } from 'react'
import './App.css'
import Hammer from 'hammerjs'
import { SketchPicker } from 'react-color'
import reactCSS from 'reactcss'
import tinycolor from 'tinycolor2'

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
      displayColorPickers: true,
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
      return rand(this.state.colors.slice(0, 4))
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
        { this.state.displayColorPickers ? <div className="color-pickers">
          <ColorPicker color={tinycolor(this.state.colors[0]).toRgb()} disableAlpha={true}
            handleChange={ (color) => {
                const result = this.state.colors.slice()
                result[0] = color.hex
                this.setState({colors: result}) 
              }
            } />
          <ColorPicker color={tinycolor(this.state.colors[1]).toRgb()} disableAlpha={true}
            handleChange={ (color) => {
                const result = this.state.colors.slice()
                result[1] = color.hex
                this.setState({colors: result}) 
              }
            } />
          <ColorPicker color={tinycolor(this.state.colors[2]).toRgb()} disableAlpha={true}
            handleChange={ (color) => {
                const result = this.state.colors.slice()
                result[2] = color.hex
                this.setState({colors: result}) 
              }
            } />
          <ColorPicker color={tinycolor(this.state.colors[3]).toRgb()} disableAlpha={true}
            handleChange={ (color) => {
                const result = this.state.colors.slice()
                result[3] = color.hex
                this.setState({colors: result}) 
              }
            } />
            </div> : null
        } 
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

  handleSave () {
    const svgData = document.getElementsByTagName('svg')[0].outerHTML   
    const link = document.createElement('a')
    
    var svgBlob = new Blob([svgData], { type:"image/svg+xml;charset=utf-8" })
    var svgURL = URL.createObjectURL(svgBlob)
    link.href = svgURL 

    link.setAttribute('download', `quarters.svg`)
    link.click()
  }

  handleKeydown (ev) {
    if (ev.which === 67) {
      ev.preventDefault()
      this.setState({displayColorPickers: !this.state.displayColorPickers})
    } else if (ev.which === 83 && (ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault()
      this.handleSave()
    } else if (ev.which === 82 && !(ev.metaKey || ev.ctrlKey)) {
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

class ColorPicker extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      color: props.color,
      displayColorPicker: props.displayColorPicker,
      disableAlpha: props.disableAlpha
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
    if (this.props.handleClose) {
      this.props.handleClose()
    }
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb })
    this.props.handleChange(color)
  };

  render () {

    const styles = reactCSS({
      'default': {
        color: {
          background: this.state.disableAlpha ?
                `rgb(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b })` :
                `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b },  ${ this.state.color.a })`,
        },
        popover: {
          position: 'absolute',
          zIndex: '10',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    })

    return (
      <div className='color-picker'>
        <div className='swatch' onClick={ this.handleClick }>
          <div className='color' style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange } disableAlpha={this.state.disableAlpha} />
        </div> : null }
      </div>
    )
  }
}

export default App;
