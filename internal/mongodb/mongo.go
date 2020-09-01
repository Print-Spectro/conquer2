package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const mongoTemplate = "mongodb+srv://conquer2admin:%s@cluster0.qnrve.mongodb.net/%s?retryWrites=true&w=majority"

var mongoURI string

func init() {
	mongoURI = fmt.Sprintf(mongoTemplate, "CONQUER2", "cluster0")
}

//NewMongo connects to the mongodb instance
func NewMongo() *mongo.Client {
	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}
	return client
}

//WriteToCollection inserts data in the collection specified
func WriteToCollection(client *mongo.Client, database, collection string, data interface{}) error {
	col := client.Database(database).Collection(collection)

	_, err := col.InsertOne(context.TODO(), data)
	return err
}

type pokemon struct {
	Name   string
	Type   string
	Height int
}

func main() {
	client := NewMongo()
	WriteToCollection(client, "leaderboards", "winners", pokemon{
		Name:   "Pikachu",
		Type:   "Electric",
		Height: 3,
	})
}
