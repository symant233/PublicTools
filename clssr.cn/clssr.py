# coding=UTF-8
import requests
import json
from datetime import datetime


class Clssr:

    def __init__(self):
        print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'), end=' ')
        self.session = requests.Session()
        self.constant = {
            'LOGIN': 'http://clssr.cn/auth/login',
            # 'USER': 'http://clssr.cn/user',
            'CHECK': 'http://clssr.cn/user/checkin'
        }

    def login(self, id, passwd):
        url = self.constant['LOGIN']
        data = {
            'email': id,
            'passwd': passwd,
            'code': ''
        }
        r = self.session.post(url, data=data)
        r = json.loads(r.content.decode())
        print(id.split('@')[0], r['msg'], end=' ')

    def check(self):
        url = self.constant['CHECK']
        r = self.session.post(url)
        r = json.loads(r.content.decode()) # binary string to dict
        print(r['msg'])

if __name__ == "__main__":
    import sqlite3, os
    working = os.path.dirname(os.path.abspath(__file__))
    os.chdir(working)
    conn = sqlite3.connect('../private.sqlite')
    curs = conn.cursor()

    # clssr.cn
    query = "SELECT * FROM clssr"
    curs.execute(query)
    lines = curs.fetchall()
    for line in lines:
        c = Clssr()
        c.login(line[0], line[1])
        c.check()