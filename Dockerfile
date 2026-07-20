# Imagen base oficial de Node.js
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY server/package*.json ./server/

# Instalar dependencias globales y de compilación
RUN npm install

# Copiar todo el código del proyecto
COPY . .

# Compilar el frontend (genera la carpeta dist)
RUN npm run build

# Ir al directorio del servidor e instalar sus dependencias
WORKDIR /app/server
RUN npm install

# Exponer el puerto del backend (3000)
EXPOSE 3000

# Variable de entorno de producción
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["node", "index.js"]
