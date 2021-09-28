Для инициализации:
```PowerShell
    git clone git@github.com:bunnyonthemoon/cmd.git
    git submodule init
```

Зависимости:
- postgresql 12.7
- redis 5.0.7 (в dev режиме не нужен)
- python 3.9
- pipenv

Сначала создай файл /server/env.py. Его содержимое должно быть таким (заполни пустое)
```Python
    DEBUG = True

    DB_NAME = # название базы данных
    DB_USER = # имя юзера базы
    DB_PASSWORD = # пароль юзера

    SERVER_DOMAIN = '127.0.0.1'
    PATIENT_WIDGET_DOMAIN = 'localhost:8081'
    SERVER_URL = 'http://' + SERVER_DOMAIN + ':8000'
    PATIENT_WIDGET_URL = 'http://' + PATIENT_WIDGET_DOMAIN
    REDIS_HOST = 'localhost'
    REDIS_PORT = '6379'

    SECRET_KEY = # Секретный ключ можешь сгенерить на https://djecrety.ir/
```

Далее в консоли в папке server:
```PowerShell
    pipenv sync
    pipenv shell
    python ./manage.py makemigrations
    python ./manage.py migrate
    python ./manage.py createsuperuser
```
Для старта сервера:
```PowerShell
    python ./manage.py runserver
```

В папках patient и client:
```PowerShell
    npm i
    npm run dev
```

Для создания и выкладывания билда, в папках patient и client:
```PowerShell
    npm run build
```
Получившийся билд от client (приложение врачей (сори за путаницу, затупил сначала с названием)) автоматически уйдёт в папку server. Для того чтобы его выложить, нужно просто отправить изменения в папке server

Билд от patient будет находиться в папке /patient/client/. Самое главное там это папки js и fonts. Из html важны только 3 строчки. Их можно вставить в любой сайт, и всё само собой заработает. Разве что в env.py нужно будет указать домен этого сайта
```HTML
    <div id="app"></div>
    <script src="/test_chat/js/chunk-vendors.js"></script>
    <script src="/test_chat/js/index.js"></script>
```
