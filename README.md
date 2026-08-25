# 🌌 NochePolar — Backend (API)

API REST desarrollada en NestJS que da soporte a **NochePolar**, una red social propia con publicaciones, comentarios, chat en tiempo real y estadísticas de uso.

Este repositorio es el backend del proyecto; el frontend en Angular vive en [FrontNochePolar](https://github.com/Santy-M1502/FrontNochePolar).

## ✨ Funcionalidades

- Autenticación de usuarios
- Publicaciones con imágenes, usando Cloudinary
- Comentarios en publicaciones
- Interacciones entre usuarios (likes/reacciones)
- Chat en tiempo real
- Estadísticas de uso de la plataforma
- Guards y permisos según el rol del usuario

## 🛠️ Tech stack

- NestJS + TypeScript (arquitectura modular)
- WebSockets para el chat en tiempo real
- Cloudinary para el manejo de imágenes
- Autenticación basada en JWT

## 🚀 Instalación

```bash
git clone https://github.com/Santy-M1502/BackNochePolar.git
cd BackNochePolar
npm install
npm run start:dev
```

## 🌐 Demo

API deployada en [back-noche-polar.vercel.app](https://back-noche-polar.vercel.app)

## 📦 Proyecto relacionado

Frontend: [Santy-M1502/FrontNochePolar](https://github.com/Santy-M1502/FrontNochePolar)
