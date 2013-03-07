define([],
	function()
	{
		/**
		 * BlogView
		 * @class BlogView
		 *
		 * Class to compile blog attributes into DOM Display
		 */

		return function BlogView(selector,map,featureService)
		{
			var _blog = null;
			var _tempBlogPost = null;
			var _tempMapState = null;

			this.init = function(addAvailable)
			{
				if (addAvailable){
					addPostCreator();
				}
			}

			function addPostCreator()
			{
				var addButton = null;
				$(selector).append('<div class="addPost">+</div>');

				addButton = $(selector).find(".addPost");

				addButton.click(function(){
					createTempPost($(this));
					_tempBlogPost = [];
					_tempMapState = {};
					addButton.hide();
				});
			}

			function createTempPost(el)
			{
				var form = null;
				el.before('<form class="tempPost"></form>');

				form = $(selector).find(".tempPost");
				form.append('<div class="tempBlogItem" itemType="title">Post Title:<textarea class="tempPostTitle tempBlogItemInput" itemType="title"></textarea></div>');

				form.append('<div class="buttonGroup"><button type="button" id="buttonImg">Add Img</button><button type="button" id="buttonText">Add Text</button><button type="button" id="buttonSave">Save</button></div>');
				
				$("#buttonImg").click(function(){
					$(".buttonGroup").before('<div class="tempBlogItem" itemType="img">Img URL:<textarea class="tempImgURL tempBlogItem" itemType="imgURL"></textarea><br>Img Caption/Copywrite:<textarea class="tempImgCaption tempBlogItem" itemType="imgCap"></textarea></div>');
				});
				$("#buttonText").click(function(){
					$(".buttonGroup").before('<div class="tempBlogItem" itemType="text">Text:<textarea class="tempPostText tempBlogItem" itemType="imgURL"></textarea></div>');
				});
				$("#buttonSave").click(function(){
					$(".tempBlogItem").each(function(){
						switch($(this).attr("itemType")){
							case "title":
								var item = {
									type: "title",
									string: $(this).children(".tempPostTitle").val()
								}
								_tempBlogPost.push(item);
								break;
							case "img":
								var item = {
									type: "img",
									src: $(this).children(".tempImgURL").val(),
									string: $(this).children(".tempImgCaption").val()
								}
								_tempBlogPost.push(item);
								break;
							case "text":
								var item = {
									type: "text",
									string: $(this).children(".tempPostText").val()
								}
								_tempBlogPost.push(item);
								break;
						}
					});
					_tempMapState.extent = map.extent;
					_tempMapState.infoWindow = null;
					if (map.infoWindow.isShowing){
						_tempMapState.infoWindow = [map.infoWindow.features,map.infoWindow.selectedIndex];
					}

					//TODO: Add to feature service
					saveBlogPost();

					form.remove();
					addButton = $(selector).find(".addPost");
					addButton.show();

				});
			}

			function saveBlogPost() 
			{
				window.test = _tempBlogPost;
				var pt = new esri.geometry.Point(0,0);

				var attr = {
					blogPost: JSON.stringify(_tempBlogPost),
					mapState: JSON.stringify(_tempMapState)
				}

				var graphic = new esri.Graphic(pt,null,attr);

				featureService.applyEdits([graphic],null,null);

			}
		}
	}
);