import urllib.request
url = 'https://raw.githubusercontent.com/0xSulpiride/web3-fellowships-grants-jobs/main/README.md'
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    data = response.read().decode('utf-8')
    in_jobs = False
    for line in data.split('\n'):
        if 'Popular job boards' in line:
            in_jobs = True
        elif in_jobs and line.startswith('* '):
            print(line)
        elif in_jobs and line.startswith('##') and 'Popular job boards' not in line:
            break
