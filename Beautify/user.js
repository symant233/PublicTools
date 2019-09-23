// ==UserScript==
// @name         Beautify
// @namespace    undefined
// @version      0.0.2
// @description  美化<误>各网页界面
// @author       symant233
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match        *://cn.vuejs.org/v2/guide/*
// @match        *://www.runoob.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    function vue_doc(){
        //缩小导航栏
        $('body').css("padding-top", "43px");
        $('#header').css({"padding": "0px", "height": "43px", "box-shadow": "0px 0px 5px 0px rgba(0,0,0,0.2)"});
        $('#logo').css("padding-left", "10px");
        $('#nav').css("top", "1px");
        $('.sidebar').css("top", "43px");
        $('.sidebar-inner').css("padding-top", "13px");
        // 更改scrollbar样式
        $('body').append('<style>::-webkit-scrollbar{width:10px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#aaa}::-webkit-scrollbar-thumb:hover{background:#777}</style>')
    }

    function runoob() {
        //隐藏头部logo 移动搜索框位置到navbar
        $('.pc-nav').append(`<form action="//www.runoob.com/" target="_blank" style="display: inline;">
            <input class="placeholder" id="s" name="s" placeholder="搜索……" autocomplete="off"></form>`);
        $('.logo-search').remove();
        $('.col.nav').css("padding-top", "5px");
        $('#sidebar-right-re').parent().remove(); //右侧广告
        $('.feedback-btn').remove(); //反馈按钮
        $('.qrcode').remove; //右侧悬浮二维码
    }

    var domain = document.domain;
    if (domain == 'cn.vuejs.org') {
        vue_doc();
    }
    else if (domain == 'www.runoob.com') {
        runoob();
    }
})();