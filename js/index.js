// TAKEAWAYS
// - You cannot append text (or really anything) to circles directly. You should wrap
// the circle into a group and append the text to the group
// Use the x and y of the circle to set the x and y of the text, not dx or dy.
// Use text-anchor: middle to center the text.
// The function ticked controls how the circles and text change position during
// the force simulation.

// CHART SETUP
let width = 1150,
  height = 1150

let svg = d3.select('#maternity-bubble-chart')
  .append('svg')
  .attr('viewBox', '0 0' + ' ' + width + ' ' + height)

d3.json('data/maternity-leave.json').then(data => {
  let industries = []

  data.forEach(datum => {
    if (!industries.includes(datum.Industry)) {
      industries.push(datum.Industry)
    }
  })

  let color = d3.scaleSequential(d3.interpolatePuRd).domain([0, industries.length])

  let lastIndex = -1
  let activeIndex = 0

  let activateFunctions = []
  let updateFunctions = []

  chartDisplay(data, industries, color)
  tableDisplay()
  countryComparisonDisplay()
  annotateDisplay()
  largerPercentageDisplay()
  smallerPercentageDisplay()
  averageDisplay(data)

  function setupSections () {
    activateFunctions[0] = function () {
      setupBubbleChart()
    }
    activateFunctions[1] = function () {
      showCountries()
    }
    activateFunctions[2] = function () {
      setupBubbleChart()
    }
    activateFunctions[3] = function () {
      showAnnotations()
    }
    activateFunctions[4] = function () {
      showLarger()
    }
    activateFunctions[5] = function () {
      showLargerPercentage()
    }
    activateFunctions[6] = function () {
      showSmaller()
    }
    activateFunctions[7] = function () {
      showSmallerPercentage()
    }
    activateFunctions[8] = function () {
      showTable()
    }
    activateFunctions[9] = function () {
      showAverage()
    }
    activateFunctions[10] = function () {
      d3.select('.average-group').style('display', 'none')
    }

    for (var i = 0; i < 11; i++) {
      updateFunctions[i] = function () {}
    }
  }

  setupSections()

  function activate (index) {
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1

    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign)

    scrolledSections.forEach(function (i) {
      activateFunctions[i]()
    })

    lastIndex = activeIndex
  }

  function update (index, progress) {
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

let lighterBubbles = false

function setupBubbleChart () {
  d3.select('.average-group').style('display', 'none')
  d3.select('.larger-percentage-group').style('display', 'none')
  d3.select('.smaller-percentage-group').style('display', 'none')
  d3.select('.maternity-annotation-group').style('display', 'none')
  d3.selectAll('.maternity-bubble').style('display', 'initial')
  d3.selectAll('.maternity-circle').attr('r', 0)
  d3.selectAll('.maternity-circle').transition().duration(750).attr('r', function (d) {
    return d.MaternityLeave
  })
  d3.select('.country-bubble-group').style('display', 'none')
  d3.select('.country-annotation-group').style('display', 'none')
}

function showCountries () {
  d3.selectAll('.maternity-bubble').style('display', 'none')
  d3.select('.country-bubble-group').style('display', 'initial')
  d3.selectAll('.country-circle').attr('r', 0)
  d3.selectAll('.country-circle').transition().duration(750).attr('r', function (d) {
    return d.maternityLeave
  })
  d3.select('.country-annotation-group').style('display', 'initial')
}

function showAnnotations () {
  d3.selectAll('.maternity-bubble').style('display', 'initial')
  d3.select('.maternity-annotation-group').style('display', 'initial')
  d3.select('.maternity-annotation-group').attr('opacity', '0')
  d3.select('.maternity-annotation-group').transition().duration(750).attr('opacity', '1')
}

function showLarger () {
  lighterBubbles = false

  d3.select('.maternity-annotation-group').style('display', 'none')
  d3.select('.larger-percentage-group').style('display', 'none')

  d3.selectAll('.maternity-bubble')
    .style('display', function (d) {
      if (d.MaternityLeave <= 25) {
        return 'none'
      } else {}
    })
    .transition().duration(750).attr('opacity', function (d) {
      if (d.MaternityLeave >= 25) {
        return 1
      } else {}
    })
}

function showLargerPercentage () {
  lighterBubbles = true

  d3.select('.larger-percentage-group').style('display', 'initial')
  d3.select('.larger-percentage-group').attr('opacity', '0')
  d3.select('.larger-percentage-group').transition().duration(750).attr('opacity', '1')

  d3.selectAll('.maternity-bubble')
    .style('display', function (d) {
      if (d.MaternityLeave <= 25) {
        return 'none'
      } else {}
    })
    .transition().duration(750).attr('opacity', function (d) {
      if (d.MaternityLeave >= 25) {
        return 0.3
      } else {}
    })
}

function showSmaller () {
  lighterBubbles = false

  d3.select('.larger-percentage-group').style('display', 'none')
  d3.select('.smaller-percentage-group').style('display', 'none')

  d3.selectAll('.maternity-bubble').style('display', 'initial')
  d3.selectAll('.maternity-bubble').style('display', function (d) {
      if (d.MaternityLeave >= 15) {
        return 'none'
      } else {}
    })
    .transition().duration(750).attr('opacity', function (d) {
      if (d.MaternityLeave <= 15) {
        return 1
      } else {}
    })
}

function showSmallerPercentage () {
  lighterBubbles = true

  d3.select('.smaller-percentage-group').style('display', 'initial')
  d3.select('.smaller-percentage-group').attr('opacity', '0')
  d3.select('.smaller-percentage-group').transition().duration(750).attr('opacity', '1')

  d3.selectAll('.maternity-bubble')
    .style('display', function (d) {
      if (d.MaternityLeave >= 15) {
        return 'none'
      } else {}
    })
    .transition().duration(750).attr('opacity', function (d) {
      if (d.MaternityLeave <= 15) {
        return 0.3
      } else {}
    })

  d3.select('#table').style('display', 'none')
}

function showTable () {
  d3.select('#table').style('display', 'inline-block')
  d3.select('#table').style('opacity', 0)

  d3.select('#table').transition().duration(1500).style('opacity', 1)

  d3.selectAll('.maternity-bubble').style('display', 'none')
  d3.select('.smaller-percentage-group').style('display', 'none')
  d3.select('.average-group').style('display', 'none')
}

function showAverage () {
  lighterBubbles = false

  d3.select('.average-group').style('display', 'initial')
  d3.select('.average-group').attr('opacity', '0')
  d3.select('.average-group').transition().duration(750).attr('opacity', '1')

  d3.select('#table').style('display', 'none')
}

// CHART CREATION
function chartDisplay (data, industries, color) {
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
      return d.MaternityLeave
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

  // let descriptionMargin = height - 60

  // let g = svg.append('g')
  //   .attr('transform', 'translate(' + 0 + ',' + descriptionMargin + ')')
  //   .attr('class', 'description')

  // let companyName = g.append('text')
  //   .attr('class', 'company-name')
  //   .style('opacity', 1)

  // let companyNumber = g.append('text')
  //   .attr('dy', 30)
  //   .attr('class', 'company-number')
  //   .style('opacity', 1)

  // let companyIndustry = g.append('text')
  //   .attr('dy', 50)
  //   .attr('class', 'company-industry')
  //   .style('opacity', 1)

  d3.selectAll('.maternity-bubble').on('mousemove', function (d) {
    d3.select('#tooltip').style('display', 'initial')
    d3.select('#tooltip').html('<div class="company">' + d.Company + '</div>' +
      '<div>' + d.MaternityLeave + ' weeks' + '</div>' +
      '<div>' + d.Industry + '</div>')
      .style('left', (d3.event.pageX) + 'px').style('top', (d3.event.pageY) + 'px')

    // companyName.text(d.Company)
    // companyNumber.text('Maternity Leave: ' + d.MaternityLeave + ' weeks')
    // companyIndustry.text('Industry: ' + d.Industry)
    // d3.select('.description').transition().style('opacity', 1)
  })

  d3.selectAll('.maternity-bubble').on('mouseout', function (d) {
    // d3.select('.description').transition().style('opacity', 0)
    d3.select('#tooltip').style('display', 'none')
  })
}

function tableDisplay () {
  let total = d3.selectAll('.maternity-bubble').size(),
      firstInterval = 0,
      secondInterval = 0,
      thirdInterval = 0,
      fourthInterval = 0,
      fifthInterval = 0,
      sixthInterval = 0

  d3.selectAll('.maternity-bubble').attr('opacity', function (d) {
    if (d.MaternityLeave >= 0 && d.MaternityLeave <= 9) {
      firstInterval++
    }
    if (d.MaternityLeave >= 10 && d.MaternityLeave <= 19) {
      secondInterval++
    }
    if (d.MaternityLeave >= 20 && d.MaternityLeave <= 29) {
      thirdInterval++
    }
    if (d.MaternityLeave >= 30 && d.MaternityLeave <= 39) {
      fourthInterval++
    }
    if (d.MaternityLeave >= 40 && d.MaternityLeave <= 49) {
      fifthInterval++
    }
    if (d.MaternityLeave >= 50) {
      sixthInterval++
    }
  })

  d3.select('#table').html('<table>'
          + '<tbody>' +
          '<tr>' + '<td class="key">' + '50 or more' + '</td>' + '<td class="number">' + sixthInterval + '</td>' + '<td class="number">' + roundedPercentage(sixthInterval, total).toString() + '%' + '</td>' + '</tr>' +
          '<tr>' + '<td class="key">' + '40-49' + '</td>' + '<td class="number">' + fifthInterval + '</td>' + '<td class="number">' + roundedPercentage(fifthInterval, total).toString() + '%' + '</td>' + '</tr>' +
          '<tr>' + '<td class="key">' + '30-39' + '</td>' + '<td class="number">' + fourthInterval + '</td>' + '</td>' + '<td class="number">' + roundedPercentage(fourthInterval, total).toString() + '%' + '</td>' + '</tr>' +
          '<tr>' + '<td class="key">' + '20-29' + '</td>' + '<td class="number">' + thirdInterval + '</td>' + '</td>' + '<td class="number">' + roundedPercentage(thirdInterval, total).toString() + '%' + '</td>' + '</tr>' +
          '<tr>' + '<td class="key">' + '10-19' + '</td>' + '<td class="number">' + secondInterval + '</td>' + '</td>' + '<td class="number">' + roundedPercentage(secondInterval, total).toString() + '%' + '</td>' + '</tr>' +
          '<tr>' + '<td class="key">' + '0-9' + '</td>' + '<td class="number">' + firstInterval + '</td>' + '</td>' + '<td class="number">' + roundedPercentage(firstInterval, total).toString() + '%' + '</td>' + '</tr>'
          + '</tbody>' +
          '</table>')
          .style('display', 'none')
}

function countryComparisonDisplay () {
  let circleMargin = 75

  let countryLeaves = [{
      country: 'Norway',
      maternityLeave: 35,
      note: '100% of normal pay'
    },
    {
      country: 'Estonia',
      maternityLeave: 28,
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
      note: 'No policy'
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

function annotateDisplay () {
  let annotations = [{
      note: {
        title: 'Netflix',
      },
      subject: {
        radius: 52,
      },
      type: d3.annotationCalloutCircle,
      x: 823.605,
      y: 417.965,
      dy: -250,
      dx: 200,
    },
    {
      note: {
        title: 'Bill and Melinda Gates Foundation',
      },
      subject: {
        radius: 52,
      },
      type: d3.annotationCalloutCircle,
      x: 545.808,
      y: 510.599,
      dy: -350,
      dx: -350,
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

function largerPercentageDisplay () {
  let count = 0
  let total = d3.selectAll('.maternity-bubble').size()

  d3.selectAll('.maternity-bubble').data().forEach(datum => {
    if (datum.MaternityLeave >= 25) {
      count++
    }
  })

  let percentage = roundedPercentage(count, total)

  let g = svg.append('g')
    .attr('class', 'larger-percentage-group')

  let groupX = width / 2 - (g.node().getBBox().width / 2)

  g.attr('transform', 'translate(' + groupX + ',' + height / 2 + ')')

  g.append('text')
    .text(percentage.toString() + '%')
    .attr('class', 'larger-percentage')

  g.append('text')
    .text('Percentage offering 25 weeks or more paid maternity leave').attr('dy', 50)
    .attr('class', 'larger-percentage-subtext')
}

function smallerPercentageDisplay () {
  let count = 0
  let total = d3.selectAll('.maternity-bubble').size()

  d3.selectAll('.maternity-bubble').data().forEach(datum => {
    if (datum.MaternityLeave <= 15) {
      count++
    }
  })

  let percentage = roundedPercentage (count, total)

  let g = svg.append('g')
    .attr('class', 'smaller-percentage-group')

  let groupX = width / 2 - (g.node().getBBox().width / 2)

  g.attr('transform', 'translate(' + groupX + ',' + height / 2 + ')')

  g.append('text')
    .text(percentage.toString() + '%')
    .attr('class', 'smaller-percentage')

  g.append('text')
    .text('Percentage offering 15 weeks or less paid maternity leave').attr('dy', 50)
    .attr('class', 'smaller-percentage-subtext')
}

function averageDisplay (data) {
  let average = calculateAvg(data)

  let g = svg.append('g')
    .attr('class', 'average-group')

  let groupX = width / 2 - (g.node().getBBox().width / 2)

  g.attr('transform', 'translate(' + groupX + ',' + height / 2 + ')')

  g.append('text')
    .text(average.toString())
    .attr('class', 'average')

  g.append('text')
    .text('Average number weeks paid maternity leave').attr('dy', 50)
    .attr('class', 'average-subtext')
}

function calculateAvg (array) {
  let sum = 0
  let count = array.length
  for (let i = 0; i < count; i++) {
    sum = sum + parseFloat(array[i].MaternityLeave)
  }
  let average = sum / count
  return Math.round(average * 10) / 10
}

function roundedPercentage (count, total) {
  return Math.round(count / total * 100 * 10) / 10
}

function search () {
  let input = document.getElementById('search-text')

  d3.selectAll('.maternity-bubble')
    .transition()
    .attr('opacity', function (d) {
      if (d.Company.toLowerCase().indexOf(input.value.toLowerCase()) !== -1) {
        if (lighterBubbles) {
          return 0.3
        } else { return 1 }
      } else { return 0.1 }
    })
}
