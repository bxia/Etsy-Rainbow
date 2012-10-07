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

    $("#filters").click(function  () {
        if(needsLoading!==0){
        $('#wait-message').css('display','block');

        setTimeout(function  () {
            $('#wait-message').css('display','none');
        },5000);
        return;
    } //wait for current request  
    });

    // handle type selection

    $("form.type input.checkbox").click(function(){  // check "all" if none selected, uncheck if some selected
        if ($("form.type input.checkbox:checked").length === 0){
            $("#type-all").attr("checked", true);
        }
        else {
            $("#type-all").attr("checked", false);
        }
        drawMap();
    });
    $("#type-all").change(function(){
        $("form.type input.checkbox").each(function(){ // uncheck all checkboxes if "all" is selected
            $(this).attr("checked", false);
        })
        drawMap();
    });


    // handle price slider toggling

    $("#price-slider").hide();              // hide slider at first
    $("#price-all").change(function(){       // hide slider if all is chosen, adjust margin
        $("#price-slider").slideUp("fast");
        //$('form.price').animate({ marginTop: '20px'}, 200);
        $("form.price").css({"margin-bottom": "20px"});
        drawMap();
    });
    $("#price-range").change(function(){     // show slider if range is chosen, adjust margin
         $("#price-slider").slideDown("fast");
         $("form.price").css({"margin-bottom": "70px"});
         drawMap();
    });

    $(".jslider-pointer").click(function(){
        drawMap();
    });



    // handle category selection

    $("form.categories input.checkbox").click(function(){  // check "all" if none selected, uncheck if some selected
        if ($("form.categories input.checkbox:checked").length === 0){
            $("#category-all").attr("checked", true);
        }
        else {
            $("#category-all").attr("checked", false);
        }
        drawMap();
    });
    $("#category-all").change(function(){
        $("form.categories input.checkbox").each(function(){ // uncheck all checkboxes if "all" is selected
            $(this).attr("checked", false);
        })
        drawMap();
    });
    needsLoading = 0;

    start();

   
}




function disableAll(){
    $("input").attr("disabled", "disabled");
    // $("#pan-up").attr("class", "disabled");
    // $("#pan-down").attr("class", "disabled");
    // $("#pan-left").attr("class", "disabled");
    // $("#pan-right").attr("class", "disabled");
    // $("#pan-center").attr("class", "disabled");
    // $("#zoom-in").attr("class", "disabled");
    // $("#zoom-out").attr("class", "disabled");
}

function enableAll(){
    $("input").removeAttr("disabled");
    // $("#pan-up").attr("class", "enabled");
    // $("#pan-down").attr("class", "enabled");
    // $("#pan-left").attr("class", "enabled");
    // $("#pan-right").attr("class", "enabled");
    // $("#pan-center").attr("class", "enabled");
    // $("#zoom-in").attr("class", "enabled");
    // $("#zoom-out").attr("class", "enabled");
}






