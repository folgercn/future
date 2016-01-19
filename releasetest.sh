rm -rf all.tar.gz
tar -czf all.tar.gz public/ routes/ models/ core/ views/
scp -r all.tar.gz root@vpn:~/future/

ssh -t  root@vpn "cd future/ && tar -zvxf all.tar.gz"
rm -rf all.tar.gz
