# 🏥 Medic Appointments Microservice (Serverless - Clean Architecture)

Este proyecto es un microservicio para el registro y la consulta de citas médicas, desarrollado en **Node.js** y **TypeScript**, utilizando **Clean Architecture** y desplegado con **Serverless Framework** sobre AWS. Soporta múltiples países (como PE y CL) y maneja persistencia tanto en DynamoDB como en RDS, junto con eventos a SNS y EventBridge.

---

## 📂 Estructura del Proyecto

```
src/
├── application/
│   └── use-cases/                # Casos de uso (Application Layer)
│       ├── EventBrigdeRepository.ts
│       ├── FindAppointmentRepository.ts
│       ├── RegisterAppointment.ts
│       ├── RegisterAppointmentRelational.ts
│       └── SnsPublisherRepository.ts
├── domain/
│   └── entities/                 # Entidades del dominio
│       └── Appointment.ts
├── infrastructure/              # Adaptadores externos (repositorios, DB, eventos)
├── presentation/
│   └── http/                     # Handlers HTTP (API Gateway)
│       ├── Appointment.ts
│       ├── Appointment-pe.ts
│       ├── Appointment-cl.ts
│       └── List-by-insured.ts
├── shared/                       # Utilitarios y código común
```

---

## 🚀 Tecnologías Utilizadas

- **Node.js** 20.x
- **TypeScript**
- **Serverless Framework**
- **AWS Lambda**
- **Amazon DynamoDB**
- **Amazon RDS (MySQL)**
- **Amazon SNS**
- **Amazon SQS**
- **Amazon EventBridge**
- **Clean Architecture**

---

## 📌 Funcionalidades

- 📥 Registro de citas médicas por país (`PE`, `CL`)
- 🔍 Consulta de citas por código de asegurado (`insuredId`)
- 📤 Publicación de eventos en **SNS** y **EventBridge**
- 📤 Publicación de colas en **SQS**
- 🧱 Separación de capas bajo Clean Architecture (dominio, aplicación, infraestructura, presentación)

---

## ⚙️ Instalación

```bash
# Clona el repositorio
git clone 
cd medic-appointments

# Instala las dependencias
npm install
```

---

## 🔐 Variables de Entorno

Copia el archivo `.env.example` y crea tu archivo `.env`:

```bash
cp .env.example .env
```

---

## ☁️ Despliegue en AWS

```bash
# Desplegar en entorno de desarrollo
sls serverless deploy --verbose
```

> Asegúrate de tener configurado `AWS CLI` con permisos adecuados.

---

## 📬 Endpoints Disponibles

| Método | Ruta                                     | Descripción                             |
|--------|------------------------------------------|-----------------------------------------|
| POST   | `/appointments`                          | Registrar nueva cita                    |
| GET    | `/appointments/insured/{insuredId}`      | Obtener citas por asegurado             |


Puedes usar el archivo `request.http` incluido para probar desde VSCode.

---

## 👨‍💻 Autor

**Rafael Guevara**  
Backend Developer | Clean Architecture | Cloud | AWS

[LinkedIn](https://www.linkedin.com/in/rafaelguevara)

---
