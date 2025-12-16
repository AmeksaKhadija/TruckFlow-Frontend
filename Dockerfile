# Utiliser une image Node.js
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Exposer le port de développement (Vite par défaut : 5173)
EXPOSE 5173

# Démarrer le serveur de dev en mode host pour qu'il soit accessible hors du conteneur
CMD ["npm", "run", "dev", "--", "--host"]