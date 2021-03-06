var _URL_ = "http://api.etsy.com/v2/public";
var _LISTING_ = "/listings/active.js";
var _KEY1_ = "&api_key=22u5zgz7eze80ymvmqshkdti";
var _KEY2_ = "&api_key=2ufyxjd5wccvgcm0yb61jp7b";
var _KEY3_ = "&api_key=hr7dbzisuo6y56soguanj071";
var _KEY4_ = "&api_key=tmo7w4tcorpv50ccnt2nj4n5";
var _KEY5_ = "&api_key=l7yd3rcwklc1g3gnl89z4qru";
var _KEY6_ = "&api_key=xt4c9qkyu9hmt139xrsqiyja";
var _KEY_ARRAY_ = [_KEY1_,_KEY2_,_KEY3_,_KEY4_,_KEY5_,_KEY6_];
var OK = 1;
var ERR = -1;
////////////////////////////////////////////////////////////////////////
//                        15237 HW4 Unit Project                      //
// Group members: Zi Wang (ziw), Bingying Xia(bxia), Ruoyu Li(ruoyul) //
////////////////////////////////////////////////////////////////////////

var INVALID_URL = "Invalid etsy url. Can't proceed to ajax request";
var SUCC_MSG = "Ajax request succeeded";
var FAIL_MSG = "Ajax request failed";
var color_accuracy = 20;
var searchLimit = 50;
var resultCache = new Object();
var storedImages = new Array();
var clicked= false;
var prevID = undefined;

var needsLoading = 48;
//when_made
var vintages = [
    "1980s", "1970s", "1960s", "1950s", "1940s", "1930s", "1920s", "1910s", "1900s", "1800s", "1700s", "before_1700"
];

//who_made
var I_DID = "i_did";

/*
*  A class represents a filter in accordance to html form
   This will then be rendered and sent as a request to etsy.com to retrieve cooresponding products
*/
function Filter () {
    this.color = undefined;//hsv string,required
    
    //all options below are optional
    this.keyword = undefined;
    this.category = undefined;
    this.filterType = undefined;
    this.minPrice = undefined;
    this.maxPrice = undefined;
}

Filter.prototype.key = function() {
    return this.color+this.keyword+
            "min:"+ this.minPrice +
            "max:"+ this.maxPrice +
            "type:"+this.filterType +
            "category:"+this.category;
};


/*
    Send one ajax request to etsy.com with the given request parameter and callback function
    request should be of the following form
    request = {
        requestURL : ""  //typeof String, the url to send, generated by prepareURL()
        requestOBJ : obj //typeof Filter, the filter that holds the request specification
        requestGRID: obj //typeof Object, the grid that holds the grid that initiated the request

    }
*/
function sendRequest(request,callback) {
    if(request === undefined
        || request.requestURL===undefined
        || request.requestOBJ===undefined) 
        return;
    var etsyURL = request.requestURL;
    $.ajax({
        url: etsyURL,
        dataType: 'jsonp',
        timeout: 60000,
        success: function(data) {
            if (data.ok){
                callback(data,request);
            }
            else
                err(data);
        },
        error: function(jqXHR, exception){
            needsLoading--;
            console.log("ajax request timeout");
        }
        
    });


}


/*
 * Takes in a filter object that specifies the details of the query, and convert it into a request url
    obj is required, typeof Filter
 */
function prepareURL (obj,grid,i) {
    //category and type are processed after the query,so they are not embedded in the request url
    //only color is required
    var key = _KEY_ARRAY_[i];
    var url = _URL_ + _LISTING_ + "?" + key;
    if(obj === undefined) return;
    if(obj.color === undefined) return; 
    if(obj.keyword !== undefined && obj.keyword.trim().length >0){
        url+= "&keyword="+obj.keyword.trim();
    }
    if(obj.minPrice !== undefined){
        var minPrice = obj.minPrice.trim();
        if(isNumber(minPrice)){
            minPrice = parseFloat(minPrice);
            if(minPrice>=0 && minPrice < Number.MAX_VALUE)
                url+= "&min_price="+minPrice;
        }
    }
    if(obj.maxPrice !== undefined){
        var maxPrice = obj.maxPrice.trim();
        if(isNumber(maxPrice)){
            maxPrice = parseFloat(maxPrice);
            if(maxPrice>=0 && maxPrice < Number.MAX_VALUE
                && (minPrice===undefined || minPrice <= maxPrice))
                url+= "&max_price="+maxPrice;
        }
    }
    url+= "&color="+obj.color.trim();
    url+="&color_accuracy=" + color_accuracy;
    url+="&limit=" + searchLimit;
    url+="&includes=Images:1,Shop";
    return {
        requestURL : url,
        requestOBJ : obj,
        requestGRID: grid
    };

}


