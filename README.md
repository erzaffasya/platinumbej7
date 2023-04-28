# Remidial BEJ7
 

## 🛠️ Installation Steps

Installation project - manual

clone project
``` bson
git clone https://github.com/erzaffasya/Platinum-BEJ7-Group2.git
```

add node modules 
```bson 
npm install
```

rename file 
```bson
.env.example -> .env
```

configuration db in file .env

create db 
```bson
sequelize db:create
```
migrate table 
```bson
sequelize db:migrate
```

run applicatiion
```bson
npm run dev
```

<!-- 
Installation project - docker

customize env in file docker-compose.yml -> platinum
run docker compose in project
``` bson
docker-compose up -t
```
open terminal container platinum in docker app

create db 
```bson
sequelize db:create
```

migrate table 
```bson
sequelize db:migrate
```

fill the table with dummy data 
```bson
sequelize db:migrate:all
```

open kibana in browser
```bson
localhost:5601
```
open app in browser
```bson
localhost:3000
```

<br> -->