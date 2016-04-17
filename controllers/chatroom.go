package controllers

import (
	"container/list"
	"encoding/json"

	"github.com/astaxie/beego"
	"github.com/gorilla/websocket"
	"github.com/satori/go.uuid"

	"bitbucket.org/v-sh/golang_react_chat/models"
)

func Join(ws *websocket.Conn) string {
	id := uuid.NewV4().String()
	subscribe <- Subscriber{ws, id}
	return id
}

func Leave(id string) {
	unsubscribe <- id
}

type Subscriber struct {
	Conn *websocket.Conn
	Id string
}

var (
	subscribe = make(chan Subscriber, 10)
	unsubscribe = make(chan string, 10)
	publish = make(chan models.Message, 10)
	// Long polling waiting list.
	subscribers = list.New()
)


func chatroom() {
	for {
		select {
		case sub := <-subscribe:
			subscribers.PushBack(sub)
		case message := <-publish:
			broadcastWebSocket(message)
		case unsub := <-unsubscribe:
			for sub := subscribers.Front(); sub != nil; sub = sub.Next() {
				if sub.Value.(Subscriber).Id == unsub {
					subscribers.Remove(sub)
					// Clone connection.
					ws := sub.Value.(Subscriber).Conn
					if ws != nil {
						ws.Close()
						beego.Error("WebSocket closed manually:", unsub)
					}
					break
				}
			}
		}
	}
}

func broadcastWebSocket(message models.Message) {
	data, err := json.Marshal(message)
	if err != nil {
		beego.Error("Fail to marshal message:", err)
		return
	}
	beego.Debug("Sending message: ", message, ", as:", string(data))

	for sub := subscribers.Front(); sub != nil; sub = sub.Next() {
		// Immediately send event to WebSocket users.
		ws := sub.Value.(Subscriber).Conn
		if ws != nil {
			if ws.WriteMessage(websocket.TextMessage, data) != nil {
				// User disconnected.
				unsubscribe <- sub.Value.(Subscriber).Id
			}
		}
	}
}

func init() {
	go chatroom()
}
