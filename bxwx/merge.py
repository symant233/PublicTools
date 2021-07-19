import os
import codecs

THREAD_NUM = 10

if __name__ == '__main__':
    for t in range(THREAD_NUM):
        if t == 0:
            MAIN_FILE = codecs.open('output-{}.txt'.format(t), 'a', 'utf-8')
        else:
            f = codecs.open('output-{}.txt'.format(t), 'r', 'utf-8')
            text = f.read()
            MAIN_FILE.write(text)
            f.close()
            os.remove('output-{}.txt'.format(t))

    MAIN_FILE.close()
    os.rename('output-0.txt', 'output.txt')
