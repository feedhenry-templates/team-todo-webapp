/*
  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
  
  Masking the Window   
*/

function _showMask() {
    var docHeight = $(document).height();
    $("body").append("<div id='overlay'></div>");
    $("#loader").css({'display': 'block'});
    $("#overlay").height(docHeight);
};

function _hideMask() {
    $("#overlay").remove();
    $("#loader").css('display', 'none');
};