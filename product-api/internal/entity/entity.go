package entity

import "github.com/google/uuid"

type Category struct {
	ID   string
	Name string
}

type Product struct {
	ID          string
	Name        string
	Description string
	Price       float64
	CategoryID  string
	ImageURL    string
}

func NewCategory(name string) *Category {
	return &Category{
		ID:   uuid.NewString(),
		Name: name,
	}
}

func NewProduct(name, description string, price float64, categoryId, imageURL string) *Product {
	return &Product{
		ID:          uuid.NewString(),
		Name:        name,
		Description: description,
		Price:       price,
		CategoryID:  categoryId,
		ImageURL:    imageURL,
	}
}
