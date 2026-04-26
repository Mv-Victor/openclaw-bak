import urllib.request
url = 'https://raw.githubusercontent.com/Shubham0850/awesome-web3-jobs/main/README.md'
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    data = response.read().decode('utf-8')
    for line in data.split('\n'):
        if line.startswith('- ['):
            print(line)
