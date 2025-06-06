# coding=UTF-8
import requests
import json

class Paoluz:

    def __init__(self):
        self.session = requests.Session()
        self.constant = {
            # 'LOGIN': 'https://paoluz.cloud/auth/login',
            'USER': 'https://paoluz.cloud/user',
            'CHECK': 'https://paoluz.cloud/user/checkin'
        }

    def check(self, cookie):
        url = self.constant['CHECK']
        data = {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
			"x-requested-with": "XMLHttpRequest",
            'cookie': cookie,
            'dnt': 1,
            'Origin': 'https://paoluz.cloud',
            'Referer': 'https://paoluz.cloud/user',
			'referrer': 'https://paoluz.cloud/user',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.26 Safari/537.36 Edg/81.0.416.16',
        }
        r = self.session.post(url, headers=data)
        try:
            r = json.loads(r.content.decode()) # binary string to dict
            print(r['msg'])
        except:
            print('checkin: ', r.status_code)

if __name__ == "__main__":
    cookie = r''
    p = Paoluz()
    p.check(cookie)
