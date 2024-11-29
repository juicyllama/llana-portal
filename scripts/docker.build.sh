#!/bin/bash
docker-compose rm -f ./docker-compose.yml
docker compose -f ./docker-compose.yml up --build