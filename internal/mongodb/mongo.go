package mongodb

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/cheekybits/genny/generic"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const mongoTemplate = "mongodb+srv://conquer2admin:%s@cluster0.qnrve.mongodb.net/%s?retryWrites=true&w=majority"

var mongoURI string

type CollectionType = generic.Type

func init() {
	mongoURI = fmt.Sprintf(mongoTemplate, os.Getenv("mongoPassword"), os.Getenv("mongoDBName"))
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

//ReadCollectionTypeFromCollection reads the n most recent CollectionType from a collection
func ReadCollectionTypeFromCollection(client *mongo.Client, database, collection string, limit int) []*CollectionType {
	col := client.Database(database).Collection(collection)

	// Pass these options to the Find method
	findOptions := options.Find()
	findOptions.SetLimit(int64(limit))

	// Here's an array in which you can store the decoded documents
	var results []*CollectionType

	// Passing bson.D{{}} as the filter matches all documents in the collection
	cur, err := col.Find(context.TODO(), bson.D{{}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for cur.Next(context.TODO()) {

		// create a value into which the single document can be decoded
		var elem CollectionType
		err := cur.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}

		results = append(results, &elem)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	// Close the cursor once finished
	cur.Close(context.TODO())

	return results
}
