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

let industries = ['Technology','Philanthropy','Hospitality','Government: Federal','Educational Services']

let color = d3.scaleSequential(d3.interpolatePuRd).domain([0, industries.length + 2])

// CHART CREATION
d3.csv('maternity-data.csv').then(data => {
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
        return d.MaternityLeave
      })
      .style('fill', function (d,i) {
        let index = industries.indexOf(d.Industry)
        return color(index)
      })
      .style('stroke', '#cacbcc')
      .style('stroke-width', '0.3')
      .attr('class', function(d) {
        return d.Company
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

  function ticked () {
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
})

function activate(index) {
  let lastIndex = -1
  let activeIndex = 0

  // SCROLL SETUP
  let activateFunctions = []

  function setupSections() {
    activateFunctions[0] = function() { console.log('hi') }
    activateFunctions[1] = annotate
    activateFunctions[2] = function() { console.log('hi') }
    activateFunctions[3] = function() { console.log('hi') }
    activateFunctions[4] = function() { console.log('hi') }
  }

  setupSections()

  activeIndex = index
  let sign = (activeIndex - lastIndex) < 0 ? -1 : 1

  let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign)

  scrolledSections.forEach(function (i) {
    activateFunctions[i]()
  })

  lastIndex = activeIndex
}

function annotate() {
  // annotate netflix
  d3.select('.Netflix').transition().style('stroke', 'black').style('stroke-width', '1px')
  d3.select('.Bill').transition().style('stroke', 'black').style('stroke-width', '1px')
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
//  plot.update(index, progress);
})

