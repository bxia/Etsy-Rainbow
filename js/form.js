////////////////////////////////////////////////////////////////////////
//                        15237 HW4 Unit Project                      //
// Group members: Zi Wang (ziw), Bingying Xia(bxia), Ruoyu Li(ruoyul) //
////////////////////////////////////////////////////////////////////////


window.onload = function(){

    // send search query
    $("#search").submit(function(event){
        event.preventDefault();
        var keyword = document.getElementById('keyword').value;
        // check if search is empty
        if(keyword !== undefined
            && keyword.trim().length >0){
            //update();
        }
    })


    // handle type selection

    $("form.type input.checkbox").click(function(){  // check "all" if none selected, uncheck if some selected
        if ($("form.type input.checkbox:checked").length === 0){
            $("#type-all").attr("checked", true);
        }
        else {
            $("#type-all").attr("checked", false);
        }
        //update();
    });
    $("#type-all").change(function(){
        $("form.type input.checkbox").each(function(){ // uncheck all checkboxes if "all" is selected
            $(this).attr("checked", false);
        })
        //update();
    });


    // handle price slider toggling

    $("#price-slider").hide();              // hide slider at first
    $("#price-all").change(function(){       // hide slider if all is chosen, adjust margin
        $("#price-slider").slideUp("fast");
        //$('form.price').animate({ marginTop: '20px'}, 200);
        $("form.price").css({"margin-bottom": "20px"});
        //update();
    });
    $("#price-range").change(function(){     // show slider if range is chosen, adjust margin
         $("#price-slider").slideDown("fast");
         $("form.price").css({"margin-bottom": "70px"});
         //update();
    });

    $(".jslider-pointer").click(function(){
        //update();
    });



    // handle category selection

    $("form.categories input.checkbox").click(function(){  // check "all" if none selected, uncheck if some selected
        if ($("form.categories input.checkbox:checked").length === 0){
            $("#category-all").attr("checked", true);
        }
        else {
            $("#category-all").attr("checked", false);
        }
        //update();
    });
    $("#category-all").change(function(){
        $("form.categories input.checkbox").each(function(){ // uncheck all checkboxes if "all" is selected
            $(this).attr("checked", false);
        })
        //update();
    });

}



function update(grid){
    var filter = new Filter();

    // update search keyword
    filter.keyword = document.getElementById('keyword').value;

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

    console.log(filter);
   
}

function disableAll(){
    $("input").attr("disabled", "disabled");
    $("#pan-up").attr("class", "disabled");
    $("#pan-down").attr("class", "disabled");
    $("#pan-left").attr("class", "disabled");
    $("#pan-right").attr("class", "disabled");
    $("#pan-center").attr("class", "disabled");
    $("#zoom-in").attr("class", "disabled");
    $("#zoom-out").attr("class", "disabled");
}

function enableAll(){
    $("input").removeAttr("disabled");
    $("#pan-up").attr("class", "enabled");
    $("#pan-down").attr("class", "enabled");
    $("#pan-left").attr("class", "enabled");
    $("#pan-right").attr("class", "enabled");
    $("#pan-center").attr("class", "enabled");
    $("#zoom-in").attr("class", "enabled");
    $("#zoom-out").attr("class", "enabled");
}






