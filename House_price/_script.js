/*var data = [
  {"year": 2001,    "value": 31.4},
  {"year": 2002,    "value": 32.6},
  {"year": 2003,    "value": 34.5},
  {"year": 2004,    "value": 35.5},
  {"year": 2005,    "value": 35.6},
  {"year": 2006,    "value": 35.3},
  {"year": 2007,    "value": 35.2},
  {"year": 2008,    "value": 39.3},
  {"year": 2009,    "value": 52.3},
  {"year": 2010,    "value": 60.9},
  {"year": 2011,    "value": 65.9},
  {"year": 2012,    "value": 70.4},
  {"year": 2013,    "value": 72.6},
  {"year": 2014,    "value": 74.4},
  {"year": 2015,    "value": 73.6},
]*/

var data = [
  {
      "year": 2000,
      "value": 341900
    },
    {
      "year": 2001,
      "value": 375900
    },
    {
      "year": 2002,
      "value": 388600
    },
    {
      "year": 2003,
      "value": 493600
    },
    {
      "year": 2004,
      "value": 647600
    },
    {
      "year": 2005,
      "value": 651100
    },
    {
      "year": 2006,
      "value": 717500
    },
    {
      "year": 2007,
      "value": 792700
    },
    {
      "year": 2008,
      "value": 852900
    },
    {
      "year": 2009,
      "value": 750500
    },
    {
      "year": 2010,
      "value": 834400
    },
    {
      "year": 2011,
      "value": 885700
    },
    {
      "year": 2012,
      "value": 951700
    },
    {
      "year": 2013,
      "value": 1103800
    },
    {
      "year": 2014,
      "value": 1204750
    },
    {
      "year": 2015,
      "value": 1355950
    },
    {
      "year": 2016,
      "value": 1546800
    },
    {
      "year": 2017,
      "value": 1734300
    }
];

var ƒ = d3.f

var sel = d3.select('body').html('')
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: sel.node().offsetWidth, 
  height: 400, 
  margin: {left: 50, right: 50, top: 30, bottom: 30}
})

c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})

//c.x.domain([2001, 2015])
//c.y.domain([0, 100])

c.x.domain([2000, 2017])
c.y.domain([0, 3000000])

/*var formatValue = d3.format(",d");

let currencyFormat = (d) => {
  if(d < 1000000) {
    return `$${d/1000}k`
  }

  return `$${d/1000000}m`
}*/


c.xAxis.ticks(10).tickFormat(ƒ())
c.yAxis.ticks(5).tickFormat(function(d) {if (d<1000000){return '$' + d/1000 + 'k'} else {return  '$' + d/1000000 + 'M'}})
//c.yAxis.ticks(5).tickFormat(d => '$' + d/1000 + 'k')

var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('value', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('value', c.y))

var clipRect = c.svg
  .append('clipPath#clip')
  .append('rect')
  // start drawing from the year 2008
  .at({width: c.x(2008) - 2, height: c.height})

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip)')

correctSel.append('path.area').at({d: area(data)})
correctSel.append('path.line').at({d: line(data)})
yourDataSel = c.svg.append('path.your-line')

c.drawAxis()

yourData = data
  .map(function(d){ return {year: d.year, value: d.value, defined: 0} })
  .filter(function(d){
    if (d.year == 2008) d.defined = true
    return d.year >= 2008
  })

var completed = false

var drag = d3.drag()
  .on('drag', function(){
    var pos = d3.mouse(this)
    var year = clamp(2008, 2017, c.x.invert(pos[0]))
    var value = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < .5){
        d.value = value
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})

    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true
      clipRect.transition().duration(1000).attr('width', c.x(2017))
    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }