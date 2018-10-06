function search() {
    let input = document.getElementById('search-text')

    d3.selectAll('.maternity-bubble')
        .transition()
        .style('opacity', function (d) {
            if (d.Company.toLowerCase().indexOf(input.value.toLowerCase()) !== -1) {
                return 1
            } else {
                return 0.1
            }
        })
}

