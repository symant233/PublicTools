// ==UserScript==
// @name         Beautify
// @namespace    undefined
// @version      0.0.1
// @description  美化<误>各网页界面
// @author       symant233
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match        *://cn.vuejs.org/v2/guide/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    function vue_doc(){
        $('body').css("padding-top", "45px");
        $('#header').css({"padding": "0px", "height": "45px"});
        $('#logo').css("padding-left", "10px");
        $('#nav').css("top", "0");
        $('.sidebar').css("top", "45px");
        $('.sidebar-inner').css("padding-top", "13px");
    }
    vue_doc();
})();