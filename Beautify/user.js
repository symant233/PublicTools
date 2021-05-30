// ==UserScript==
// @name         Beautify
// @namespace    https://github.com/symant233
// @version      0.0.20
// @description  美化<误>各网页界面
// @author       symant233
// @icon         https://cdn.jsdelivr.net/gh/symant233/PublicTools/Beautify/Bkela.png
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match        https://cn.vuejs.org/v2/*
// @match        https://www.runoob.com/*
// @match        https://www.zxzj.me/*
// @match        https://blog.csdn.net/*
// @match        https://es6.ruanyifeng.com/*
// @match        https://wenku.baidu.com/*
// @match        https://didi.github.io/cube-ui/*
// @match        https://www.bilibili.com/*
// @match        https://cn.bing.com/search?q=*
// @match        https://duckduckgo.com/?q=*
// @match        https://baike.baidu.com/*
// @match        https://yz.chsi.com.cn/sytj/tj/*
// @match        https://www.30secondsofcode.org/*
// @match        https://developer.mozilla.org/*
// @match        https://juejin.cn/editor/drafts/*
// @match        https://xui.ptlogin2.qq.com/cgi-bin/xlogin*
// @match        https://steamcommunity.com/*
// @match        https://www.pixiv.net/*
// @match        https://live.bilibili.com/*
// @match        https://frontendwingman.com/*
// @match        https://cloud.tencent.com/developer/*
// @match        https://www.npmjs.com/*
// @match        https://www.zhihu.com/*
// @match        https://fanyi.baidu.com/*
// @license      GPL-3.0
// @homepageURL  https://github.com/symant233/PublicTools
// @supportURL   https://github.com/symant233/PublicTools/issues
// ==/UserScript==

