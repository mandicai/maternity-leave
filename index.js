// TAKEAWAYS
// - You cannot append text (or really anything) to circles directly. You should wrap
// the circle into a group and append the text to the group
// Use the x and y of the circle to set the x and y of the text, not dx or dy.
// Use text-anchor: middle to center the text.
// The function ticked controls how the circles and text change position during
// the force simulation.

// CHART SETUP
let width = 700, height = 700

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

  let lastIndex = -1
  let activeIndex = 0

  // SCROLL SETUP
  let activateFunctions = []
  let updateFunctions = []

  // let bubbleChart = chart(data, industries, color)
  // let countryBubblesVis = countryComparison()

  function setupSections() {
    activateFunctions[0] = function () {
    }
    activateFunctions[1] = function () {
    }
    activateFunctions[2] = function () {
      console.log('hi')
      // if (d3.select('.annotation-group')) { // remove annotations // HACK 
      //   d3.select('.annotation-group').transition().style('opacity', 0).remove()
      // }
    }
    activateFunctions[3] = function() { 
      console.log('hi')
      // bubbleChart.annotate() 
    }
    activateFunctions[4] = function() { 
      console.log('hi')
      // if (d3.select('.annotation-group')) { // remove annotations // HCACK 
      //   d3.select('.annotation-group').transition().style('opacity', 0).remove()
      // }
      // bubbleChart.showTechnology()
    } // rearranges bubbles
    activateFunctions[5] = function () {
      console.log('hi')
    }

    for (var i = 0; i < 6; i++) {
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
      return d.Company + ' maternity-circle'
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
    .style('font-size', '15px')

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
    .attr('class', 'description')

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

    let annotations = [
      {
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
  }
}

function countryComparison() {
  let circleMargin = 75

  let countryLeaves = [    
    { country: 'Norway', maternityLeave: 35, note: '100% of normal pay' },
    { country: 'Finland', maternityLeave: 23, note: '100% of normal pay' },
    { country: 'Denmark', maternityLeave: 18, note: '100% of normal pay' },
    { country: 'Belgium', maternityLeave: 15, note: '80% for 30 days after child birth, 75% for the rest' },
    { country: 'US', maternityLeave: 1, note: 'Nothing' }
  ]

  let color = d3.scaleSequential(d3.interpolatePuBu).domain([0, countryLeaves.length])

  let g = svg.append('g')
    .attr('transform', 'translate(' + circleMargin + ',' + height / 2 + ')')
    .attr('class', 'country-bubble-group')
  
  let countryBubbles = g.selectAll('.country-bubble')
    .data(countryLeaves)
    .enter().append('circle')
    .attr('r', function(d) {
      return 0
    })
    .attr('cx', function(d, i) {
      return width / countryLeaves.length * i
    })
    .attr('fill', function(d, i) {
      return color(i)
    })
    .style('stroke', '#cacbcc')
    .style('stroke-width', '0.3')
    .attr('class', 'country-bubble')
  
  countryBubbles.transition().duration(1000).attr('r', function(d) {
    return d.maternityLeave
  })

  let annotations = countryLeaves.map((country, index) => {
    return {
      note: {
        title: country.country,
        label: country.note,
      },
      subject: {
        radius: country.maternityLeave,
      },
      type: d3.annotationCalloutCircle,
      x: circleMargin + width / countryLeaves.length * index,
      y: height / 2,
      dy: -150,
      dx: 0,
    }
  })

  let makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(annotations)

  let countryAnnotationGroup = svg.append('g')
    .attr('class', 'annotation-group')
    .attr('opacity', 0)
    .call(makeAnnotations)

  countryAnnotationGroup.transition().duration(750).attr('opacity', 1)
}
