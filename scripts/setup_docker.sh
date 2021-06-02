#!/bin/bash
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo docker kill $(docker ps -q)
sudo docker system prune -a -f
sudo docker build /home/ec2-user/user-api/ -t user-api
