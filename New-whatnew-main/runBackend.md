# Backend Initialization

# Domain api.whatnew.in

## Install python 3.13.7
```
git@github.com:whatnewlive/New-whatnew.git
```

Step 1: `cd backend`

Step 2: Create a virtual environment

```bash
python -m venv venv
```


Step 3: Activate the virtual environment

On Windows:

```bash
venv\Scripts\activate
```
On Linux:

```bash
source venv/bin/activate
```

Step 4: Install the required packages

```bash
pip install -r req.txt
```

Step 5: Start the backend server

```bash
uvicorn livestream_ecommerce.asgi:application --host 0.0.0.0 --port 8000 --reload
```

Or

```bash
python manage.py runserver
```

Or with Port 8000

```bash
python manage.py runserver 8000
```

# Seller Portal Installation

# Domain seller.whatnew.in

## Installation

step1:

```bash
cd seller-web
```

step2:

```bash
npm install
```

step3:

```bash
npm run start
```

# Static web page Appredirect

# Domain app.whatnew.in

```bash
cd share
```


