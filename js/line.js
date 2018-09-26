let widthLine = 600, heightLine = 600
let margin = {
  top: 50,
  bottom: 50,
  right: 50,
  left: 50
}

// SCALE CREATION
let categories = ['>= 50','>= 40','>= 30','>= 20','>= 10']

let y = d3.scalePoint()
  .rangeRound([0, widthLine])
  .domain(categories)

let lineSvg = d3.select('#maternity-line-chart')
  .append('svg')
  .attr('viewBox', -margin.left + ' ' +  -margin.top + ' ' + 800 + ' ' + 800)

let scale = lineSvg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

scale.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y))

//GRID LINES
function yGridlines () {
  return d3.axisLeft(y)
}

let grid = lineSvg.append('g')
  .attr('class', 'grid')
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(yGridlines()
    .tickSize(-width)
    .tickFormat('')
  )
  .attr("color", "#cacbcc")

scale.selectAll('.domain').remove()
scale.selectAll('.tick line').remove()

grid.selectAll('.domain').remove()

function yCenter(value) {
  if (value < 10) {
    return 16.5 + y.step() * 5
  } else if (value >= 10 && value < 20) {
    return 16.5 + y.step() * 5
  } else if (value >= 20 && value < 30) {
    return 16.5 + y.step() * 4
  } else if (value >= 30 && value < 40) {
    return 16.5 + y.step() * 3
  } else if (value >= 40 && value < 50) {
    return 16.5 + y.step() * 2
  } else if (value >= 50) {
    return 16.5 + y.step()
  }
}

d3.csv('maternity-data.csv').then(data => {
  let nodes = data

  // BUBBLE FORCE CREATION
  let simulation = d3.forceSimulation(data) // creates simulation
    .force('charge', d3.forceManyBody().strength(10)) // applies attraction or repelling force
    .force('center', d3.forceCenter(widthLine / 1.5, heightLine  / 1.42)) // pulls points towards a center
    .force('collision', d3.forceCollide().radius(function (d) {
      return d.MaternityLeave
    }))
    .on('tick', ticked)

  simulation.force('y', d3.forceY().y(function(d) {
    return yCenter(d.MaternityLeave)
  }).strength(0.5))

  let bubblesLine = lineSvg.selectAll('.maternity-bubble-line')
    .data(data)
    .enter().append('g').attr('class', 'maternity-bubble-line')
    .append('circle')
      .attr('r', function (d) {
        return d.MaternityLeave
      })
      .style('fill', function (d,i) {
        let index = industries.indexOf(d.Industry)
        return color(index)
      })
      .style('stroke', '#cacbcc')
      .style('stroke-width', '0.3')

  let labels = d3.selectAll('.maternity-bubble-line')
    .append('g')

  let texts = labels.append('text')
    .attr('x', function(d) {
      return d.x
    })
    .attr('y', function(d) {
      return d.y
    })
    .attr('dy', -5)
    .text(function(d) {
      return d.Company
    })
    .style('font-size', '10px')
    .style('text-anchor', 'middle')

  let numbers = labels.append('text')
    .attr('x', function(d) {
      return d.x
    })
    .attr('y', function(d) {
      return d.y
    })
    .attr('dy', 10)
    .style('text-anchor', 'middle')
    .text(function(d) {
      return d.MaternityLeave
    })
    .style('font-size', '17px')

  function ticked () {
    bubblesLine.attr('cx', function (d) {
      return d.x
    })
    .attr('cy', function (d) {
      return d.y
    })

    texts.attr('x', function (d) {
      return d.x
    })
    .attr('y', function (d) {
      return d.y
    })

    numbers.attr('x', function (d) {
      return d.x
    })
    .attr('y', function (d) {
      return d.y
    })

    bubblesLine.exit().remove()
    labels.exit().remove()
    numbers.exit().remove()
  }
})
