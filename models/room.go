package models

type Message struct {
	Author string
	Message string `json:"text"`
}
