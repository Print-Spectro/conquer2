package game

//A state processor for campaign games
type campaignProcessor struct {
	defaultProcessor
}

//Overrides getState
func (cp *campaignProcessor) sendState(username string, conn *connectionManager) {
	conn.sendToPlayer(UpdateMessage{
		Troops: cp.playerTroops[username].getTroops(),
		Type:   "updateTroops",
		Player: username}, username)

	neighbourSet := make(map[string]bool)

	for country, state := range cp.countryStates {
		//Send my countries to everyone iff they have no troops
		if state.player == username {
			//0 troops implies that this is the first time the player has logged in
			if state.troops == 0 {
				cp.rangeRelevantPlayers(country, func(player string) {
					conn.sendToPlayer(UpdateMessage{
						Troops:  0,
						Type:    "updateCountry",
						Player:  username,
						Country: country,
					}, player)
				})
			} else {
				conn.sendToPlayer(UpdateMessage{
					Troops:  state.troops,
					Type:    "updateCountry",
					Player:  username,
					Country: country,
				}, username)
			}
			//Add all neighbours to a set
			for _, neighbour := range cp.situation[country] {
				neighbourSet[neighbour] = true
			}
		}
	}

	for neighbour := range neighbourSet {
		if cp.countryStates[neighbour].player != username {
			conn.sendToPlayer(UpdateMessage{
				Troops:  cp.countryStates[neighbour].troops,
				Type:    "updateCountry",
				Player:  cp.countryStates[neighbour].player,
				Country: neighbour,
			}, username)
		}
	}

	for player, state := range cp.playerTroops {
		conn.sendToAll(UpdateMessage{
			Type:    "newPlayer",
			Player:  player,
			Country: state.colour,
		})
	}
}

func (cp *campaignProcessor) canSee(player, country string) bool {
	for _, neighbour := range cp.situation[country] {
		if cp.countryStates[neighbour].player == player {
			return true
		}
	}
	return false
}

//Ranges over all unique players of a country
//PRE: The country already exists
func (cp *campaignProcessor) rangeRelevantPlayers(country string, function func(player string)) {
	playerSet := make(map[string]bool)
	playerSet[cp.countryStates[country].player] = true
	for _, neighbour := range cp.situation[country] {
		if cp.countryStates[neighbour].player != "" {
			playerSet[cp.countryStates[neighbour].player] = true
		}
	}
	for player := range playerSet {
		function(player)
	}
}
