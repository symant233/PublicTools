import subprocess
import requests
import re
import os


class Bing:

    def __init__(self):
        self.domain = 'https://cn.bing.com'
        self.pattern = r'<div id="bgImgProgLoad" data-ultra-definition-src="(.+)" data-explicit-bing-load'
        self.current = './images/current.png'
        self.previous = './images/previous.png'

    def exists(self, file):
        return os.path.exists(file)

    def _match(self):
        res = requests.get(self.domain)
        out = re.findall(self.pattern, res.text)
        self.link = self.domain + out[0]

    def _download(self):
        f = open(self.current, 'wb')
        res = requests.get(self.link)
        f.write(res.content)
        f.close()

    def apply_current(self):
        self._match()
        if (self.exists(self.current)):
            if (self.exists(self.previous)): 
                os.remove(self.previous)
            os.rename(self.current, self.previous)
        self._download()
        self.node_apply()

    def node_apply(self):
        subprocess.run(['node', 'apply.js'])

    def rollback(self):
        if (self.exists(self.previous)):
            if (self.exists(self.current)):
                os.remove(self.current)
            os.rename(self.previous, self.current)
            self.node_apply()


if __name__ == "__main__":
    working = os.path.dirname(os.path.abspath(__file__))
    os.chdir(working)
    b = Bing()
    b.apply_current()
