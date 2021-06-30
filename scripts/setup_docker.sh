#!/bin/bash
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo docker kill $(sudo docker ps -q)
sudo docker system prune -a -f
sudo cp /home/ec2-user/.env /home/ec2-user/user-api
sudo docker build /home/ec2-user/user-api/ -t user-api
