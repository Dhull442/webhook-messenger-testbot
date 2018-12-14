#!/bin/bash
git add .
git commit -m "getting better"
sudo git push heroku master
sudo heroku restart
