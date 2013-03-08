define([],
	function ()
	{
		function init()
		{
			configOptions = {
				//The appid for the configured application
				appid: "",
				//The web map id
				webmap: "996f62fa8f174423a11794913f7e189f",
				//Enter the url to the feature service storing blog posts
				featureService: "http://services.arcgis.com/nzS0F0zdNLvs7nc8/arcgis/rest/services/geoblog_test/FeatureServer/0",
				//Choose starting point of blog: Default is "first" item. Choose "latest" or enter blog post index as JavaScript number
				blogStartPoint: "first",
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