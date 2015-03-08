rm -rf all.tar.gz
tar -czf all.tar.gz * 
scp -r all.tar.gz root@vpn:~/cocosdr/

ssh -t  root@vpn "cd cocosdr/ && tar -zvxf all.tar.gz"
rm -rf all.tar.gz
