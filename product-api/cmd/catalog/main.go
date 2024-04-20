package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/JP-Go/fc-ecommerce/product-api/internal/database"
	"github.com/JP-Go/fc-ecommerce/product-api/internal/service"
	"github.com/JP-Go/fc-ecommerce/product-api/internal/webserver"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := sql.Open("mysql", "root:root@tcp(localhost:3306)/imersao17")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()
	categoryDb := database.NewCategoryDB(db)
	productDb := database.NewProductDB(db)
	productService := service.NewProductService(*productDb)
	categoryService := service.NewCategoryService(*categoryDb)

	webCategoryHandler := webserver.NewWebCategoryHandler(categoryService)
	webProductHandler := webserver.NewWebProductHandler(productService)

	c := chi.NewRouter()
	c.Use(middleware.Logger)
	c.Use(middleware.Recoverer)

	c.Get("/category/{id}", webCategoryHandler.GetCategory)
	c.Get("/category", webCategoryHandler.GetCategories)
	c.Post("/category", webCategoryHandler.CreateCategory)

	c.Get("/product", webProductHandler.GetProducts)
	c.Get("/product/{id}", webProductHandler.GetProduct)
	c.Post("/product", webProductHandler.CreateProduct)
	c.Get("/product/category/{categoryId}", webProductHandler.GetProductsByCategoryId)

	fmt.Println("Server runing on port 8080")
	http.ListenAndServe(":8080", c)
}
