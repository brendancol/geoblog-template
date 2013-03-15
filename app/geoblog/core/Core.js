define(["esri/map",
		"esri/arcgis/utils",
		"esri/layout",
		"esri/widgets",
		"storymaps/geoblog/ui/BlogView"],
	function(
		Map,
		Utils,
		Layout,
		Widgets,
		BlogView)
	{
		/**
		 * Core
		 * @class Core
		 *
		 * Geoblog viewer Main class
		 */

		//
		// Initialization
		//

		var isBuilder = false;

		function init()
		{
			app = {
				//esri Map
				map: null,
				blog: null
			}

			// Set the Portal
			// - if configOptions.sharingurl is set use that URL
			// - if app is accessed through localhost : use ArcGIS Online
			// - use the server name and port of the 
			if (!configOptions.sharingurl) {
				if( location.host.match("localhost") || location.host.match("storymaps.esri.com") )
					configOptions.sharingurl = "http://www.arcgis.com/sharing/rest/content/items";
				else
					configOptions.sharingurl = location.protocol + '//' + location.host + "/sharing/content/items";
			}

			if (configOptions.geometryserviceurl && location.protocol === "https:")
				configOptions.geometryserviceurl = configOptions.geometryserviceurl.replace('http:', 'https:');

			configOptions.proxyurl = configOptions.proxyurl || location.protocol + '//' + location.host + "/sharing/proxy";

			esri.arcgis.utils.arcgisUrl = configOptions.sharingurl;
			esri.config.defaults.io.proxyUrl = configOptions.proxyurl;
			esri.config.defaults.geometryService = new esri.tasks.GeometryService(configOptions.geometryserviceurl);

			//Update configOptions from URL Parameters
			var urlObject = esri.urlToObject(document.location.href);
			urlObject.query = urlObject.query || {};

			if (urlObject.query.edit === "") {
				isBuilder = true;
			}

			loadMap();

		}

		function loadMap()
		{
			var mapDeferred = esri.arcgis.utils.createMap(configOptions.webmap,"map",{
				slider: true
			});
			
			mapDeferred.then(function(response)
			{
				app.map = response.map;

				if (app.map.loaded){
					initializeApp(response);
				}
				else {
					dojo.connect(map, "onLoad", function() {
						initializeApp(response);
					});
				}
			});
		}

		function initializeApp(response)
		{
			var featureService = getLayerByURL(app.map,configOptions.featureService);

			//Update zoom slider
			$(".esriSimpleSlider").removeClass("esriSimpleSliderTL").addClass("esriSimpleSliderTR");

			$(".esriSimpleSliderIncrementButton").addClass("zoomButtonIn");
			$(".zoomButtonIn").each(function(i){
				$(this).after("<div class='esriSimpleSliderIncrementButton initExtentButton'><img style='margin-top:5px' src='resources/images/home.png'></div>");
				$(".initExtentButton").click(function(){
					var mapState = $(".selected-blog").data("mapState");
					app.map.setExtent(new esri.geometry.Extent({"xmin":mapState.extent.xmin, "ymin": mapState.extent.ymin, "xmax": mapState.extent.xmax, "ymax": mapState.extent.ymax, "spatialReference": {"wkid": mapState.extent.spatialReference.wkid}}),true);
				});
			});

			buildBannerDisplay(response);

			app.blog = new BlogView("#blog",app.map,featureService,configOptions.blogStartPoint);

			dojo.connect(app.map,"onUpdateEnd",function(){
				if(!app.map.firstLoad){
					app.map.firstLoad = true;
					app.blog.init(isBuilder);
				}
			});
		}

		function buildBannerDisplay(response) 
		{
			$("#title").html(configOptions.title || response.itemInfo.item.title);
			$("#subtitle").html(configOptions.subtitle || response.itemInfo.item.snippet);
		}

		function getLayerByURL(map,url)
		{
			var layer;
			dojo.forEach(map.graphicsLayerIds,function(lyrId){
				if(map.getLayer(lyrId).url.toLowerCase() === url.toLowerCase()){
					layer = map.getLayer(lyrId);
				}
			});
			return layer
		}

		return {
			init: init
		};

	}
);