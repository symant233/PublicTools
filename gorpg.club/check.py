import requests
import json


s = requests.Session()

def init():    
    s.headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;z',
        # 'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        'content-length': '139',
        'content-type': 'application/x-www-form-urlencoded',
        'dnt': '1',
        'origin': 'https://www.gorpg.club',
        'pragma': 'no-cache',
        'referer': 'https://www.gorpg.club/member.php?mod=logging&action=login',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/77.0.3865.90 Safari/537.36'
    }


def login(user, passwd):
    # AJAX = 'https://static.gorpg.club/data/cache/ajax.js?vop'
    # header = {
    #     'DNT': 1,
    #     'Referer': 'https://www.gorpg.club/',
    #     'Sec-Fetch-Mode': 'no-cors',
    #     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/77.0.3865.90 Safari/537.36'
    # }
    # r = s.get(AJAX, data=header)
    # print(r.content)
    data = {
        'formhash': '0ff19d40',
        'referer': 'https://www.gorpg.club/./',
        'username': user,
        'password': passwd,
        'questionid': '0',
        'answer': ''
    }
    URL = 'https://www.gorpg.club/member.php?mod=logging&action=login&loginsubmit=yes' # 
    r = s.post(URL, data=data)
    print(r.content)

def check():
    r = s.get('https://www.gorpg.club/plugin.php?id=k_misign:sign&operation=qiandao&from=insign&inajax=1&ajaxtarget=JD_sign')
    print(r.content)
    # &formhash=22d83e56

if __name__ == "__main__":
    import sqlite3, os
    working = os.path.dirname(os.path.abspath(__file__))
    os.chdir(working)
    conn = sqlite3.connect('../private.sqlite')
    curs = conn.cursor()

    query = "SELECT * FROM gorpg"
    curs.execute(query)
    lines = curs.fetchall()
    for line in lines:
        init()
        login(line[0], line[1])
        check()