# Usa una imagen base de Node.js (elige una versión que coincida con tu entorno de desarrollo)
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y pnpm-lock.yaml (o yarn.lock/package-lock.json si no usas pnpm en la raíz del workspace)
# Utiliza un comodín si es necesario para copiar el archivo de lock correcto
COPY package.json pnpm-lock.yaml ./

# Instala las dependencias usando pnpm (asegúrate de tener pnpm instalado globalmente en tu máquina o en la imagen base si no usas el comodín)
# Si usas pnpm a nivel del monorepo, la instalación se hará en el contexto del workspace
RUN corepack enable pnpm && pnpm install --prod

# Copia el resto del código fuente de la aplicación
COPY . .

# Compila el código TypeScript a JavaScript
RUN pnpm run build

# Expone el puerto en el que la aplicación escuchará (debe coincidir con el puerto que configures en tu app)
EXPOSE 4000

# Define el comando para ejecutar la aplicación (usando node para ejecutar el código compilado)
CMD [ "node", "dist/index.js" ]