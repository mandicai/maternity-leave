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

  let color = d3.scaleSequential(d3.interpolateBuPu).domain([0, industries.length + 2])

  let lastIndex = -1
  let activeIndex = 0

  let activateFunctions = []
  let updateFunctions = []

  chartDisplay(data, industries, color)
  countryComparisonDisplay()
  annotateDisplay()
  averageDisplay(data)

  function setupSections() {
    activateFunctions[0] = function () {
      setupBubbleChart()
    }
    activateFunctions[1] = function () {
      showCountries()
    }
    activateFunctions[2] = function () {
      setupBubbleChart()
    }
    activateFunctions[3] = function() { 
      showAnnotations()
    }
    activateFunctions[4] = function() { 
      showLarger()
    }
    activateFunctions[5] = function () {
      showSmaller()
    }
    activateFunctions[6] = function () {
      showAverage()
    }
    activateFunctions[7] = function () {
    }

    for (var i = 0; i < 8; i++) {
      updateFunctions[i] = function () {}
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
        return i === index ? 1 : 0.1
      })

    activate(index)
  })

  scroll.on('progress', function (index, progress) {
    update(index, progress)
  })
})

// CHART CREATION
function chartDisplay(data, industries, color) {
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
    .attr('class', function (d) {
      return d.Company + ' maternity-circle'
    })

  bubbles.transition().duration(2000).attr('r', function (d) {
    return d.MaternityLeave
  })

  let labels = d3.selectAll('.maternity-bubble')
    .append('g')
    .attr('class', 'maternity-text')

  let numbers = labels.append('text')
    .attr('x', function (d) {
      return d.x
    })
    .attr('y', function (d) {
      return d.y
    })
    .attr('dy', 4)
    .text(function (d) {
      if (d.MaternityLeave != 0) {
        return d.MaternityLeave
      }
    })
    .attr('class', 'numbers-text')

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
    .attr('transform', 'translate(' + 0 + ',' + 20 + ')')
    .attr('class', 'description')

  let companyName = g.append('text')
    .attr('class', 'company-name')
    .style('opacity', 1)

  let companyNumber = g.append('text')
    .attr('dy', 20)
    .attr('class', 'company-number')
    .style('opacity', 1)

  let companyIndustry = g.append('text')
    .attr('dy', 40)
    .attr('class', 'company-industry')
    .style('opacity', 1)

  d3.selectAll('.maternity-bubble').on('mouseover', function (d) {
    d3.select(this).transition().style('opacity', 0.5)
    companyName.text(d.Company)
    companyNumber.text('Maternity Leave: ' + d.MaternityLeave)
    companyIndustry.text('Industry: ' + d.Industry)
    d3.select('.description').transition().style('opacity', 1)
  })

  d3.selectAll('.maternity-bubble').on('mouseout', function (d) {
    d3.select(this).transition().style('opacity', 1)
    d3.select('.description').transition().style('opacity', 0)
  })
}

function averageDisplay(data) {
  let average = calculateAvg(data)

  let g = svg.append('g')
    .attr('class', 'average-group')

  let groupX = width / 2 - (g.node().getBBox().width / 2)

  g.attr('transform', 'translate(' + groupX + ',' + height / 2 + ')')

  g.append('text')
    .text(average.toString())
    .attr('class', 'average')

  g.append('text')
    .text('Average number weeks paid maternity leave').attr('dy', 30)
    .attr('class', 'subtext')
}

