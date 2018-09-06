// TAKEAWAYS
// - You cannot append text (or really anything) to circles directly. You should wrap
// the circle into a group and append the text to the group
// Use the x and y of the circle to set the x and y of the text, not dx or dy.
// Use text-anchor: middle to center the text.
// The function ticked controls how the circles and text change position during
// the force simulation.

let widthSort = 800, heightSort = 800

let svgSort = d3.select('#maternity-sort')
  .append('svg')
  .attr('viewBox', '0 0' + ' ' + widthSort + ' ' + heightSort)

let industriesSort = ['Technology','Philanthropy','Hospitality','Government: Federal','Educational Services']

let colorSort = d3.scaleSequential(d3.interpolatePuRd).domain([0, industries.length + 2])

d3.csv('maternity-data.csv').then(data => {
  let nodes = data

  // BUBBLE FORCE CREATION
  let simulationSort = d3.forceSimulation(data) // creates simulation
    .force('charge', d3.forceManyBody().strength(10)) // applies attraction or repelling force
    .force('center', d3.forceCenter(widthSort / 2, heightSort / 2)) // pulls points towards a center
    .force('collision', d3.forceCollide().radius(function (d) {
      return d.MaternityLeave
    }))
    .on('tick', ticked)

  let gridCenters = {}
  let gridDimensions = {"rows": 3, "columns": 3}
  let groups = industriesSort.length

  for(let i = 0; i < groups; i++) {
    let curRow = Math.floor(i / gridDimensions.columns)
    let curCol = i % gridDimensions.columns

    let currentCenter = {
        x: (2 * curCol + 1) * (width / (gridDimensions.columns * 2)),
        y: (2 * curRow + 1) * (height / (gridDimensions.rows * 2))
    }

    gridCenters[industriesSort[i]] = currentCenter
  }

  let targetForceX = d3.forceX(function(d) {
    if (gridCenters[d.Industry]) {
      return gridCenters[d.Industry].x * 1.5
    } else {
      return 0
    }
  }).strength(0.5)
  let targetForceY = d3.forceY(function(d) {
    if (gridCenters[d.Industry]) {
      return gridCenters[d.Industry].y * 1.5
    } else {
      return 0
    }
  }).strength(0.5)

  simulationSort.force('x', targetForceX).force('y', targetForceY)

  let bubblesSort = svgSort.selectAll('.maternity-bubble')
    .data(data)
    .enter().append('g').attr('class', 'maternity-bubble')
    .append('circle')
      .attr('r', function (d) {
        return d.MaternityLeave
      })
      .style('fill', function (d,i) {
        let index = industries.indexOf(d.Industry)
        return colorSort(index)
      })
      .style('stroke', '#cacbcc')
      .style('stroke-width', '0.3')

  let labelsSort = d3.selectAll('.maternity-bubble')
    .append('g')

  let textsSort = labelsSort.append('text')
    .attr('x', function (d) {
      return d.x
    })
    .attr('y', function (d) {
      return d.y
    })
    .attr('dy', -5)
    .text(function (d) {
      return d.Company
    })
    .style('font-size', '7px')
    .style('text-anchor', 'middle')

  let numbersSort = labelsSort.append('text')
    .attr('x', function (d) {
      return d.x
    })
    .attr('y', function (d) {
      return d.y
    })
    .attr('dy', 10)
    .style('text-anchor', 'middle')
    .text(function (d) {
      return d.MaternityLeave
    })
    .style('font-size', '17px')

  function ticked () {
    bubblesSort.attr('cx', function (d) {
      return d.x
    })
    .attr('cy', function (d) {
      return d.y
    })

    textsSort.attr('x', function (d) {
      return d.x
    })
    .attr('y', function (d) {
      return d.y
    })

    numbersSort.attr('x', function (d) {
      return d.x
    })
    .attr('y', function (d) {
      return d.y
    })

    bubblesSort.exit().remove()
    labelsSort.exit().remove()
    numbersSort.exit().remove()
  }
})
