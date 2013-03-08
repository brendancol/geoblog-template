define([],
	function()
	{
		/**
		 * BlogView
		 * @class BlogView
		 *
		 * Class to compile blog attributes into DOM Display
		 */

		return function BlogView(selector, map, featureService, blogStartPoint)
		{
			var _blog = null;
			var _tempBlogPost = null;
			var _tempMapState = null;

			featureService.hide();

			this.init = function(addAvailable)
			{
				createBlog();

				if (addAvailable){
					addPostCreator();
				}
			}

			this.prev = function()
			{
				if($(".geoBlogPost").filter(".selected-blog").index() === 0){
					selectBlogPost($(".geoBlogPost").last());
				}
				else{
					selectBlogPost($(".geoBlogPost").filter(".selected-blog").prev());
				}
			}

			this.next = function()
			{
				if($(".geoBlogPost").filter(".selected-blog").index() === $(".geoBlogPost").last().index()){
					selectBlogPost($(".geoBlogPost").first());
				}
				else{
					selectBlogPost($(".geoBlogPost").filter(".selected-blog").next());
				}
			}

			function createBlog()
			{
				dojo.forEach(featureService.graphics,function(grp){

					var blogArray = $.parseJSON(grp.attributes.blogPost);
					var mapState = $.parseJSON(grp.attributes.mapState);

					$(selector).append('<div class="geoBlogPost"></div>');

					createBlogPostHTML(blogArray,mapState);

					// dojo.forEach(blogArray,function(item){

					// 	var el;

					// 	switch (item.type){
					// 		case "title":
					// 			el = '<h3 class="blogPostTitle">'+item.string+'</h3>';
					// 			break;
					// 		case "img":
					// 			el = '<img class="blogPostImg" src="'+item.src+'" alt="">';
					// 			if (item.string){
					// 				el = el + '<p class="blogPostCaption">'+item.string+'</p>';
					// 			}
					// 			break;
					// 		case "text":
					// 			el = '<p class="blogPostText">'+item.string+'</p>';
					// 			break;
					// 	}

					// 	$(".geoBlogPost").last().append(el).data("mapState",mapState).click(function(){
					// 		if ($(this).hasClass("disabled-blog")){
					// 			selectBlogPost($(this));
					// 		}
					// 	});

					// });

				});

				initialSelection();
			}

			function createBlogPostHTML(blogArray, mapState)
			{
				dojo.forEach(blogArray,function(item){

					var el;

					switch (item.type){
						case "title":
							el = '<h3 class="blogPostTitle">'+item.string+'</h3>';
							break;
						case "img":
							el = '<img class="blogPostImg" src="'+item.src+'" alt="">';
							if (item.string){
								el = el + '<p class="blogPostCaption">'+item.string+'</p>';
							}
							break;
						case "text":
							el = '<p class="blogPostText">'+item.string+'</p>';
							break;
					}

					$(".geoBlogPost").last().append(el).data("mapState",mapState).click(function(){
						if ($(this).hasClass("disabled-blog")){
							selectBlogPost($(this));
						}
					});

				});
			}

			function initialSelection()
			{
				if (!isNaN(blogStartPoint)){
					selectBlogPost($(".geoBlogPost").eq(blogStartPoint));
				}
				else if (blogStartPoint === "latest"){
					selectBlogPost($(".geoBlogPost").last());
				}
				else{
					selectBlogPost($(".geoBlogPost").first());
				}
			}

			function selectBlogPost(blogPost)
			{
				var mapState = blogPost.data("mapState");

				$(".geoBlogPost").not(blogPost).stop(true,true).fadeTo("fast","0.5").removeClass("selected-blog").addClass("disabled-blog");
				blogPost.stop(true,true).fadeTo("fast","1.0").removeClass("disabled-blog").addClass("selected-blog");

				map.setExtent(new esri.geometry.Extent({"xmin":mapState.extent.xmin, "ymin": mapState.extent.ymin, "xmax": mapState.extent.xmax, "ymax": mapState.extent.ymax, "spatialReference": {"wkid": mapState.extent.spatialReference.wkid}}));

				//$(selector).scrollTop($(selector).scrollTop() + blogPost.position().top - 25);
				$(selector).animate({ scrollTop: $(selector).scrollTop() + blogPost.position().top - 25 });

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
				form.append('<div class="tempBlogItem" itemType="title">Post Title:<br><textarea class="tempPostTitle tempBlogItemInput" itemType="title"></textarea></div>');

				form.append('<div class="buttonGroup"><button type="button" id="buttonImg">Add Img</button><button type="button" id="buttonText">Add Text</button><button type="button" id="buttonSave">Save</button></div>');
				
				$("#buttonImg").click(function(){
					$(".buttonGroup").before('<div class="tempBlogItem" itemType="img">Img URL:<br><textarea class="tempImgURL tempBlogItemInput" itemType="imgURL"></textarea><br>Img Caption/Copywrite:<br><textarea class="tempImgCaption tempBlogItemInput" itemType="imgCap"></textarea></div>');
				});
				$("#buttonText").click(function(){
					$(".buttonGroup").before('<div class="tempBlogItem" itemType="text">Text:<textarea class="tempPostText tempBlogItemInput" itemType="imgURL"></textarea></div>');
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

					//TODO: Add to feature service
					saveBlogPost();

					form.remove();
					addButton = $(selector).find(".addPost");
					addButton.show();

				});
			}

			function saveBlogPost() 
			{
				_tempMapState.extent = map.extent;
				_tempMapState.infoWindow = null;

				if (map.infoWindow.isShowing){
					_tempMapState.infoWindow = {
						//features: map.infoWindow.features,
						index: map.infoWindow.selectedIndex,
						location: map.infoWindow._location
					};
				}

				var pt = new esri.geometry.Point(0,0);

				var attr = {
					blogPost: JSON.stringify(_tempBlogPost),
					mapState: JSON.stringify(_tempMapState)
				}

				var graphic = new esri.Graphic(pt,null,attr);

				addPostToBlog(graphic);

				featureService.applyEdits([graphic],null,null);

			}

			function addPostToBlog(grp)
			{	
				var blogArray = $.parseJSON(grp.attributes.blogPost);
				var mapState = $.parseJSON(grp.attributes.mapState);

				$(selector).find(".addPost").before('<div class="geoBlogPost"></div>');

				createBlogPostHTML(blogArray,mapState);

				selectBlogPost($(".geoBlogPost").last());

			}
		}
	}
);