function countryComparisonDisplay() {
  let circleMargin = 75

  let countryLeaves = [{
      country: 'Norway',
      maternityLeave: 35,
      note: '100% of normal pay'
    },
    {
      country: 'Finland',
      maternityLeave: 23,
      note: '100% of normal pay'
    },
    {
      country: 'Denmark',
      maternityLeave: 18,
      note: '100% of normal pay'
    },
    {
      country: 'Belgium',
      maternityLeave: 15,
      note: '80% for 30 days after child birth, 75% for the rest'
    },
    {
      country: 'USA',
      maternityLeave: 1,
      note: '0%'
    }
  ]

  let color = d3.scaleSequential(d3.interpolatePuRd).domain([0, countryLeaves.length])

  let g = svg.append('g')
    .attr('transform', 'translate(' + circleMargin + ',' + height / 2 + ')')
    .attr('class', 'country-bubble-group')

  let countryBubbles = g.selectAll('.country-bubble')
    .data(countryLeaves)
    .enter().append('g').attr('class', 'country-bubble')
    .append('circle')
    .attr('r', function (d) {
      return 0
    })
    .attr('cx', function (d, i) {
      return width / countryLeaves.length * i
    })
    .attr('fill', function (d, i) {
      return color(i)
    })
    .attr('class', 'country-circle')

  d3.selectAll('.country-circle').transition().duration(750).attr('r', function (d) {
    return d.maternityLeave
  })

  d3.selectAll('.country-bubble').append('g')
    .append('text')
    .attr('x', function (d, i) {
      return width / countryLeaves.length * i
    })
    .attr('dx', -9.5)
    .attr('dy', 4)
    .text(function (d) {
      if (d.country !== 'USA') {
        return d.maternityLeave
      }
    })
    .attr('class', 'countries-text')

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
    .attr('class', 'country-annotation-group')
    .attr('opacity', 0)
    .call(makeAnnotations)

  countryAnnotationGroup.transition().duration(750).attr('opacity', 1)
}

function setupBubbleChart() {
  d3.select('.average-group').attr('display', 'none')
  d3.select('.maternity-annotation-group').attr('display', 'none')
  d3.selectAll('.maternity-bubble').attr('display', 'initial')
  d3.selectAll('.maternity-circle').attr('r', 0)
  d3.selectAll('.maternity-circle').transition().duration(750).attr('r', function (d) {
    return d.MaternityLeave
  })
  d3.select('.country-bubble-group').attr('display', 'none')
  d3.select('.country-annotation-group').attr('display', 'none')
}

function showCountries() {
  d3.selectAll('.maternity-bubble').attr('display', 'none')
  d3.select('.country-bubble-group').attr('display', 'initial')
  d3.selectAll('.country-circle').attr('r', 0)
  d3.selectAll('.country-circle').transition().duration(750).attr('r', function (d) {
    return d.maternityLeave
  })
  d3.select('.country-annotation-group').attr('display', 'initial')
}

function showAnnotations() {
  d3.selectAll('.maternity-bubble').attr('display', 'initial')
  d3.select('.maternity-annotation-group').attr('display', 'initial')
  d3.select('.maternity-annotation-group').attr('opacity', '0')
  d3.select('.maternity-annotation-group').transition().duration(750).attr('opacity', '1')
}

function showLarger() {
  d3.select('.maternity-annotation-group').attr('display', 'none')

  d3.selectAll('.maternity-bubble').attr('display', function (d) {
    if (d.MaternityLeave <= 30) {
      return 'none'
    }
  })
}

function showSmaller() {
  d3.selectAll('.maternity-bubble').attr('display', 'initial')
  d3.select('.average-group').attr('display', 'none')

  d3.selectAll('.maternity-bubble').attr('display', function (d) {
    if (d.MaternityLeave >= 15) {
      return 'none'
    }
  })
}

function showAverage() {
  d3.select('.average-group').attr('display', 'initial')
  d3.selectAll('.maternity-bubble').attr('display', 'none')
  d3.select('.average-group').attr('opacity', '0')
  d3.select('.average-group').transition().duration(750).attr('opacity', '1')
}

function annotateDisplay() {
  let annotations = [{
      note: {
        title: 'Netflix',
      },
      subject: {
        radius: 0,
      },
      type: d3.annotationCalloutCircle,
      x: 445.001,
      y: 172.018,
      dy: -120,
      dx: 120,
    },
    {
      note: {
        title: 'Bill and Melinda Gates Foundation',
      },
      subject: {
        radius: 0,
      },
      type: d3.annotationCalloutCircle,
      x: 238.795,
      y: 308.574,
      dy: 250,
      dx: -100,
    }
  ]

  let makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(annotations)

  let annotationGroup = svg.append('g')
    .attr('class', 'maternity-annotation-group')
    .attr('opacity', 0)
    .call(makeAnnotations)

  annotationGroup.transition().duration(750).attr('opacity', 1)
}

function calculateAvg(array) {
  let sum = 0
  let count = array.length
  for (let i = 0; i < count; i++) {
    sum = sum + parseFloat(array[i].MaternityLeave)
  }
  let average = sum / count
  return Math.round(average * 10) / 10
}

