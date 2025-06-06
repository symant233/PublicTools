import sys
import requests
import threading
"bilibili bangumi downloader with multi threads"
# import click

# @click.command()
# @click.option('-u', 'url', help='url for the flv file')
# @click.option('-r', 'ref', help='referer')
def download(url: str, ref: str):
    "download bilibili video function"
    local_filename = url.split('/')[-1].split('?')[0]
    # NOTE the stream=True parameter below
    ref = {
        'DNT': 1,
        'Origin': 'https://www.bilibili.com',
        # 'range': 'bytes=0-',
        'Referer': ref,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36'
    }
    r = requests.get(url, headers=ref,stream=True)
    length = r.headers['Content-Length']
    r.raise_for_status()
    count = 0
    with open(local_filename, 'wb') as f:
        for chunk in r.iter_content(chunk_size=8192): 
            if chunk: # filter out keep-alive new chunks
                f.write(chunk)
                count = count + 8192
                # f.flush()
        print(local_filename + ' downloaded.')

if __name__ == "__main__":
    with open('data.txt', 'r') as f:
        urls = f.read().splitlines()
        ref = urls.pop(0)
        
    for url in urls:
        th = threading.Thread(target=download, args=(url, ref, ))
        th.start()

    print('Downloading with multi threads...')