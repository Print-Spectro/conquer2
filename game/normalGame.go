package game

import (
	"time"

	"github.com/gin-gonic/gin"
)

const troopInterval = time.Second * 60

//RealTimeGame - a subclass of DefaultGame where actions happen as they are sent
type RealTimeGame struct {
	*DefaultGame
	Router *gin.Engine
}

//Start - starts a DefaultGame
func (rtg *RealTimeGame) Start(ctx Context) {
	countries := make([]string, len(ctx.Situation))
	countryStates := make(map[string]*countryState)

	i := 0
	for k := range ctx.Situation {
		countries[i] = k
		countryStates[k] = new(countryState)
		i++
	}

	maxCountries := len(countries) / ctx.MaxPlayerNumber
	if maxCountries < ctx.StartingCountryNumber {
		ctx.StartingCountryNumber = maxCountries
	}

	processor := defaultProcessor{
		countries:             countries,
		situation:             ctx.Situation,
		countryStates:         countryStates,
		playerTroops:          make(map[string]*playerState),
		startingTroopNumber:   ctx.StartingTroopNumber,
		startingCountryNumber: ctx.StartingCountryNumber,
		maxPlayerNum:          ctx.MaxPlayerNumber,
	}

	rtg.id = ctx.ID
	rtg.maxPlayerNum = ctx.MaxPlayerNumber
	rtg.conn = connectionManager{make(map[string]chan UpdateMessage)}
	rtg.actions = make(chan Action)
	rtg.processor = &processor
	rtg.troopInterval = ctx.TroopInterval
	go rtg.processActions()
	go rtg.processTroops()

	//TODO abstract the router out of this struct
	rtg.Router.GET("/game/"+ctx.ID+"/ws", rtg.handleGame)
}
