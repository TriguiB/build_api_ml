# Étape 1 : Construire l'application React avec Node.js
FROM node:18 AS build

WORKDIR /app

# Copier les fichiers package.json et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Installer Material-UI et ses dépendances
RUN npm install @mui/material @emotion/react @emotion/styled

# Copier tout le projet
COPY . .

# Construire l'application React
RUN npm run build

# Étape 2 : Servir avec Nginx
FROM nginx:alpine

# Copier les fichiers build de React dans Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
