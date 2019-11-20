//DO NOT EDIT THIS FILE

$(function() {
  $('html > head').prepend(
    "<link id='common' rel='stylesheet' href='/common.css'>"
  )
})

function create_basemaps(data) {
  /*
	- This should be added to the map constructor - e.g. var map = new Map("mapDiv", { basemap: create_basemaps() });
	- Make sure you remove any remnant of old basemap js / html / css code before you add this.
	- If you pass this function nothing, the default action is a toggle between plain & satellite that will appear in the top right hand corner of the map.
	- You can customise the basemap toggle quite finely, by passing it in a json object: {}, with the values you want to customise in it.
	THE INPUT VARIABLE IS A JSON OBJECT, WHICH CAN CONTAIN THE FOLLOWING PROPERTIES:
		-	types: array, contains the names of the  basemaps you wish to allow.  Look at the self.types object below to see a complete list, or pass in ["*"] here to display all the basemaps on the map. The first basemap in the array will show by default.
		-	width: integer, change the width of the toggle box
		-	height: integer, change the height of the toggle box
		-	css: object, any other css you want to apply can be done so here. e.g. {top: '95px', right: '20px'}
		- 	customise_types: object, this is to alter the defaults in self.types below. e.g. To change the title of one of the basemaps, so the label reads differently, you can pass in, e.g: { watercolour: { text: "For Kids" } }
	EXAMPLE:
		create_basemaps({
			types: ["*"],
			width: 80,
			css: {top: '95px', right:'30px'},
			customise_types: {
				watercolour: {
					text: "For Kids"
				}
			}
		})
	- Any extra CSS <style> you put on the map page will override any positioning values placed here, for the sake of flexibility with css media queries
	*/
  var self = {}
  require([
    'esri/layers/WebTiledLayer',
    'esri/virtualearth/VETiledLayer'
  ], function(WebTiledLayer, VETiledLayer) {
    data = data || {}
    self = {
      use: data.types || ['plain', 'satellite'], //* = all, first one is shown by default
      box_width: data.width || data.height || 64,
      box_height: data.height || data.width || 60,
      types: {
        template: {
          text: 'This will appear as a label on the icon [Required]',
          get: 'This returns the actual basemap layer [Required]',
          get_mobile:
            'This returns a different layer if the user is viewing on a mobile. If not provided, the get() function is used even on mobile. [Optional].',
          img:
            'Name of the image used to display the basemap icon. If not provided, the name of the template is used instead. [Optional]'
        },
        satellite: {
          //thumbnail is based on this [name], stored in images/basemaps/[name].jpg
          text: 'Satellite',
          img: 'satellite',
          get: function() {
            return new VETiledLayer({
              bingMapsKey:
                'As9QBiGS-vF01SV8wkYBT4RCYnlJsL4dTOaqn2MvGtteGZhtRnDCVMqhdNMBrz79',
              mapStyle: VETiledLayer.MAP_STYLE_AERIAL_WITH_LABELS
            })
          },
          get_mobile: function() {
            //If this function isn't set, uses get() function instead, even on mobile
            return new WebTiledLayer(
              'http://api.mapbox.com/v4/mapbox.streets-satellite/${level}/${col}/${row}@2x.png?access_token=pk.eyJ1IjoiYmVhdHNraW4iLCJhIjoiY2lwaTl1cng4MDFmMHU5bmp0ZmNocWg5YSJ9.iikVk6d67QOH9PD8QhZFww',
              {
                id: 'mapBox',
                copyright:
                  "<a href='https://www.mapbox.com/about/maps/'>&copy; Mapbox</a>, <a href='http://www.openstreetmap.org/about/'>&copy; OpenStreetMap</a>, <a href='https://www.mapbox.com/map-feedback/#/-74.5/40/10'>Improve the Basemap</a>."
              }
            )
          }
        },
        plain: {
          text: 'Plain',
          get: function() {
            var ordnance_type = 'Light' //Outdoor, Road, Night, Light
            return new WebTiledLayer(
              'https://api.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/' +
                ordnance_type +
                '%203857/{level}/{col}/{row}.png?key=4vmpYY1uFdimsAkyGwuaFbbHEyfvA5Gy',
              {
                copyright:
                  'Contains OS data &copy; Crown copyright and database right (2016)'
              }
            )
          },
          get_mobile: function() {
            return new WebTiledLayer(
              'https://cartodb-basemaps-{subDomain}.global.ssl.fastly.net/light_all/{level}/{col}/{row}@2x.png',
              {
                subDomains: ['a', 'b', 'c', 'd'],
                copyright:
                  '<a href="http://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors <a href="https://cartodb.com/attributions">&copy; CartoDB</a>, CartoDB <a href="https://cartodb.com/attributions">attribution</a>'
              }
            )
          }
        },
        plain_os: {
          text: 'Light',
          get: function() {
            var ordnance_type = 'Light' //Outdoor, Road, Night, Light
            return new WebTiledLayer(
              'https://api.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/' +
                ordnance_type +
                '%203857/{level}/{col}/{row}.png?key=4vmpYY1uFdimsAkyGwuaFbbHEyfvA5Gy',
              {
                copyright:
                  'Contains OS data &copy; Crown copyright and database right (2016)'
              }
            )
          }
        },
        os_night: {
          text: 'Night',
          get: function() {
            var ordnance_type = 'Night' //Outdoor, Road, Night, Light
            return new WebTiledLayer(
              'https://api.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/' +
                ordnance_type +
                '%203857/{level}/{col}/{row}.png?key=4vmpYY1uFdimsAkyGwuaFbbHEyfvA5Gy',
              {
                copyright:
                  'Contains OS data &copy; Crown copyright and database right (2016)'
              }
            )
          }
        },
        watercolour: {
          text: 'Watercolour',
          get: function() {
            return new WebTiledLayer(
              'https://stamen-tiles-{subDomain}.a.ssl.fastly.net/watercolor/{level}/{col}/{row}.jpg',
              {
                subDomains: ['a', 'b', 'c', 'd'],
                copyright: 'Leaflet'
              }
            )
          }
        },
        monochrome: {
          text: 'Monochrome',
          get: function() {
            return new WebTiledLayer(
              'https://stamen-tiles-{subDomain}.a.ssl.fastly.net/toner-lite/{level}/{col}/{row}.png',
              {
                subDomains: ['a', 'b', 'c', 'd'],
                copyright: 'Leaflet'
              }
            )
          }
        },
        colour: {
          text: 'Colour',
          get: function() {
            var ordnance_type = 'Outdoor'
            return new WebTiledLayer(
              'https://api.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/' +
                ordnance_type +
                '%203857/{level}/{col}/{row}.png?key=4vmpYY1uFdimsAkyGwuaFbbHEyfvA5Gy',
              {
                copyright:
                  'Contains OS data &copy; Crown copyright and database right (2016)'
              }
            )
          }
        },
        buildings: {
          text: 'Buildings',
          get: function() {
            var ordnance_type = 'Road'
            return new WebTiledLayer(
              'https://api.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/EPSG%3A3857/' +
                ordnance_type +
                '%203857/{level}/{col}/{row}.png?key=4vmpYY1uFdimsAkyGwuaFbbHEyfvA5Gy',
              {
                copyright:
                  'Contains OS data &copy; Crown copyright and database right (2016)'
              }
            )
          }
        }
      },
      init: function() {
        if (data.customise_types) {
          for (var i in data.customise_types) {
            for (var j in data.customise_types[i]) {
              self.types[i][j] = data.customise_types[i][j]
            }
          }
        }
        setTimeout(function() {
          //Added in case basemaps is added inline in the map constructor, needs a delay
          map.loaded
            ? self.set_first_basemap()
            : map.on('load', self.set_first_basemap)
          self.timeout = setInterval(function() {
            if (map.loaded) {
              self.set_first_basemap()
              clearTimeout(self.timeout)
            }
          }, 100)
        })
      },
      set_first_basemap: function() {
        if (self.first_loaded) return
        self.first_loaded = true
        if (self.use.length > 1) self.build()
        self.change(store('last_basemap') || self.use[0])
      },
      build: function() {
        var holder = $('<div></div>')
        var search = self.use[0] == '*' ? Object.keys(self.types) : self.use
        if (search.length <= 1)
          throw 'You must add at least two basemaps for this to work'
        for (var i in search) {
          ;(function(i) {
            var name = search[i]
            if (name == 'template') return
            var info = self.types[search[i]]
            var img = (info.img || name) + '.jpg'
            var elem = $('<div></div>')
              .attr('id', 'bm_' + name)
              .append(
                "<div style='background-image:url(/images/basemaps/" +
                  img +
                  ")'></div>"
              )
              .append('<span>' + info.text + '</span>')
              .click(function() {
                self.change(name)
              })
            holder.append(elem)
          })(i)
        }
        var inner = $('<div></div>')
          .append(holder)
          .hover(
            function() {
              self.expand(true)
            },
            function() {
              self.expand(false)
            }
          )
          .css('display', 'block')
        $("<div id='basemap_picker'></div>")
          .append(inner)
          .appendTo('body')
        self.create_custom_styles()
        self.actual_height = $('#basemap_picker > div').height() //Any custom css elsewhere automatically overrides values sent in, so check for height here
      },
      create_custom_styles: function() {
        var style = '<style>'
        style += '#basemap_picker > div { width: ' + self.box_width + 'px } '
        style +=
          '#basemap_picker > div > div > div > div { height: ' +
          self.box_height +
          'px } '
        if (data.css) {
          style += '#basemap_picker {'
          for (var i in data.css) {
            style += i + ': ' + data.css[i]
          }
          style += '}'
        }
        style += '</style>'
        $('html > head #common').after(style)
      },
      expand: function(b) {
        var actual_height = $(
          '#basemap_picker > div > div > div > div'
        ).height()
        if (b) {
          var num_basemaps = $('#basemap_picker > div > div > div').length - 1 //hide self map
          var max_height = num_basemaps * actual_height
          $('#basemap_picker > div').animate(
            { height: max_height + 'px' },
            { queue: false, duration: 150 }
          )
        } else {
          $('#basemap_picker > div').animate(
            { height: actual_height },
            { queue: false, duration: 150 }
          )
        }
      },
      change: function(type) {
        if (!self.types[type]) type = 'plain'

        if (self.last_basemap) map.removeLayer(self.last_basemap)
        self.last_basemap =
          is_retina() && self.types[type].get_mobile
            ? self.types[type].get_mobile()
            : self.types[type].get()
        map.addLayer(self.last_basemap)
        map.reorderLayer(self.last_basemap, 1)
        map.getLayer(map.layerIds[0]).hide() //Hide standard basemap

        if (self.use.length > 1) {
          var icon = type == self.use[0] ? self.use[1] : self.use[0]
          $('#bm_' + icon).prependTo('#basemap_picker > div > div')
          $('#bm_' + type).appendTo('#basemap_picker > div > div')
          self.expand(false)
          store('last_basemap', type)
        }
        $('body').addClass('basemap-' + type)
        $('body').removeClass('basemap-' + self.last_type)
        self.last_type = type
      }
    }
    self.init()
  })
  return 'streets'
}

