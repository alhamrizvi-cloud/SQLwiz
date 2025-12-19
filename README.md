
# 🧨 SQLWiz – Vulnerable SQL Injection Lab

SQLWiz is an **intentionally vulnerable SQL Injection lab** built with **Node.js + MariaDB**, designed for **CTFs, pentesting practice, and learning SQLi exploitation**.

> ⚠️ WARNING  
> This application is **DELIBERATELY INSECURE**.  
> Do NOT deploy on the public internet.

---

## 🎯 Purpose

- Practice SQL Injection safely
- Learn authentication bypass, UNION, blind & time‑based SQLi
- Understand real-world vulnerable patterns
- Use manual payloads or tools like sqlmap

---

## 🛠️ Tech Stack

- Node.js (Express)
- MariaDB 10.11
- Podman / Docker Compose (or Docker)
- express-session

---

## 🚀 Run the Lab

```bash
# Using Podmangit clone https://github.com/alhamrizvi-cloud/SQLwiz.git
cd SQLwiz
podman-compose up --build

# Using Docker
docker-compose up --build
http://localhost:3000/login
```
🔓 Vulnerable Endpoints

## Vulnerable Endpoints

## 🔓 Vulnerable Endpoints

| Endpoint            | Injection Type        |
|---------------------|-----------------------|
| `/login`            | Auth bypass           |
| `/products?q=`      | LIKE SQLi             |
| `/product/:id`      | Numeric SQLi          |
| `/categories?cat=`  | String SQLi           |
| `/sort?sort=`       | ORDER BY SQLi         |
| `/group?group=`     | GROUP BY SQLi         |
| `/orders?uid=`      | Numeric SQLi          |
| `/admin/users`      | Admin SQLi            |
| `/debug?param=`     | Raw SQL execution     |




⚠️ Disclaimer

This lab is for educational purposes only.
The author is not responsible for misuse.
Author: Alham Rizvi
