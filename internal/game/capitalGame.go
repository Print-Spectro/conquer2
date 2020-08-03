package game

import statemachines "github.com/Akshat-Tripathi/conquer2/internal/game/stateMachines"

//CapitalGame is a realtime game where all players playthrough till the end
type CapitalGame struct {
	DefaultGame
}

var _ Game = (*CapitalGame)(nil)

//Init replaces the DefaultGame's state processor
func (cg *CapitalGame) Init(ctx Context) {
	cg.DefaultGame.Init(ctx)
	teamMachine := &statemachines.TeamMachine{}
	teamMachine.DefaultMachine = *cg.machine.(*statemachines.DefaultMachine)
	cg.machine = teamMachine
	cg.machine.Init(nil)
	cg.sendInitialState = cg.sendInitialStateFunc
}

func (cg *CapitalGame) sendInitialStateFunc(playerName string) {
	cg.DefaultGame.sendInitialStateFunc(playerName)
	cg.machine.(*statemachines.TeamMachine).RangeCapitals(func(player, capital string) {
		cg.sendToAll(UpdateMessage{
			Type:    "newCapital",
			Player:  player,
			Country: capital,
		})
	})
}
