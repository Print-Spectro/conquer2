package main

import (
	"context"
	"fmt"
	"testing"

	"github.com/Akshat-Tripathi/conquer2/internal/mongodb"
	"github.com/go-playground/assert/v2"
)

func initLeaderBoard() *leaderBoard {
	l := newLeaderBoard()

	for i := 0; i < 10; i++ {
		for j := 0; j < 10; j++ {
			l.push(fmt.Sprint(i), fmt.Sprint(j))
		}
	}
	return l
}

func TestPush(t *testing.T) {
	l := initLeaderBoard()

	for i := 0; i < 10; i++ {
		board := l.games[fmt.Sprint(i)]
		for j := 0; j < 3; j++ {
			assert.Equal(t, board[j], fmt.Sprint(9-j))
		}
	}
}

func TestFlush(t *testing.T) {
	l := initLeaderBoard()
	m := mongodb.NewMongo()
	defer m.Disconnect(context.TODO())

	for i := 0; i < 10; i++ {
		l.flush(m, fmt.Sprint(i))
	}
}
