# coding=UTF-8
import requests
import json


class Paoluz:

    def __init__(self):
        # print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'), end=' ')
        self.session = requests.Session()
        self.constant = {
            'LOGIN': 'http://paoluz.club/auth/login',
            # 'USER': 'http://paoluz.club/user',
            'CHECK': 'http://paoluz.club/user/checkin'
        }

    def login(self, id, passwd):
        url = self.constant['LOGIN']
        data = {
            'email': id,
            'passwd': passwd,
            'code': ''
        }
        r = self.session.post(url, data=data)
        try:
            r = json.loads(r.content.decode())
            print(id.split('@')[0], r['msg'], end=' ')
        except:
            print(id.split('@')[0], r.status_code, end=' ')

    def check(self):
        url = self.constant['CHECK']
        r = self.session.post(url)
        try:
            r = json.loads(r.content.decode())  # binary string to dict
            print(r['msg'])
        except:
            print('checkin: ', r.status_code)


if __name__ == "__main__":

    # simply use:
    p = Paoluz()
    p.login('test@gmail.com', 'password123')
    p.check()
