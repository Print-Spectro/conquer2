package game

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

const herokuTimeOut = time.Second * 30

//PersistentGame is a type of game which can store its state
//It overrides: Init, Run, process and End
type PersistentGame struct {
	*DefaultGame
	*persistence
	timer *time.Timer
}

var _ Game = (*PersistentGame)(nil)

func (pg *PersistentGame) Init(ctx Context) {
	pg.timer = time.NewTimer(herokuTimeOut)
	pg.DefaultGame = &DefaultGame{}
	pg.persistence = &persistence{
		docs: ctx.Client.Collection(ctx.ID),
	}

	//This indicates that the context has already been loaded
	ctxAlreadyInit := ctx.MaxPlayers > 0

	if !ctxAlreadyInit {
		pg.loadContext(&ctx)
	}

	pg.DefaultGame.Init(ctx)

	pg.sockets.handle = pg.process
	if !ctxAlreadyInit {
		pg.loadPlayers(pg.machine)
		pg.loadCountries(pg.machine)
	}
}

func (pg *PersistentGame) Run() func(ctx *gin.Context) {
	pg.storeContext(pg.context)
	go func() {
		<-pg.timer.C
		log.Println("timer fired")
		pg.store(pg.machine)
	}()
	return pg.DefaultGame.Run()
}

func (pg *PersistentGame) process(name string, action Action) {
	log.Println("timer reset")
	pg.timer.Reset(herokuTimeOut)
	pg.DefaultGame.process(name, action)
}

func (pg *PersistentGame) End() {
	pg.persistence.delete()
	pg.DefaultGame.End()
}
