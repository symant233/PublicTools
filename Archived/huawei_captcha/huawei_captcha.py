# -*- coding: utf-8 -*-
from time import sleep, time
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from cv2 import cv2
from numpy import zeros, unravel_index
from requests import get
import os
import sys

TEMP = os.getenv('TEMP') + '\\'
# if getattr(sys, 'frozen', False):
#     # running in a bundle (like an .exe 'pyinstaller -F')
#     chromedriver_path = os.path.join(sys._MEIPASS, 'chromedriver.exe')
# else:
#     chromedriver_path = 'chromedriver.exe'


def shadow(alpha, beta, img):
    "alpha对比度 beta亮度 img(cv2打开的)图片"
    blank = zeros(img.shape, img.dtype)
    # dst = alpha * img + beta * blank
    dst = cv2.addWeighted(img, alpha, blank, 1 - alpha, beta)
    return dst


def get_distance(bkg, blk):
    block = cv2.imread(TEMP + blk, 0)
    template = cv2.imread(TEMP + bkg, 0)
    # template = shadow(1, 60, template)
    cv2.imwrite(TEMP + 'template.jpg', template)
    cv2.imwrite(TEMP + 'block.jpg', block)
    block = cv2.imread(TEMP + 'block.jpg')
    block = cv2.cvtColor(block, cv2.COLOR_BGR2GRAY)
    block = shadow(1, -99, block)
    cv2.imwrite(TEMP + 'block.jpg', block)
    block = cv2.imread(TEMP + 'block.jpg')
    template = cv2.imread(TEMP + 'template.jpg')
    result = cv2.matchTemplate(block, template, cv2.TM_CCOEFF_NORMED)
    x, y = unravel_index(result.argmax(), result.shape)
    cv2.rectangle(template, (y, x), (y + 45, x + 45), (7, 233, 150), 2)
    print('x坐标为：%d' % y)
    return y


def svImg(url, name):
    r = get(url)
    with open(TEMP + name, 'wb') as f:
        f.write(r.content)


def get_tracks(distance):
    adpt = (distance - 16) // 3 * 2
    return adpt, distance - adpt + 3


def slide(browser, isd, tracks, distance):
    atn = ActionChains(browser)
    atn.click_and_hold(isd)
    atn.move_by_offset(tracks[0], 0)
    atn.pause(0.01)
    atn.move_by_offset(tracks[1]-3, 0)
    # atn.move_by_offset(-3, 0)
    # atn.pause(0.05)
    atn.release()
    atn.perform()


def chongxintuo():
    while True:
        try:
            print("等待【验证码】按钮中")
            browser.find_element_by_class_name('ics-verify-text').click()
            isd = browser.find_element_by_css_selector(".ics-slider-default")
            break
        except Exception as ex:
            print("ex", ex)
            sleep(0.01)
            continue


def beginAct(is_tuo=1):
    if is_tuo == 1:
        chongxintuo()

    sleep(0.1)
    while True:
        print("等待【验证码响应】中", time())
        try:
            isd = browser.find_element_by_css_selector(".ics-slider-default")
            break
        except Exception as ex:
            print("while", ex)
            sleep(0.1)
            continue
    print("doing..")
    isgi = browser.find_element_by_css_selector('.ics-slider-gap-img')
    isbi = browser.find_element_by_css_selector('.ics-slider-backgrond-img')
    while not isgi.get_attribute('src'):
        sleep(0.01)
    svImg(isgi.get_attribute('src'), 'blk.png')
    svImg(isbi.get_attribute('src'), 'bkg.png')
    distance = get_distance('bkg.png', 'blk.png')
    print(distance)
    # distance=distance-5
    # print("停止中，正式环境中开启下面滑动验证")
    # browser.execute_script("window.alert('停止中，正式环境请开启下面')")
    # return
    if distance < 180 or distance > 280:
        print("特殊情况")
        refresh = browser.find_element_by_css_selector(
            '.ics-slider-footer-refresh-icon')
        refresh.click()
        return beginAct(2)

    tracks = get_tracks(distance)
    slide(browser, isd, tracks, distance)
    # slide(browser, isd, tracks,distance)
    while True:
        try:
            print("检验是否成功")
            sleep(0.1)
            browser.find_element_by_css_selector('.ics-verify-success-btn')

            browser.refresh()

            # sleep(3)
            # beginAct()
            break
        except Exception as ex:
            print("ex_error", ex)
            refresh = browser.find_element_by_css_selector(
                '.ics-slider-footer-refresh-icon')
            refresh.click()

            beginAct(2)
        return True


if __name__ == "__main__":
    chromedriver_path = ""
    browser = webdriver.Chrome(executable_path=chromedriver_path)
    browser.implicitly_wait(3)
    browser.maximize_window()
    browser.get('http://wl.lxhg.com/lxwl/loginAction_denglu')
    beginAct()
    sleep(5)
    browser.quit()
    exit(0)
