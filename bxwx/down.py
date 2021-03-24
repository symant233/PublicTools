import re
import codecs
import requests
from bs4 import BeautifulSoup

LINK = 'https://www.bxwxorg.com/read/127577/'
f = codecs.open('output.txt', 'a', 'utf-8')

def fill(num):
    return '{}{}.html'.format(LINK, num)

def onePage(num):
    link = fill(num)
    rs = requests.get(link)
    soup = BeautifulSoup(rs.text,features="lxml")
    title = soup.h1.text
    print('Downloading {} {}'.format(num, title))
    content = soup.find("div", {"id": "content"}).text
    f.write('\n{}\n{}\n'.format(title, content))


def mainPage(link):
    rs = requests.get(link)
    pattern = r'<a href="https://www\.bxwxorg\.com/read/127577/([0-9]+)\.html">'
    arr = re.findall(pattern, rs.text)[13:] # 切掉前面的最新章节
    for i in arr:
        onePage(i)

if __name__ == "__main__":
    mainPage(LINK)
    f.close()
