// TAKEAWAYS
// - You cannot append text (or really anything) to circles directly. You should wrap
// the circle into a group and append the text to the group
// Use the x and y of the circle to set the x and y of the text, not dx or dy.
// Use text-anchor: middle to center the text.
// The function ticked controls how the circles and text change position during
// the force simulation.

// CHART SETUP
let width = 600, height = 600

let svg = d3.select('#maternity-bubble-chart')
  .append('svg')
  .attr('viewBox', '0 0' + ' ' + width + ' ' + height)

d3.csv('maternity-data.csv').then(data => {
 let industries = []
  data.forEach(datum => {
    if (!industries.includes(datum.Industry)) {
      industries.push(datum.Industry)
    }
  })

  let color = d3.scaleSequential(d3.interpolatePuRd).domain([0, industries.length + 2])
  
  let bubbleChart = chart(data, industries, color)

  let lastIndex = -1
  let activeIndex = 0

  // SCROLL SETUP
  let activateFunctions = []
  let updateFunctions = []

  function setupSections() {
    activateFunctions[0] = function () {
      if (d3.select('.annotation-group')) { // remove annotations // HCACK 
        d3.select('.annotation-group').transition().style('opacity', 0).remove()
      }
    }
    activateFunctions[1] = chart.annotate
    activateFunctions[2] = function() { 
      if (d3.select('.annotation-group')) { // remove annotations // HCACK 
        d3.select('.annotation-group').transition().style('opacity', 0).remove()
      }
      chart.showTechnology()
    } // rearranges bubbles
    activateFunctions[3] = function () {
      console.log('hi')
    }
    activateFunctions[4] = function () {
      console.log('hi')
    }

    for (var i = 0; i < 5; i++) {
      updateFunctions[i] = function () {};
    }
  }

  setupSections()

  function activate(index) {
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1

    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign)

    scrolledSections.forEach(function (i) {
      activateFunctions[i]()
    })

    lastIndex = activeIndex
  }

  function update(index, progress) {
    updateFunctions[index](progress)
  }

  let scroll = scroller().container(d3.select('.content'))

  scroll(d3.selectAll('.step'))

  scroll.on('active', function (index) {
    d3.selectAll('.step')
      .transition()
      .style('opacity', function (d, i) {
        return i === index ? 1 : 0.1;
      })

    activate(index)
  })

  scroll.on('progress', function (index, progress) {
    update(index, progress)
  })
})

