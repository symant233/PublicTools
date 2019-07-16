import requests
from bs4 import BeautifulSoup
from time import sleep
import re

link = 'https://betaclouds.net/auth/login'
proxy = {
    'http': 'http://127.0.0.1:1080',
    'https': 'http://127.0.0.1:1080'
}


def betaclouds(data: dict) -> None:
    """data = {'email':'yours@domain.com', 'passwd':'password'}"""

    data['remember_me'] = 'week'

    session = requests.Session()
    session.proxies = proxy
    r = session.post(link, data=data)

    checkin = session.post('https://betaclouds.net/user/checkin')
    try:
        text = checkin.json()
        print(data['email'], end=' ')  # 当前账号
    except:
        print('\nPlease set global proxy, this site is banned.')
        exit()
    print(text['msg'], end=' ')  # 签到详情
    sleep(0.5)

    logged_in = session.get("https://betaclouds.net/user")
    bs = BeautifulSoup(logged_in.content, features="html.parser")
    code_list = re.findall('<code>(.*?)</code>', str(logged_in.content))

    check_in_date = code_list[2]
    print('check_in:', check_in_date)

    tag = bs.findAll('dl', {'class': 'dl-horizontal'})[0]
    list = tag.find_all('dt')
    list = list + tag.find_all('dd')
    for i in range(3):  # 流量详情
        print(list[i].text, list[i+3].text, end=', ')
    # 订阅链接
    sub = code_list[1]
    print('\n', sub)


if __name__ == "__main__":
    """简单示例
    data = {'email':'name@gmail.com', 'passwd':'abcd1234'}
    betaclouds(data)
    """
    
    import sqlite3
    conn = sqlite3.connect('../private.db')
    curs = conn.cursor()
    query = "SELECT * FROM betaclouds"
    curs.execute(query)
    lines = curs.fetchall()

    data = {}
    for line in lines:
        data['email'] = line[0]
        data['passwd'] = line[1]
        data['remember_me'] = line[2]
        sleep(1)
        betaclouds(data)