/*
* Checked if this filter obj is cached
*/
function isCached (obj) {
    return obj!==undefined && resultCache[obj.key()]!==undefined;
}

/*
* Put the obj into the cache 
*/
function cache(obj,result){
    if(obj===undefined) return;
    resultCache[obj.key()] = result;
}

/*
* Read the result for the given filter from the cache
*/
function readFromCache (obj) {
    if(obj === undefined) return undefined;
    return resultCache[obj.key()];
}


/*
*   Takes in an object sent back from etsy.com with listings.
*   Return the most popular listings under the given filter, or undefined if no item found.
*/
function findMostPopular (data,filter) {
    if(data.count <= 0)
        return undefined;
    var l = data.results;
    var result = undefined; //the most popular listing to return for display.

    for(var i =0;i<l.length; i++){

        var o = l[i];
        
        var is_supply = o.is_supply;
        var when_made = o.when_made;
        var who_made = o.who_made;
        var num_favorers = o.num_favorers;
        var category= (o.category_path===undefined)? undefined : o.category_path[0];
        var price = o.price;
        var type = filter.filterType;
        var cat  = filter.category;


        if(category !== undefined) category =  category.toLowerCase();
        if(type !== undefined) type = type.toLowerCase();
        
        if(
            //image can't be duplicate
            storedImages.indexOf(o.Images[0].url_75x75) === -1
            &&
            //typeMatch
            (
                type==="all" || type === undefined ||
                (type !== undefined && type.indexOf("handmade")!== -1 && who_made===I_DID ) ||
                (type !== undefined && type.indexOf("vintage") !== -1 && vintages.indexOf(when_made) !== -1) ||
                (type !== undefined && type.indexOf("supplies")!== -1 && is_supply=== "true")
            )
            &&
            //categoryMatch
            (
                cat === "all" || cat === undefined || (cat != undefined && cat.indexOf(category)!== -1)
            )
            &&
            //price range match
            (
                (filter.minPrice===undefined && filter.maxPrice === undefined) ||
                (filter.minPrice !== undefined && isNumber(filter.minPrice) && parseFloat(price)>=parseFloat(filter.minPrice)
                    && filter.maxPrice !== undefined && isNumber(filter.maxPrice) && parseFloat(price) <= parseFloat(filter.maxPrice)) 

            )
            //num_favorer check
            &&
            (
                result === undefined || //currently no matching item yet
                result.num_favorers === undefined ||
                (num_favorers !== undefined && isNumber(num_favorers) &&
                    parseFloat(num_favorers) > parseFloat(result.num_favorers))
            )
            
        )
        {
            result = o;
        } 
    }
    if(result !== undefined && result.Images!== undefined && result.Images[0]!==undefined)
        storedImages.push(result.Images[0].url_75x75);


    return result;

}


/*
* Check if n is a number
*/
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}



