import re
import codecs
import requests
from lxml.html import fromstring

START_CHAPTER = 700
DOMAIN = 'https://www.wxsy.net'
LINK = 'https://www.wxsy.net/novel/43451/'
f = codecs.open('output.txt', 'a', 'utf-8')


def onePage(link):
    text = requests.get(link).text
    root = fromstring(text)
    titlePattern = r'class="color7">(.+)</a>'
    title = re.findall(titlePattern, text)[0]
    print('Downloading {} {}'.format(link, title))
    root = fromstring(text)
    content = root.find_class('pt-read-text')[0].text_content()
    content = content.replace(' ', '')
    content = content.replace('\n\n\n\n', '')
    content = content.replace('\n\n', '\n')
    content = content.replace('首发网址htTps://m.wxsy.net\r\n', '')

    f.write('\n{}\n{}'.format(title, content))


def mainPage(link: str, start=0):
    rs = requests.get(link)
    arr = []
    root = fromstring(rs.text)
    tmp = root.find_class('compulsory-row-one')
    for item in tmp:
        arr.append(DOMAIN + item.attrib['href'])
    for l in arr[start:]:
        onePage(l)


if __name__ == "__main__":
    mainPage(LINK, START_CHAPTER)
