﻿# Proyecto TI 1

Para descargar grafana ejecutar los siguientes codigos:

Invoke-WebRequest -Uri "https://dl.grafana.com/oss/release/grafana-7.5.0.windows-amd64.zip" -OutFile "grafana.zip"

Una vez descargado, descomprime el archivo ZIP usando el siguiente comando:

Expand-Archive -Path ".\grafana.zip" -DestinationPath ".\grafana"

Luego el siguiente paso es:

cd .\grafana\grafana-7.5.0\conf

Aqui abrir el defaults.ini y agregar las siguientes lineas de codigo:

[//]: [cors][//]: enabled = true

[//]: allow_origin = \*

y modificar las siguientes:

[//]: [auth.anonymous]

[//]: # enable anonymous access

[//]: enabled = true

[//]: # specify organization name that should be used for unauthenticated users

[//]: org_name = Main Org.

[//]: # specify role for unauthenticated users

[//]: org_role = Viewer

y luego esta:

[//]: [security]

[//]: # allow_embedding = true

[//]: allow_embedding = true

Guardar y luego ejecutar:

cd .\grafana\grafana-7.5.0\

.\bin\grafana-server.exe --config=.\conf\defaults.ini

Luego ir al localhost:3000 y autenticarse con usuario admin contraseña admin, cambiar contraseña por sugerencia.

Luego ir a la + y crear un nuevo dashboard, luego añaden los paneles a placer y luego guardan.

Luego ir al nombre del panel, y darle click a Share y luego van a Embed, ahi tienes el iframe que vas a poner en el codigo html, en mi caso:

[//]: <iframe src="http://localhost:3000/d-solo/QDBJGEPSz/new-dashboard-copy1?orgId=1&from=1716468286183&to=1716489886183&panelId=2" width="450" height="200" frameborder="0"></iframe>

y ya.
