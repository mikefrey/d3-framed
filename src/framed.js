import {dispatch} from "d3-dispatch"
import {event, customEvent, select, mouse} from "d3-selection"
import {zoomTransform} from "d3-zoom"

export default function() {

  function noevent() {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  var listeners = dispatch('start', 'end')
  var container
  var containerNode
  var className = 'selected'
  var items = () => {}

  function framed(selection) {
    containerNode = selection.node()
    container = selection
      .on('mousedown.framed', mouseDown)
  }

  framed.items = function(fn) {
    typeof fn !== 'function' ? items = (() => fn) : items = fn
    return framed
  }

  framed.class = function(name) {
    if (!name) return className
    className = name
    return framed
  }

  framed.on = function() {
    var value = listeners.on.apply(listeners, arguments)
    return value === listeners ? framed : value
  }

  function emit(type) {
    var args = Array.prototype.slice.call(arguments, 1)
    customEvent(event, listeners.apply, listeners, [type, containerNode, args])
  }

  function mouseDown() {
    if (event.button !== 0) return
    event.stopImmediatePropagation()

    // deselect any selected items
    items().classed(className, false)

    var win = select(event.view)
      .on('mousemove.framed', mouseMove, true)
      .on('mouseup.framed', mouseUp, true)

    var transform = zoomTransform(containerNode)
    var startX, startY

    var frame = container.append('rect')
      .attr('class', 'selection')

    emit('start')

    function mouseMove() {
      noevent()

      // deselect any selected items
      var nodes = items().classed(className, false)
      var [x, y] = mouse(containerNode)

      if (startX == undefined)
        [startX, startY] = [x, y]

      var x1 = x < startX ? x : startX
      var y1 = y < startY ? y : startY
      var x2 = x < startX ? startX : x
      var y2 = y < startY ? startY : y

      frame
        .attr('x', x1)
        .attr('y', y1)
        .attr('width', x2 - x1)
        .attr('height', y2 - y1)

      ;[x1, y1] = transform.invert([x1, y1])
      ;[x2, y2] = transform.invert([x2, y2])

      nodes.each(function(/*d*/) {
        var item = select(this)
        var x = parseFloat(item.attr('x'), 10)
        var y = parseFloat(item.attr('y'), 10)

        if (x1 < x && x < x2 && y1 < y && y < y2) {
          item.classed(className, true)
        }
      })
    }

    function mouseUp() {
      win.on('mousemove.framed mouseup.framed', null)
      frame.remove()
      noevent()

      emit('end', items().filter(`.${className}`))
    }
  }

  return framed
}
