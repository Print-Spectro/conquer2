package main

import "fmt"

func createAndRun(number int) {
	p := player{
		countries:     make([]string, 0),
		countryStates: make(map[string]*countryState),
		all:           make([]string, 0),
	}
	go p.Join(fmt.Sprintf("Player: %d", number))
}

func main() {
	for i := 0; i < 5; i++ {
		createAndRun(i)
	}
	select {}
}
