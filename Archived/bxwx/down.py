import re
import codecs
import requests
import threading
from lxml.html import fromstring

THREAD_NUM = 10
START_CHAPTER = 0
LINK = 'https://www.bxwxorg.com/read/127577/'
FILES = []
for t in range(THREAD_NUM):
    FILES.append(codecs.open('output-{}.txt'.format(t), 'a', 'utf-8'))


def fill(num):
    return '{}{}.html'.format(LINK, num)


def onePage(id, num):
    link = fill(num)
    text = requests.get(link).text
    titlePattern = r'<h1>(.+)</h1>'
    title = re.findall(titlePattern, text)[0]
    print('Downloading {} {}'.format(num, title))
    root = fromstring(text)
    content = root.get_element_by_id('content').text_content()
    FILES[id].write('\n{}\n{}\n'.format(title, content))


def threadDown(arr: list, id: int, start: int, stop: int):
    for j in arr[start:stop]:
        onePage(id, j)


def mainPage(link: str, start=0):
    rs = requests.get(link)
    pattern = r'<a href="/read/\d+/([0-9]+)\.html">'
    arr = re.findall(pattern, rs.text)[start:]
    step = int(len(arr) / THREAD_NUM)
    for i in range(THREAD_NUM):
        if i == 0:
            th = threading.Thread(target=threadDown, args=(arr, i, 0, step, ))
        elif i == (THREAD_NUM - 1):
            th = threading.Thread(target=threadDown, args=(
                arr, i, step * i, len(arr), ))
        else:
            th = threading.Thread(target=threadDown, args=(
                arr, i, step * i, step * (i + 1), ))
        th.start()


if __name__ == "__main__":
    mainPage(LINK, START_CHAPTER)
