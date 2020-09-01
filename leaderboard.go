package main

import (
	"time"

	"github.com/Akshat-Tripathi/conquer2/internal/mongodb"
	"go.mongodb.org/mongo-driver/mongo"
)

type leaderBoard struct {
	games map[string][3]string
}

type message struct {
	ID    string
	UTC   int64
	Items [3]string
}

func newLeaderBoard() *leaderBoard {
	return &leaderBoard{
		games: make(map[string][3]string),
	}
}

func (l *leaderBoard) push(id, name string) {
	board := l.games[id]
	board[2] = board[1]
	board[1] = board[0]
	board[0] = name
	l.games[id] = board
}

func (l *leaderBoard) flush(client *mongo.Client, id string) {
	defer delete(l.games, id)
	mongodb.WriteToCollection(client, "leaderboards", "winners", message{
		ID:    id,
		UTC:   time.Now().Unix(),
		Items: l.games[id],
	})
}