// CHART CREATION
let chart = function chart(data, industries, color) {
  let nodes = data

  // BUBBLE FORCE CREATION
  let simulation = d3.forceSimulation(data) // creates simulation
    .force('charge', d3.forceManyBody().strength(-0.5)) // applies attraction or repelling force
    .force('center', d3.forceCenter(width / 2, height / 2)) // pulls points towards a center
    .force('collision', d3.forceCollide().radius(function (d) {
      return d.MaternityLeave
    }))
    .on('tick', ticked)

  let bubbles = svg.selectAll('.maternity-bubble')
    .data(data)
    .enter().append('g').attr('class', 'maternity-bubble')
    .append('circle')
    .attr('r', function (d) {
      return 0
    })
    .style('fill', function (d, i) {
      let index = industries.indexOf(d.Industry)
      return color(index)
    })
    .style('stroke', '#cacbcc')
    .style('stroke-width', '0.3')
    .attr('class', function (d) {
      return d.Company
    })

  bubbles.transition().duration(2000).attr('r', function (d) {
    return d.MaternityLeave
  })

  let labels = d3.selectAll('.maternity-bubble')
    .append('g')

  let numbers = labels.append('text')
    .attr('x', function (d) {
      return d.x
    })
    .attr('y', function (d) {
      return d.y
    })
    .attr('dy', 4)
    .style('text-anchor', 'middle')
    .text(function (d) {
      if (d.MaternityLeave != 0) {
        return d.MaternityLeave
      }
    })
    .style('font-size', '17px')

  function ticked() {
    bubbles.attr('cx', function (d) {
        return d.x
      })
      .attr('cy', function (d) {
        return d.y
      })

    numbers.attr('x', function (d) {
        return d.x
      })
      .attr('y', function (d) {
        return d.y
      })

    bubbles.exit().remove()
    labels.exit().remove()
    numbers.exit().remove()
  }

  let g = svg.append('g')
    .attr('transform', 'translate(' + 0 + ',' + 10 + ')')

  let companyName = g.append('text')
    .style('font-size', '15px')
    .style('font-family', 'Times New Roman')
    .style('font-weight', 700)
    .style('opacity', 0)

  let companyNumber = g.append('text')
    .attr('dy', 20)
    .attr('font-size', '12px')
    .style('opacity', 0)

  let companyIndustry = g.append('text')
    .attr('dy', 40)
    .attr('font-size', '12px')
    .style('opacity', 0)

  d3.selectAll('.maternity-bubble').on('mouseover', function (d) {
    d3.select(this).transition().style('opacity', 0.5)
    companyName.text(d.Company).transition().style('opacity', 1)
    companyNumber.text('Maternity Leave: ' + d.MaternityLeave).transition().style('opacity', 1)
    companyIndustry.text('Industry: ' + d.Industry).transition().style('opacity', 1)
  })

  d3.selectAll('.maternity-bubble').on('mouseout', function (d) {
    d3.select(this).transition().style('opacity', 1)
    companyName.transition().style('opacity', 0)
    companyNumber.transition().style('opacity', 0)
    companyIndustry.transition().style('opacity', 0)
  })

  chart.annotate = function() {
    d3.selectAll('.maternity-bubble').transition().duration(2000).attr('display', function (d) {
      if (d.MaternityLeave <= 30) {
        return 'initial'
      }
    })

    let annotations = [{
        note: {
          title: 'Netflix',
        },
        subject: {
          radius: 0,
        },
        type: d3.annotationCalloutCircle,
        x: 386.50266781773155,
        y: 240.6228904261989,
        dy: -150,
        dx: 150,
      },
      {
        note: {
          title: 'Bill and Melinda Gates Foundation',
        },
        subject: {
          radius: 0,
        },
        type: d3.annotationCalloutCircle,
        x: 192.72,
        y: 331.512,
        dy: 150,
        dx: -50,
      }
    ]

    let makeAnnotations = d3.annotation()
      .type(d3.annotationLabel)
      .annotations(annotations)

    let annotationGroup = svg.append('g')
      .attr('class', 'annotation-group')
      .attr('opacity', 0)
      .call(makeAnnotations)

    annotationGroup.transition().duration(750).attr('opacity', 1)
  }

  chart.showTechnology = function() {
    d3.selectAll('.maternity-bubble').transition().duration(2000).attr('display', function(d) {
      if (d.MaternityLeave <= 30) {
        return 'none'
      }
    })

    // let margin = {
    //   top: 50,
    //   bottom: 50,
    //   right: 50,
    //   left: 50
    // }

    // let categories = ['>= 50', '>= 40', '>= 30', '>= 20', '>= 10']

    // let y = d3.scalePoint()
    //   .rangeRound([0, 500])
    //   .domain(categories)

    // let scale = svg.append("g")
    //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // scale.append("g")
    //   .attr("class", "axis axis--y")
    //   .call(d3.axisLeft(y))

    // //GRID LINES
    // function yGridlines() {
    //   return d3.axisLeft(y)
    // }

    // let grid = svg.append('g')
    //   .attr('class', 'grid')
    //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //   .call(yGridlines()
    //     .tickSize(-500)
    //     .tickFormat('')
    //   )
    //   .attr("color", "#cacbcc")

    // scale.selectAll('.domain').remove()
    // scale.selectAll('.tick line').remove()

    // grid.selectAll('.domain').remove()

    // function yCenter(value) {
    //   if (value < 10) {
    //     return 16.5 + y.step() * 5
    //   } else if (value >= 10 && value < 20) {
    //     return 16.5 + y.step() * 5
    //   } else if (value >= 20 && value < 30) {
    //     return 16.5 + y.step() * 4
    //   } else if (value >= 30 && value < 40) {
    //     return 16.5 + y.step() * 3
    //   } else if (value >= 40 && value < 50) {
    //     return 16.5 + y.step() * 2
    //   } else if (value >= 50) {
    //     return 16.5 + y.step()
    //   }
    // }

    // simulation.force('y', d3.forceY().y(function(d) {
    //   return yCenter(d.MaternityLeave)
    // }).strength(0.5))

    // simulation.force('center', d3.forceCenter(600 / 2, 600/ 1.5))

    // simulation.alpha(0.5).restart()

    // let gridCenters = {}
    // let gridDimensions = {
    //   "rows": 6,
    //   "columns": 2
    // }
    // let groups = industries.length

    // for (let i = 0; i < groups; i++) {
    //   let curRow = Math.floor(i / gridDimensions.columns)
    //   let curCol = i % gridDimensions.columns

    //   let currentCenter = {
    //     x: (2 * curCol + 1) * (width / (gridDimensions.columns * 2)),
    //     y: (2 * curRow + 1) * (height / (gridDimensions.rows * 2))
    //   }

    //   gridCenters[industries[i]] = currentCenter
    // }

    // let targetForceX = d3.forceX(function (d) {
    //   if (gridCenters[d.Industry]) {
    //     return gridCenters[d.Industry].x * 1.5
    //   } else {
    //     return 0
    //   }
    // }).strength(0.5)
    // let targetForceY = d3.forceY(function (d) {
    //   if (gridCenters[d.Industry]) {
    //     return gridCenters[d.Industry].y * 1.5
    //   } else {
    //     return 0
    //   }
    // }).strength(0.5)

    // simulation.force('x', targetForceX).force('y', targetForceY)
  }
}

