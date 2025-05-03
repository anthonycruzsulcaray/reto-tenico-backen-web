package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	app := fiber.New()
	// Middleware para registrar las solicitudes
	app.Use(logger.New())
	// Configurar CORS para permitir solicitudes desde el front-end (localhost:5173)
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",                           // Permitir solicitudes de cualquier origen
		AllowMethods: "GET,POST,PUT,OPTIONS,DELETE", // Métodos permitidos
		AllowHeaders: "Content-Type",                // Encabezados permitidos
	}))

	// Servir archivos estáticos desde la carpeta "frontend"
	app.Static("/", "./frontend")

	app.Listen(":4000")
}
