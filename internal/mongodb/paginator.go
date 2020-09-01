package mongodb

import (
	"time"

	"go.mongodb.org/mongo-driver/mongo"
)

//CollectionTypePaginator holds the n most recent CollectionTypes from mongodb
type CollectionTypePaginator struct {
	database        string
	collection      string
	CollectionTypes []*CollectionType
	close           chan struct{}
}

//NewCollectionTypePaginator creates and starts a CollectionTypePaginator
func NewCollectionTypePaginator(updateInterval time.Duration, pageSize int, database, collection string, client *mongo.Client) *CollectionTypePaginator {
	p := &CollectionTypePaginator{
		CollectionTypes: make([]*CollectionType, pageSize),
		close:           make(chan struct{}),
	}
	go p.tick(updateInterval, database, collection, client)
	return p
}

func (p *CollectionTypePaginator) tick(updateInterval time.Duration, database, collection string, client *mongo.Client) {
	for {
		select {
		case <-p.close:
			return
		default:
			p.CollectionTypes = ReadCollectionTypeFromCollection(client, database, collection, len(p.CollectionTypes))
			time.Sleep(updateInterval)
		}
	}
}
