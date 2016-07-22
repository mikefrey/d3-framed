# framed
framed is a D3 plugin that allows you to perform a selection by drawing a
rectangular frame around items.

<img src="https://github.com/mikefrey/d3-framed/blob/master/images/preview.png?raw=true" width="480">

[Example with dragging, panning, and zooming](http://bl.ocks.org/mikefrey/80772654c847cc80d49ce44da6a5445c)

## Usage

Setup d3-framed:

```
// create instance
const frameSelect = d3.framed()
    // provide a function used to select items
    .items(() => d3.selectAll('.myNodes'))
    // get notified when items are selected
    .on('end', nodesSelected)
```

Add it to a container:

```
const svg = d3.select("svg")
  .append("g")
    .call(frameSelect)
```

## API Reference

<a href="#framed" name="framed">#</a> d3.__framed__()

Creates a new framed behavior. The returned behavior is both an object and a function, and is typically applied to selected elements via [*selection*.call](https://github.com/d3/d3-selection#selection_call).

<a href="#fframed" name="fframed">#</a> *framed*(*selection*)

Applies this behavior to the specified *selection*, binding the necessary event listeners to allow drawing of the selection frame. This function is typically not invoked directly, and is instead invoked via `selection.call()`.

<a href="#items" name="items">#</a> *framed*.__items__(*function*)



<a href="#items" name="items">#</a> *framed*.__on__(*typenames*, *listener*)

If *listener* is specified, sets the event *listener* for the specified *typenames* and returns the framed behavior. If an event listener was already registered for the same type and name, the existing listener is removed before the new listener is added. If *listener* is null, removes the current event listeners for the specified *typenames*, if any. If *listener* is not specified, returns the first currently-assigned listener matching the specified *typenames*, if any.

The *typenames* is a string containing one or more *typename* separated by whitespace. Each *typename* is a *type*, optionally followed by a period (`.`) and a *name*, such as `zoom.foo` and `zoom.bar`; the name allows multiple listeners to be registered for the same *type*. The *type* must be one of the following:

* `start` - after frame selection begins (such as on mousedown).
* `select` - after a node is selected.
* `select` - after a node is deselected.
* `end` - after frame selection ends (such as on mouseup ).
