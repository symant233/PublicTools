# encoding: utf8
# author: Macr0phag3

from requests import *
import re
from termcolor import colored
import time
import threading

LINK = r''

threads = []
proxies = []

def getProxy(pnum):
    global proxies, num, Num
    while num < Num:
        if len(proxies) == 0:
            if B.acquire():
                print('[+] %s' % colored('get proxy...', 'blue')),
                while 1:
                    try:
                        url = 'http://www.66ip.cn/mo.php?tqsl=%s' % pnum
						# http://www.89ip.cn/tqdl.html?num=%s
						# http://www.66ip.cn/mo.php?tqsl=%s
                        html = get(url).text
                        proxies = set(re.findall(
                            r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]+", html)) - set(ProxyList)
                        if not len(proxies):
                            print('  [-]Waiting')
                            time.sleep(3)
                            continue

                        print(colored('[%d]' % len(proxies))), '%s' % (colored('Done!', 'green'))
                        break
                    except Exception as e:
                        print('\n  [-]Error: ' + str(e))
                        time.sleep(5)
                B.release()


def autoVisit():
    global num, ProxyList, proxies, Num

    url = LINK
    headers = {
        'user-agent': 'Mozilla/5.0 (Linux; Android 7.0; PLUS Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.98 Mobile Safari/537.36'}

    while num < Num:
        if A.acquire():
            # print num
            if proxies:
                proxie = proxies.pop()
                A.release()
            else:
                A.release()
                continue

            if proxie not in ProxyList:
                try:
                    html = get(url, headers=headers, proxies={
                               'http': proxie}, timeout=5).text
                    failed = 0
                except:
                    failed = 1

                B.acquire()
                print(colored('[%d]' % (num), 'yellow')),
                if failed:
                    print('[%s] Failed!' % proxie)
                else:
                    num += 1
                    print('[%s]' % colored(proxie, 'cyan'), colored('Successfully!', 'green'))
                    ProxyList.append(proxie)
                B.release()


A = threading.Lock()
B = threading.Lock()
print('-' * 50)

ProxyList = []
num = 0  # already visited
pnum = 100  # proxies-num
Num = 40  # visit-num

p = threading.Thread(target=getProxy, args=(pnum,))

for i in range(pnum):
    t = threading.Thread(target=autoVisit, args=())
    threads.append(t)

p.start()
for t in threads:
    t.start()

p.join()
for t in threads:
    t.join()

print('\r', ' ' * 50)
print('%s' % colored('[%s]' % num, 'yellow') + colored(' All done!', 'green'))
