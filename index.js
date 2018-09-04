// TAKEAWAYS
// - You cannot append text (or really anything) to circles directly. You should wrap
// the circle into a group and append the text to the group
// Use the x and y of the circle to set the x and y of the text, not dx or dy.
// Use text-anchor: middle to center the text.
// The function ticked controls how the circles and text change position during
// the force simulation.

let width = 600, height = 600

let svg = d3.select('#maternity-bubble-chart')
  .append('svg')
  .attr('viewBox', '0 0' + ' ' + width + ' ' + height)

let industries = ['Technology','Philanthropy','Hospitality','Government: Federal','Educational Services']

let color = d3.scaleSequential(d3.interpolatePuRd).domain([0, industries.length + 2])

d3.csv('maternity-data.csv').then(data => {
  let nodes = data

  // BUBBLE FORCE CREATION
  let simulation = d3.forceSimulation(data) // creates simulation
    .force('charge', d3.forceManyBody().strength(10)) // applies attraction or repelling force
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
        return d.MaternityLeave
      })
      .style('fill', function (d,i) {
        let index = industries.indexOf(d.Industry)
        return color(index)
      })
      .style('stroke', '#cacbcc')
      .style('stroke-width', '0.3')

  let labels = d3.selectAll('.maternity-bubble')
    .append('g')

  let texts = labels.append('text')
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

  let numbers = labels.append('text')
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
    bubbles.attr('cx', function (d) {
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

    bubbles.exit().remove()
    labels.exit().remove()
    numbers.exit().remove()
  }
})
