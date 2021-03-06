/**
 *  Imports svg into items with groups
 *  Stetson Alpha - Paper.js
 *
 */

var ImportSVG = this.ImportSVG = Base.extend({
	/**
	 * Takes the svg dom obj and parses the data
	 * to create a layer with groups (if needed) with
	 * items inside. Should support nested groups.
	 *
	 * takes in a svg object (xml dom)
	 * returns Paper.js Layer
	 */
	importSVG: function(svg)
	{
		var layer = new Layer();
		groups = this.importGroup(svg);
		layer.addChild(groups);

		return layer;
	},

	/**
	 * Creates a Paper.js Group by parsing
	 * a specific svg g node
	 *
	 * takes in a svg object (xml dom)
	 * returns Paper.js Group
	 */
	importGroup: function(svg)
	{
		var group = new Group();
		var child;
		for (var i in svg.childNodes) {
			child = svg.childNodes[i];
			if (child.nodeType != 1) {
				continue;
			}
			item = this.importPath(child);
			group.addChild(item);
		}
		
		return group;
	},

	/**
	 * Creates a Paper.js Path by parsing
	 * a specific svg node (rect, path, circle, polygon, etc)
	 * and creating the right path object based on the svg type.
	 *
	 * takes in a svg object (xml dom)
	 * returns Paper.js Item
	 */
	importPath: function(svg)
	{
		switch (svg.nodeName.toLowerCase()) {
			case 'line':
				item = this._importLine(svg);
				break;
			case 'rect':
				item = this._importRectangle(svg);
				break;
			case 'ellipse':
				item = this._importOval(svg);
				break;
			case 'g':
				item = this.importGroup(svg);
				break;
			case 'text':
				item = this._importText(svg);
				break;
			default:
			break;
		}
		
		return item;
	},

	/**
	 * Creates a Path.Circle Paper.js item
	 *
	 * takes a svg circle node (xml dom)
	 * returns Paper.js Path.Circle item
	 */
	_importCircle: function(svgCircle)
	{
		var cx		= svgCircle.cx.baseVal.value || 0;
		var cy		= svgCircle.cy.baseVal.value || 0;
		var r		= svgCircle.r.baseVal.value || 0;
		var center	= new Point(cx, cy);
		var circle	= new Path.Circle(center, r);

		return circle;
	},

	/**
	 * Creates a Path.Oval Paper.js item
	 *
	 * takes a svg ellipse node (xml dom)
	 * returns Paper.js Path.Oval item
	 */
	_importOval: function(svgOval)
	{
		var cx			= svgOval.cx.baseVal.value || 0;
		var cy			= svgOval.cy.baseVal.value || 0;
		var rx			= svgOval.rx.baseVal.value || 0;
		var ry			= svgOval.ry.baseVal.value || 0;

		var center		= new Point(cx, cy);
		var offset		= new Point(rx, ry);
		var topLeft		= center.subtract(offset);
		var bottomRight	= center.add(offset);

		var rect		= new Rectangle(topLeft, bottomRight);
		var oval		= new Path.Oval(rect);

		return oval;
	},

	/**
	 * Creates a "rectangle" Paper.js item
	 *
	 * takes a svg rect node (xml dom)
	 * returns either a
	 *   - Path.Rectangle item
	 *   - Path.RoundRectangle item (if the rectangle has rounded corners)
	 */
	_importRectangle: function(svgRectangle)
	{
		var x			= svgRectangle.x.baseVal.value || 0;
		var y			= svgRectangle.y.baseVal.value || 0;
		var rx			= svgRectangle.rx.baseVal.value || 0;
		var ry			= svgRectangle.ry.baseVal.value || 0;
		var width		= svgRectangle.width.baseVal.value || 0;
		var height		= svgRectangle.height.baseVal.value || 0;

		var topLeft		= new Point(x, y);
		var size		= new Size(width, height);
		var rectangle	= new Rectangle(topLeft, size);

		if (rx > 0 || ry > 0) {
			var cornerSize = new Size(rx, ry);
			rectangle = new Path.RoundRectangle(rectangle, cornerSize);
		} else {
			rectangle = new Path.Rectangle(rectangle);
		}

		return rectangle;
	},

	/**
	 * Creates a Path.Line Paper.js item
	 *
	 * takes a svg line node (xml dom)
	 * returns a Path.Line item
	 */
	_importLine: function(svgLine)
	{
		var x1		= svgLine.x1.baseVal.value || 0;
		var y1		= svgLine.y1.baseVal.value || 0;
		var x2		= svgLine.x2.baseVal.value || 0;
		var y2		= svgLine.y2.baseVal.value || 0;

		var from	= new Point(x1, y1);
		var to		= new Point(x2, y2);
		var line	= new Path.Line(from, to);

		return line;
	},

	/**
	 * Creates a PointText Paper.js item
	 *
	 * takes a svg text node (xml dom)
	 * returns a PointText item
	 */
	_importText: function(svgText)
	{
		//TODO: Extend this for multiple values
		var x	= svgText.x.baseVal.getItem(0).value || 0;
		var y	= svgText.y.baseVal.getItem(0).value || 0;
		//END:Todo
		
		var dx; //character kerning
		var dy; //character baseline
		var rotate; //character rotation
		var textLength; //the width of the containing box
		var lengthAdjust; //
		var textContent = svgText.textContent || "";
		
		var topLeft = new Point(x, y);
		var text = new PointText(topLeft);
		text.content = textContent;
		return text;
	}
});