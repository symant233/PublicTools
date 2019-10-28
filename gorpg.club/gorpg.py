import re
import requests


class Gorpg:

    def __init__(self):
        self.DOMAIN = 'https://www.gorpg.club/'
        self.s = requests.session()
        self.s.get("https://www.gorpg.club/")

    def login(self, id, passwd):
        tmp = self.s.get("https://www.gorpg.club/member.php?mod=logging&action=login")
        loginhash = re.findall(r'loginhash=(.+)">\n<div class="c cl', tmp.text)[0]
        data = {
            "formhash": re.findall(r'<input type="hidden" name="formhash" value="(.+)" />', tmp.text)[0],
            "referer": "https://www.gorpg.club/",
            "username": id,
            "password": passwd,
            "questionid": 0,
            "answer": '',
            "loginsubmit": 'true'
        }
        login_url = "https://www.gorpg.club/member.php?mod=logging&action=login&loginsubmit=yes&loginhash="
        r = self.s.post(login_url + loginhash, data=data)

    def check(self):
        url = "https://www.gorpg.club/k_misign-sign"
        r = self.s.get(url)
        link = re.findall(r'<a id="JD_sign" href="(.+)" onclick="ajaxget', r.text)[0]
        p = self.s.get(self.DOMAIN + link)



if __name__ == "__main__":
    import sqlite3, os
    working = os.path.dirname(os.path.abspath(__file__))
    os.chdir(working)
    conn = sqlite3.connect('../private.sqlite')
    curs = conn.cursor()

    # gorpg.club
    query = "SELECT * FROM gorpg"
    curs.execute(query)
    lines = curs.fetchall()
    for line in lines:
        g = Gorpg()
        g.login(line[0], line[1])
        g.check()