/*
*   Update one grid on the color map with the given data from etsy.com or cache.
*   Cache the result for faster read later on.
*   First find the most popular item among all the items returned, then use DOM manipulation 
*   to update the UI.
    
    request should be of the following form
    request = {
         requestURL : ""  //typeof String, the url to send, generated by prepareURL()
         requestOBJ : obj //typeof Filter, the filter that holds the request specification
         requestGRID: obj //typeof Object, the grid that holds the grid that initiated the request

     }

    This function also appends a pop-over window to each grid with an item found.

    Note: grid is not updated if page (color level, search form) is updated before the result 
    of the previous request completes. In this case, the result of the previous request is simply cached
    but not displayed.
*
*/
function updateOneGrid(data,request){
    if(data === undefined || request === undefined){
        var style = "background-image:url('img/no-results.jpg');opacity:1;";
        grid.el.html("<div class='image gridAfter' style="+ style + "></div>");
        needsLoading--;
        return;
    }
    var grid = request.requestGRID;
    var filter = request.requestOBJ;
    cache(filter,data);
    if(grid.lvl !== zoomLevel){
        console.log("request didn't display because saved zoomlvl= " + grid.lvl +" but currr is " + zoomLevel);
        return;
    } 

    
    var result = findMostPopular(data,filter);
    if(result === undefined){
        var style = "background-image:url('img/no-results.jpg');opacity:1;";
        grid.el.html("<div class='image gridAfter' style="+ style + "></div>");
    }
    else{
        var style = "background-image:url('"+ result.Images[0].url_75x75+"');";
        var price = result.price;
        var description = result.description;
        var title = result.title;
        if(title.length >= 30)
            title = title.substring(0,27) + "...";
        var url = result.url;
        var shopURL = result.Shop.url;
        var shopName = result.Shop.shop_name; 
        if(description.length >= 110)
            description = description.substring(0,110) + "...";

        var content = "<div class=pull-left><div class=shop>from <a href="+shopURL+" target=_blank>"+shopName+"</a></div><div class=description>"+description+"</div></div><div class=pull-right><div class=info><div class=price>$"+price+"</div><div class=link><a href="+url+" target=_blank><button class=btn>more</button></a></div></div></div>";
        grid.el.html("<div class='image popup-marker before' data-placement='bottom' data-content='"+content+"' data-original-title='"+title+"'style="+ style + " id='a"+ grid.id+ "'></div>");
        $(grid.el).children()[0].className = "image popup-marker before after";
        $(grid.el).addClass("gridAfter");

        $('#a'+grid.id).popover({
        html: true,
        trigger: 'manual'}).click(function(e) { 
            if(prevID !== undefined && prevID === grid.id){
                $('#a'+grid.id).popover('hide');
                prevID = undefined;
                return;
            }
            prevID = grid.id;
            var l = ($('.popup-marker'));
            for(var i=0;i<l.length;i++){
                if( $(l[i])[0].id === 'a'+grid.id) continue;
                ($(l[i]).popover('hide'));  
            }
            $(this).popover('show');
            clicked=true;
            e.preventDefault();
        });
    }
    needsLoading--;
    if(needsLoading===0){
        console.log("request all done");
        enableAll();
        $('#loader-wrapper').fadeOut('slow');
        $('#wait-message').fadeOut('slow');
    }
}   

