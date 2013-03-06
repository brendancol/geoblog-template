define(["esri/map",
		"esri/arcgis/utils",
		"esri/layout",
		"esri/widgets",
		"storymaps/geoblog/ui/BlogView"],
	function(Map,Utils,Layout,Widgets,BlogView)
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

		function init()
		{
			app = {
				//esri Map
				map: null,
				blog: new BlogView("#sidePane")
			}

			// Set the Portal
			// - if configOptions.sharingurl is set use that URL
			// - if app is accessed through localhost : use ArcGIS Online
			// - use the server name and port of the 
			if (!configOptions.sharingurl) {
				if( location.host.match("localhost") )
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

			loadMap();

		}

		function loadMap()
		{
			var mapDeferred = esri.arcgis.utils.createMap(configOptions.webmap,"map",{
				sliderStyle: "small"
			});
			
			mapDeferred.then(function(response){
				app.map = response.map;

				startupBanner(response);
			});
		}

		function startupBanner (response) {
			$("#title").html(configOptions.title || response.itemInfo.item.title);
			$("#subtitle").html(configOptions.subtitle || response.itemInfo.item.snippet);
		}

		return {
			init: init
		};

	}
);