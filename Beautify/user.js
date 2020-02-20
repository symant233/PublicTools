// ==UserScript==
// @name         Beautify
// @namespace    undefined
// @version      0.0.5
// @description  美化<误>各网页界面
// @author       symant233
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @include      *://*.*
// @exclude      *://*.chaoxing.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if (!$) { var $ = window.jQuery; }
    $('body').append('<style>::-webkit-scrollbar{width:10px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#aaa}::-webkit-scrollbar-thumb:hover{background:#777}</style>')
    console.log('Tampermonkey script @Beautify loaded.');
    function vue_doc(){
        //缩小导航栏
        $('body').css("padding-top", "43px");
        $('#header').css({"padding": "0px", "height": "43px", "box-shadow": "0px 0px 5px 0px rgba(0,0,0,0.2)"});
        $('#logo').css("padding-left", "10px");
        $('#nav').css("top", "1px");
        $('.sidebar').css("top", "43px");
        $('.sidebar-inner').css("padding-top", "13px");
    }

    function runoob() {
        //隐藏头部logo 移动搜索框位置到navbar
        $('#index-nav').append(`<form action="//www.runoob.com/" target="_blank" style="display: inline;float: right;">
            <input class="placeholder" id="s" name="s" placeholder="搜索……" autocomplete="off"></form>`);
        $('.pc-nav').append(`<form action="//www.runoob.com/" target="_blank" style="display: inline;">
            <input class="placeholder" id="s" name="s" placeholder="搜索……" autocomplete="off"></form>`);
        $('.logo-search').remove();
        $('.col.nav').css("padding-top", "5px");
        $('#sidebar-right-re').parent().remove(); //右侧广告
        $('.feedback-btn').remove(); //反馈按钮
        $('.qrcode').remove; //右侧悬浮二维码
        $('.navigation').css("background", "grey");
        if (document.location.href.split('/')[3] == "try") {
            $('nav').remove();
            $("body").css("padding-top", "60px");
            $('footer').remove();
        }
        $('body').append('<style>::-webkit-scrollbar{width:10px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#aaa}::-webkit-scrollbar-thumb:hover{background:#777}</style>');
    }

    function zxzj() {
        //缩小间距 省的用滚轮
        $('.stui-header').css("margin", "0px");
        $('.stui-page__item').css("margin", "0px");
        $('.stui-screen').css("padding", "0px");
        //$('.stui-vodlist li').css("padding", "0px 10px");
        $('.stui-pannel').css("margin-bottom", "0px");
        //$('.head.clearfix').css("padding", "5px");
    }

    function gorpg() {
        //if (document.URL == "https://www.gorpg.club/k_misign-sign") {$('#JD_sign').click();}
        $('.bus_ads').remove();
        $('.bus_daohan').css("margin", "0px");
    }

    var domain = document.domain;
    switch (domain){
        case 'cn.vuejs.org': {
           vue_doc();
           break;
        }
        case 'www.runoob.com': {
            runoob();
            break;
        }
        case 'www.zxzj.me': {
            zxzj();
            break;
        }
        case 'www.gorpg.club': {
            gorpg();
            break;
        }
        case 'backdoor.sdslabs.co': {
            $('#hints-display').css('display','inline');
            break;
        }
        case 'csdn.net': {
            console.log('Beautify@ try to click');
            var r = $('.btn-readmore')[0].click();
            console.log('Beautify@ clicked:' + r);
            break;
        }
        case 'es6.ruanyifeng.com': {
            $('#content').css("width", "999px");
            $('#content').css("padding-bottom", "0px");
            $('#back_to_top').css("margin-left", "1433px");
            $('#edit').css("margin-left", "1433px");
            $('#flip').css("margin-left", "1373px");
            break;
        }
        default:
            break;
    }
})();