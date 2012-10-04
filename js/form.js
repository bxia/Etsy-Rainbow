window.onload = function(){

    var sliderVal = $("#price".value);
    console.log(sliderVal);

    // send search query
    $("#search").submit(function(event){
        event.preventDefault();
        var keyword = document.getElementById('keyword').value;
        // check if search is empty
        if(keyword !== undefined
            && keyword.trim().length >0){
            update();
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
        update();
    });
    $("#type-all").change(function(){
        $("form.type input.checkbox").each(function(){ // uncheck all checkboxes if "all" is selected
            $(this).attr("checked", false);
        })
        update();
    });


    // handle price slider toggling

    $("#price-slider").hide();              // hide slider at first
    $("#price-all").change(function(){       // hide slider if all is chosen, adjust margin
        $("#price-slider").slideUp("fast");
        //$('form.price').animate({ marginTop: '20px'}, 200);
        $("form.price").css({"margin-bottom": "20px"});
        update();
    });
    $("#price-range").change(function(){     // show slider if range is chosen, adjust margin
         $("#price-slider").slideDown("fast");
         $("form.price").css({"margin-bottom": "70px"});
         update();
    });

    $(".jslider-pointer").click(function(){
        update();
    })



    // handle category selection

    $("form.categories input.checkbox").click(function(){  // check "all" if none selected, uncheck if some selected
        if ($("form.categories input.checkbox:checked").length === 0){
            $("#category-all").attr("checked", true);
        }
        else {
            $("#category-all").attr("checked", false);
        }
        update();
    });
    $("#category-all").change(function(){
        $("form.categories input.checkbox").each(function(){ // uncheck all checkboxes if "all" is selected
            $(this).attr("checked", false);
        })
        update();
    });

}


function update(){
    console.log("updating");
}