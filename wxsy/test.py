import re
import codecs
import requests
from lxml.html import fromstring

link = 'https://www.wxsy.net/novel/43451/read_36107167.html'


text = requests.get(link).text
root = fromstring(text)
titlePattern = r'class="color7">(.+)</a>'
title = re.findall(titlePattern, text)[0]
root = fromstring(text)
content = root.find_class('pt-read-text')[0].text_content()
content = content.replace(' ', '')
content = content.replace('\n\n\n\n', '')
content = content.replace('\n\n', '\n')
content = content.replace('首发网址htTps://m.wxsy.net\r\n', '')


f = codecs.open('output.txt', 'a', 'utf-8')
f.write('\n{}\n{}'.format(title, content))
