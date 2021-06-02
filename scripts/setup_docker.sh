#!/bin/bash
pwd
ls
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo docker system prune -a -f
sudo docker build user-api -t user-api