function run () {
    //      alert('1');
    if(needsLoading!==0){
        $('#wait-message').css('display','block');
        setTimeout(function  () {
            $('#wait-message').css('display','none');
        },3000);
        return;
    } //wait for current request 
     $('#loader-wrapper').fadeIn('slow');
    var allGrids = new Array();
    needsLoading = 48;
    storedImages = new Array();

    console.log("request initiated");
    disableAll();
    $.each(grids, function(index, value) {
        // get hsl value of this grid
        var gridId = value.id;
        var hsl = getHsl(gridId, frame);
        var hslStr = Math.floor(hsl[0]) + "," + 
                     Math.floor(hsl[1]) + "," +
                     Math.floor(hsl[2]);


        var element = $(this);
        // scale hsl, convert to hsv and scale back
        var hsv = hsl2hsv(hsl[0], hsl[1]/100, hsl[2]/100);
        hsv = [hsv[0], hsv[1]*100, hsv[2]*100];
        hsv[0] = Math.floor(hsv[0]);
        hsv[1] = Math.floor(hsv[1]);
        hsv[2] = Math.floor(hsv[2]);
        
        allGrids.push({
            id : gridId,
            color : hsv[0]+","+hsv[1]+","+hsv[2],
            el : element,
            lvl : zoomLevel
        });
    });

    var i1=0, i2=8,i3 = 16,i4=24,i5=32,i6=40;    
    var loadId1 = setInterval(function() {
        if(i1>=8){
            clearInterval(loadId1);
        }
        else{
            var grid = allGrids[i1];
            var filter = new Filter();
            filter.color = grid.color;
            update(filter);

            if(readFromCache(filter) === undefined){
                sendRequest(prepareURL(filter,grid,0),updateOneGrid);
            }
            else{
                console.log(filter);
                console.log(readFromCache(filter));
                console.log("read from cache");
                updateOneGrid(readFromCache(filter),prepareURL(filter,grid,0));
            }
            
            
            i1++;
        }
    },205);

    var loadId2 = setInterval(function() {
        if(i2>=16){
            clearInterval(loadId2);
        }
        else{
            var grid = allGrids[i2];
            var filter = new Filter();
            filter.color = grid.color;
            update(filter);

            if(readFromCache(filter) === undefined){
                sendRequest(prepareURL(filter,grid,1),updateOneGrid);
            }
            else{
                updateOneGrid(readFromCache(filter),prepareURL(filter,grid,1));
            }
            
            i2++;
        }
    },205);

    var loadId3 = setInterval(function() {
        if(i3>=24){
            clearInterval(loadId3);
        }
        else{
            var grid = allGrids[i3];
            var filter = new Filter();
            filter.color = grid.color;
            update(filter);

            if(readFromCache(filter) === undefined){
                sendRequest(prepareURL(filter,grid,2),updateOneGrid);
            }
            else{
                updateOneGrid(readFromCache(filter),prepareURL(filter,grid,2));
            }
            
            i3++;
        }
    },205);

    var loadId4 = setInterval(function() {
        if(i4>=32){
            clearInterval(loadId4);
        }
        else{
            var grid = allGrids[i4];
            var filter = new Filter();
            filter.color = grid.color;
            update(filter);

            if(readFromCache(filter) === undefined){
                sendRequest(prepareURL(filter,grid,3),updateOneGrid);
            }
            else{
                updateOneGrid(readFromCache(filter),prepareURL(filter,grid,3));
            }
            
            i4++;
        }
    },205);

    var loadId5 = setInterval(function() {
        if(i5>=40){
            clearInterval(loadId5);
        }
        else{
            var grid = allGrids[i5];
            var filter = new Filter();
            filter.color = grid.color;
            update(filter);

            if(readFromCache(filter) === undefined){
                sendRequest(prepareURL(filter,grid,4),updateOneGrid);
            }
            else{
                updateOneGrid(readFromCache(filter),prepareURL(filter,grid,4));
            }
            i5++;
        }
    },205);

    var loadId6 = setInterval(function() {
        if(i6>=48){
            clearInterval(loadId6);
        }
        else{
            var grid = allGrids[i6];
            var filter = new Filter();
            filter.color = grid.color;
            update(filter);

            if(readFromCache(filter) === undefined){
                sendRequest(prepareURL(filter,grid,5),updateOneGrid);
            }
            else{
                updateOneGrid(readFromCache(filter),prepareURL(filter,grid,5));
            }
            i6++;
        }
    },205);    

}


function update(filter){
    // update search keyword
    //filter.keyword = document.getElementById('keyword').value;

    // update type
    if ($("#type-all").attr("checked") === "checked"){
        filter.filterType = "all";
    }
    else {
        $("form.type input.checkbox:checked").each(function(){
            filter.filterType += $(this).attr("value");
        });
    }

    // update price range
    if ($("#price-range").attr("checked") === "checked"){
        var priceRange = $("#price").attr("value");
        var delimLoc = priceRange.indexOf(";");
        filter.minPrice = priceRange.substring(0,delimLoc);
        filter.maxPrice = priceRange.substring(delimLoc+1,priceRange.length);
    }

    // update categories
    if ($("#category-all").attr("checked") === "checked"){
        filter.category = "all";
    }
    else {
        $("form.categories input.checkbox:checked").each(function(){
            filter.category += $(this).attr("value");
        });
    }
}

function println (data) {
    console.log(data);
}

function err(data){
    console.log(FAIL_MSG);
    console.log(data);
    alert(FAIL_MSG);
}
