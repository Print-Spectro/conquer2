package game

import (
	"net/http"
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
func (rtg *RealTimeGame) Start(ctx Context, neighbours *map[string][]string) {

	countries := make([]string, len(*neighbours))
	countryStates := make(map[string]*countryState)

	i := 0
	for k := range *neighbours {
		countries[i] = k
		countryStates[k] = new(countryState)
		i++
	}

	processor := defaultProcessor{
		countries:             countries,
		neighbours:            neighbours,
		countryStates:         countryStates,
		playerTroops:          make(map[string]*playerState),
		startingTroopNumber:   ctx.StartingTroopNumber,
		startingCountryNumber: ctx.StartingCountryNumber,
	}

	rtg.id = ctx.ID
	rtg.maxPlayerNum = ctx.MaxPlayerNumber
	rtg.conn = connectionManager{make(map[string]chan UpdateMessage)}
	rtg.actions = make(chan Action)
	rtg.processor = &processor
	go rtg.processActions()

	rtg.Router.GET("/game/"+id+"/ws", func(c *gin.Context) {
		rtg.handleGame(c.Writer, c.Request)
	})

	rtg.Router.GET("/game/"+id+"/", func(c *gin.Context) {
		username, err := c.Cookie("username")
		if err != nil {
			c.Redirect(http.StatusFound, "/")
			c.Writer.WriteString(`<script>alert("Please login")</script>`)
		}
		password, err := c.Cookie("password")
		if err != nil {
			c.Redirect(http.StatusFound, "/")
			c.Writer.WriteString(`<script>alert("Please login")</script>`)
		}
		if rtg.CheckPlayer(username, password) != 1 {
			c.Redirect(http.StatusFound, "/")
			c.Writer.WriteString(`<script>alert("Please login")</script>`)
		}
		c.HTML(http.StatusOK, "game.html", nil)
	})
}