;(function() {
    'use strict';
    if (!$) { var $ = window.jQuery; }
    $('head').append(`<style>
    html{overflow:overlay;}
    ::-webkit-scrollbar {
        height: 16px;
        width: 11px;
        background-color: initial;
    }::-webkit-scrollbar-button {height: 0;}
    ::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,.2);
        background-clip: padding-box;
        border: solid transparent;
        border-width: 1px 1px 1px 1px;
        box-shadow: inset 1px 1px 0 rgb(0 0 0 / 10%), inset 0 -1px 0 rgb(0 0 0 / 7%);
    }::-webkit-scrollbar-thumb:hover{
        background: rgba(0,0,0,.4);
        background-clip: padding-box;
    }::-webkit-scrollbar-thumb:active{
        background: rgba(0,0,0,.5);
        background-clip: padding-box;
    }::-webkit-scrollbar-track {
        background-clip: padding-box;
        border: solid transparent;
        border-width: 0 0 0 4px;
    }</style>`);
    (function(left, right, color) {
        const arg = [
            `%c ${left} %c ${right} `,
            'padding:1px;border-radius:3px 0 0 3px;color:#fff;background:#606060;',
            `padding:1px;border-radius:0 3px 3px 0;color:#fff;background:${color}`
        ];
        console.log(...arg);
    })('Loaded', 'Beautify', '#e99010');
    switch (document.domain){
        case 'cn.vuejs.org':
            //缩小导航栏
            $('body').css("padding-top", "43px");
            $('#header').css({"padding": "0px", "height": "43px", "box-shadow": "0px 0px 5px 0px rgba(0,0,0,0.2)"});
            $('#logo').css("padding-left", "10px");
            $('#nav').css("top", "1px");
            $('.sidebar').css("top", "43px");
            $('.sidebar-inner').css("padding-top", "13px");
            break;
        case 'www.runoob.com':
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
            break;
        case 'www.zxzj.me':
            //缩小间距 省得用滚轮
            $('.stui-header').css("margin", "0px");
            $('.stui-page__item').css("margin", "0px");
            $('.stui-screen').css("padding", "0px");
            //$('.stui-vodlist li').css("padding", "0px 10px");
            $('.stui-pannel').css("margin-bottom", "0px");
            //$('.head.clearfix').css("padding", "5px");
            break;
        case 'csdn.net': {
            console.log('Beautify@ try to click');
            var r = $('.btn-readmore')[0].click();
            console.log('Beautify@ clicked:' + r);
            break;
        }
        case 'es6.ruanyifeng.com':
            $('#content').css("width", "63%");
            $('#content').css("padding-bottom", "0px");
            $('#back_to_top').css("right", "35px");
            $('#edit').css("right", "35px");
            $('#theme').css("right", "35px");
            $('#flip').css("right", "10px");
            break;
        case 'wenku.baidu.com':
            setTimeout(function() {
                console.log('show more');
                $('.btn-know').click();
                $('.moreBtn').click();
            }, 1500 );
            break;
        case 'didi.github.io':
            setTimeout(function() {
                document.getElementsByClassName('navigator')[0].style.height = "54px";
                document.getElementsByClassName('navigator')[0].style.lineHeight = "54px";
                document.getElementsByClassName('home-view')[0].style.paddingTop = "38px";
            }, 500 );
            break;
        case 'www.bilibili.com': {
            // 宽屏模式 来自 https://github.com/bilibili-helper/bilibili-helper-o/blob/637d0741b0d81154c7bc330f8fce19b926f5a71b/src/js/modules/videoWiden/UI/index.js
            function setWide () {
                const btn = document.querySelector('.bilibili-player-video-btn-widescreen:not(.closed)');
                if (btn && !btn.getAttribute('bilibili-helper-data')) {
                    btn.setAttribute('bilibili-helper-data', true);
                    btn.click();
                }
            }
            new Promise(resolve => {
                setWide();
                const player = document.querySelector('#bofqi, #bilibiliPlayer');
                if (player) {
                    new MutationObserver((mutationList) => {
                        mutationList.forEach((mutation) => {
                            if (mutation.oldValue) {
                                setWide();
                            }
                        });
                    }).observe(player, {
                        attributes: true,
                        attributeOldValue: true,
                        subtree: true,
                    });
                }
                resolve();
            });
            // PiP 画中画模式快捷键`p`
            document.addEventListener('keyup', function (e) {
                if (e.key === 'p') {
                    $('.bilibili-player-iconfont-pip-on').click();
                } else if (e.key === 'ArrowRight' & e.altKey === true) {
                    $('.bilibili-player-video-btn-next').click();
                }
            }, false);
            break;
        }
        case 'cn.bing.com': {
            $("head").append('<style>#b_content{padding-left: 85px;}</style>');
            break;
        }
        case 'duckduckgo.com': {
            $("head").append('<style>#links_wrapper{padding-left: 108px;}</style>');
            break;
        }
        case 'baike.baidu.com':
            $('.content-wrapper .content').css('font', 'unset'); // 移除阴间字体
            //$('#sl-player-el-video').trigger('pause'); //暂停自动播放
            //$('.sl-player-el-close').click();
            $('#sl-player-el-video').remove(); // 删除播放器
            $('.sl-player-el-container').remove(); // 删除播放器容器
            $("head").append(`<style>.lemmaWgt-searchHeader{height:55px;}
            .wgt-searchbar-new.wgt-searchbar .logo-container{padding: 6px 0;}
            .wgt-searchbar-new.wgt-searchbar .search{padding: 7px 0;}
            </style>`);
            break;
        case 'yz.chsi.com.cn': {
            // 去除不符合不能调剂的信息
            function filter() {
                const tmp = $("#content-qecxList > table > tbody").children();
                for ( let i in tmp ) {
                    if ( tmp[i].lastElementChild.innerText.includes("不符合") || tmp[i].lastElementChild.firstElementChild.title.includes('不符合') ) {
                        tmp[i].remove();
                        console.log(tmp[i].textContent + 'removed');
                    }
                }
            }
            $('<button id="btn-filter" style="width: 50px;">过滤</button>').appendTo('.ewm-fix');
            $('#btn-filter').click(filter);
            document.addEventListener('keyup', function (e) {
                if (e.key === 'Enter' && e.ctrlKey) {
                    $('.tj-seach-btn').click();
                }
            }, false);
            break;
        }
        case 'www.30secondsofcode.org':
            $("head").append('<style>.nav-bar{height:auto;}</style>');
            break;
        case 'developer.mozilla.org': {
            $("head").append(`<style>
            .page-header{padding:12px 24px;}
            .breadcrumb-locale-container{margin:0px;}
            .logo{height:59px;}
            #license{margin:0px;}
            .localized-content-note.notecard.neutral{display:none;}
            #beautify-turn:after {content:"|";display:inline-block;margin:0 6px;}
            </style>`);
            let link = document.location.href;
            link = link.replace('/en-US/', '/zh-CN/');
            $(".language-toggle").prepend(`<li><a id="beautify-turn" href="${link}">📌CN</a></li>`);
            $('.language-icon').remove();
            break;
        }
        case 'juejin.cn':
            $("head").append(`<style>
            .header.editor-header{height:4rem;}
            .main .bytemd{height:calc(100vh - 4rem);}
            </style>`);
            break;
        case 'xui.ptlogin2.qq.com':
            // 服了 graph.qq.com 套了个 iframe 我说怎么死活没有用...
            // 自动启用账号密码登录 去他大爷的扫码登录
            $("head").append(`<style>
            .web_qr_login {display:block !important;}
            .qlogin{display:none !important;}
            #bottom_qlogin{display:none !important;}
            </style>`);
            break;
        case 'steamcommunity.com': {
            setInterval(()=>{
                try {
                    document.getElementById('market_sell_dialog_accept_ssa').checked = true;
                } catch (err) {}
                try {
                    document.getElementById('market_buyorder_dialog_accept_ssa').checked = true;
                } catch (err) {}
            }, 2000);
            break;
        }
        case 'www.pixiv.net':
            // 需要与脚本配合使用 https://greasyfork.org/zh-CN/scripts/34153-pixiv-plus
            $("head").append(`<style>
            select#select-ahao-favorites {
                font-size: 14px;
                line-height: 22px;
                flex: 1 1 auto;
                height: auto;
                margin: 0px -9px;
                padding: 9px 8px;
                border: none;
                border-radius: 4px;
                color: rgba(0, 0, 0, 0.64);
                background-color: rgba(0, 0, 0, 0.04);
                transition: background-color 0.2s ease 0s, color 0.2s ease 0s;
            }</style>`);
            break;
        case 'live.bilibili.com': {
            const cssText = `<style>
            .side-bar-popup-cntr{bottom:5% !important;height:84% !important;}
            .section-content-cntr{height:556px !important;}
            .title-length-limit{max-width:unset !important;}
            </style>`;
            $("head").append(cssText);
            break;
        }
        case 'frontendwingman.com':
            try {
                // credit: github.com/invobzvr
                Object.defineProperty(document.querySelector('.theme-container').__vue__,'locked',{
                    get:()=>true,
                    set:function(val){this._data.locked=true}
                });
                document.querySelector('.theme-container').__vue__.locked = true;
            } catch (e) {
                console.warn('Beautify: 自动解锁失效.');
            }
            break;
        case 'cloud.tencent.com':
            $("head").append(`<style>
            .doc-main-hd {
                margin-bottom: 24px;
                padding-bottom: 28px;
                border-bottom: 1px solid #e5e5e5;
            }</style>`);
            break;
        case 'www.npmjs.com':
            $("header > div:nth-child(2)").css("display", "none");
            $(".center-ns").css("padding-bottom", "unset");
            break;
        case 'fanyi.baidu.com':
            $("head").append(`<style>
            .download-app{display:none;}
            .header{padding:3px 0 7px 0;}
            .doc-whole-container{height:100%;}
            .doc-feedback-group{display:none;}
            .doc-trans-view-wrap{
                width:unset;
                height: 88%;
                margin-top: -38px;
            }</style>`);
            break;
        default:
            break;
    }
})();