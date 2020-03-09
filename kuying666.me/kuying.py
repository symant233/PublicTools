# coding=UTF-8
import requests
import json

TOKEN = r""

class Kuying:

    def __init__(self):
        # print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'), end=' ')
        self.session = requests.Session()
        self.constant = {
            # 'LOGIN': 'https://kuying666.me/auth/login',
            # 'USER': 'https://kuying666.me/user',
            'CHECK': 'https://kuying666.me/user/checkin'
        }
        self.header = {
            'cookie': TOKEN,
            'dnt': 1,
            'origin': 'https://kuying666.me',
            'referer': 'https://kuying666.me/user',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/80.0.3987.78 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest'
        }

    def check(self):
        url = self.constant['CHECK']
        r = self.session.post(url, headers=self.header)
        try:
            r = json.loads(r.content.decode()) # binary string to dict
            print(r['msg'])
        except:
            print('checkin: ', r.status_code)

if __name__ == "__main__":

    t = Kuying()
    t.check()