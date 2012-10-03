
var _URL_ = "http://api.etsy.com/v2/public";
var _LISTING_ = "/listings/active.js";
var _KEY_ = "&api_key=22u5zgz7eze80ymvmqshkdti";
var a,b;
var OK = 1;
var ERR = -1;
var INVALID_URL = "Invalid etsy url. Can't proceed to ajax request";
var SUCC_MSG = "Ajax request succeeded";
var FAIL_MSG = "Ajax request failed";

/*
 * Make a etsy url request through ajax and use callback to process the data
 */
// function sendRequest(requestURL,callBack){
//     // etsyURL = "http://api.etsy.com/v2/public/listings/active.js?keywords="+
//     //     terms+"&includes=Images,Shop,User:1&api_key="+api_key;
//     $.ajax({
//         url: requestURL,
//         dataType: 'jsonp',
//         success: function(data) {
//             callBack(data);
//         },
//         error: function(data) {
//             err(data);
//         }
//     });
// }
function sendRequest(requestURL,callback) {
            // api_key = "22u5zgz7eze80ymvmqshkdti";
            // terms = $('#etsy-terms').val();
            // etsyURL = "http://openapi.etsy.com/v2/listings/active.js?keywords="+
            //     terms+"&limit=120&color=0,100,60&includes=Images:1&api_key="+api_key;
            var etsyURL = requestURL;

          
            $.ajax({
                url: etsyURL,
                dataType: 'jsonp',
                success: function(data) {
                    a = new Date().getTime();
                    console.log(a-b);
                    if (data.ok) {
                        callback(data);
                    } 
                    else{
                        err(data);
                    }
                }
                
            });

            return false;
        }

/*
 * Takes in a JSON object that specifies the details of the query
    obj= {
        keyword: '',(string)
        color: ''(string)
        minPrice:'',(double>=0)
        maxPrice:'',(double>=0)
        type:'', (enum(handmade,vintage,supplies))
        category:'' (string),

    }

 */
function prepareURL (obj) {
    //category and type are processed after the query,so they are not embedded in the request url
    //only color is required

    var url = _URL_ + _LISTING_ + "?" + _KEY_;
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
    url+="&color_accuracy=20";
    url+="&limit=15";
    return url;

}


/*
* Check if n is a number
*/
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


function run () {
    b = new Date().getTime();
    console.log(b);
    var obj = {
        keyword : "book",
        color : "0,100,60",
        minPrice : "5",
        maxPrice : "50"
    }
    console.log(prepareURL(obj));
	sendRequest(prepareURL(obj),print);
}

function print (data) {
	console.log(data);
}

function err(data){
    console.log(FAIL_MSG);
    console.log(data);
    alert(FAIL_MSG);
}