function db() {
  //Debug to the console
  try {
    var stack = new Error().stack
      .replace(/^[^\(]+?[\n$]/gm, '')
      .replace(/^\s+at\s+/gm, '')
      .split('\n')
    stack =
      stack[1].split(':')[2] +
      ' (' +
      stack[1].substring(0, stack[1].indexOf('(') - 1) +
      ')'
    //console.log(" ");//new line
    if (arguments.length == 0) {
      console.log(stack)
    } else {
      console.log.call(
        console,
        stack,
        arguments.length == 1 ? arguments[0] : arguments
      )
    }
  } catch (err) {}
}

function is_mobile() {
  return $('body').width() <= 600
}

function is_retina() {
  return (
    (window.matchMedia &&
      (window.matchMedia(
        'only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)'
      ).matches ||
        window.matchMedia(
          'only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)'
        ).matches)) ||
    (window.devicePixelRatio && window.devicePixelRatio > 1.3)
  )
}

function store(name, val) {
  name += '_' + window.location.pathname //makes storage not work across maps
  try {
    if (typeof Storage !== 'undefined') {
      if (val === undefined) {
        var val = localStorage.getItem(name)
        if (val == null) return false
        return JSON.parse(val)
      } else {
        var xxx = JSON.stringify(val)
        localStorage.setItem(name, xxx)
        // db("Storing", name, val, xxx);
      }
    }
  } catch (err) {
    return false
  }
}

function once_only(name) {
  if (typeof Storage === 'undefined' || store(name)) return false
  store(name, 1)
  return true
}

function preload(arrayOfImages) {
  $(arrayOfImages).each(function() {
    $('<img/>')[0].src = this
  })
}

/**
 * updateRSS works with the separate aaron-rss repo to syndicate alerts
 * @param {*} postTitle
 * @param {*} postDescription
 */
var updateRSS = function(postTitle, postDescription) {
  var dirNameOfThisMap = window.location.pathname.substr(1).replace(/\/.*/g, '')
  var feedname = dirNameOfThisMap
  var postUrl = 'https://maps.london.gov.uk/' + feedname
  if (!postTitle) {
    postTitle = 'update'
  }
  if (!postDescription) {
    postDescription = 'please check'
  }
  var rssApp = 'https://maps.london.gov.uk/node/aaron-rss'
  $.post(
    rssApp +
      '/items?' +
      $.param({
        feedname: feedname,
        title: postTitle,
        description: postDescription,
        url: postUrl
      }),
    function() {
      // console.log( "success" )
    }
  )
    .done(function() {
      console.log('second success')
    })
    .fail(function(err) {
      console.log('error', err)
    })
    .always(function() {
      // console.log( "finished" )
    })
}

function asciiLDN() {
  console.log(
    '\t\n\u2588\u2588\u2557     \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2557   \u2588\u2588\u2557\n\u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551\n\u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2554\u2588\u2588\u2557 \u2588\u2588\u2551\n\u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551\u255A\u2588\u2588\u2557\u2588\u2588\u2551\n\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551 \u255A\u2588\u2588\u2588\u2588\u2551\n\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D  \u255A\u2550\u2550\u2550\u255D\n'
  )
}