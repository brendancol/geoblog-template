define([],
	function ()
	{
		function init()
		{
			configOptions = {
				//The appid for the configured application
				appid: "",
				//The web map id
				webmap: "66502e241a6e4f72a1d9c1a80fcbc2d7",
				//Enter a title, if no title is specified, the webmap's title is used.
				title: "",
				//Enter a subtitle, if not specified the ArcGIS.com web map's summary is used
				subtitle: "",
				//If the webmap uses Bing Maps data, you will need to provided your Bing Maps Key
				bingmapskey: "Akt3ZoeZ089qyG3zWQZSWpwV3r864AHStal7Aon21-Fyxwq_KdydAH32LTwhieA8",
				// Specify a proxy for custom deployment
				proxyurl: "",
				//specify the url to a geometry service
				geometryserviceurl: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",
				//Modify this to point to your sharing service URL if you are using the portal
				sharingurl: ""
			}
		}

		return {
			init: init
		}
	}
);