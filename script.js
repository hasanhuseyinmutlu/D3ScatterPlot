let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'


let req = new XMLHttpRequest()

let values = []

let xScale
let yScale
let yAxis
let xAxis

let width = 800
let height = 600
let padding = 40

let svg  = d3.select('svg')

// Define the tooltip
let tooltip = d3.select('#tooltip')


let generateScales = () => {
    xScale = d3.scaleLinear()
    .domain([d3.min(values,(item) =>{
        return item['Year']
    }) - 1 , d3.max(values, (item) => {
        return item['Year']
    }) +1])
    .range([padding, width-padding])

    yScale = d3.scaleTime()
    .domain([d3.min(values, (item) => {
        return new Date(item['Seconds'] *1000)
    }), d3.max(values, (item) =>{
        return new Date(item['Seconds'] * 1000)
    })])
    .range([padding, height-padding])

}

let generateAxes = () => {
    xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format('d'))

    yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat('%M:%S'))

    svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, ' + (height-padding) +')')
    
    /* ### idk why I can't run 
    svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x-Axis', -160)
    .attr('y-Axis', -44)
    .style('font-size', 18)
    .text('Time in Minutes');*/

    svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform','translate(' + padding + ', 0)')

}

let drawPoints = () => {

    svg.selectAll('circle')
    .data(values)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', '5')
    .attr('data-legend', (item) =>{
        return item.legend
    }) 
    .attr('data-xvalue',(item) => {
        return item['Year']
    })
    .attr('data-yvalue', (item) => {
        return new Date(item['Seconds'] * 1000)
    })
    .attr('cy', (item) =>{
        return yScale(new Date(item['Seconds'] * 1000))
    })
    .attr('cx', (item) =>{
        return xScale(item['Year'])
    })
    .attr('fill', (item) => {
        if(item['URL'] === "") {
            return 'green'
        } else {
            return 'red'
        }
    })
    .on('mouseover', (item) => {
        tooltip.transition()
            .style('visibility', 'visible')
        
        if(item['Doping'] != ""){
            tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + item['Doping'])
        }else{
            tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + 'No Allegations')
        }
        
        tooltip.attr('data-year', item['Year'])
    })
    .on('mouseout', (item) => {
        tooltip.transition()
            .style('visibility', 'hidden')
    })

}

let drawCanvas = () => {
    svg.attr('width',width)
    svg.attr('height',height)
}

let generateLegend= () => {

    svg.append("text")
    .attr('transform', 'translate(570, ' + (height-350) +')')
    .attr("text-anchor", "left")
    .attr("id", "legend")
    .text("No doping allegations");
    svg.append("circle")
    .attr('transform', 'translate(560, ' + (height-355) +')')
    .attr("r", 6)
    .attr("fill", "green");  
    svg.append("text")
    .attr('transform', 'translate(570, ' + (height-320) +')')
    .attr("text-anchor", "left")
    .attr("id", "legend")
    .text("Riders with doping allegations");
  svg.append("circle")
    .attr('transform', 'translate(560, ' + (height-325) +')')
    .attr("r", 6)
    .attr("fill", "red");

}

req.open('GET', url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    console.log(values)
    drawCanvas()
    generateScales()
    drawPoints()
    generateAxes()
    generateLegend()
}
req.send()