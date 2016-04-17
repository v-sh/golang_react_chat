package controllers

import (
	"net/http"
	"encoding/json"

	"github.com/astaxie/beego"
	"github.com/gorilla/websocket"


	"bitbucket.org/v-sh/golang_react_chat/models"
)

type MessagesController struct {
	beego.Controller
}

func (this *MessagesController) Join() {
	ws, err := websocket.Upgrade(this.Ctx.ResponseWriter, this.Ctx.Request, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(this.Ctx.ResponseWriter, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		beego.Error("Cannot setup WebSocket connection:", err)
		return
	}

	// Join chat room.
	id := Join(ws)
	defer Leave(id)

	// Message receive loop.
	for {
		_, p, err := ws.ReadMessage()
		if err != nil {
			beego.Error(err)
			return
		}
		msg := models.Message{}
		err = json.Unmarshal(p, &msg)
		if err != nil {
			beego.Error(err)
			return
		}
		beego.Debug("get message: ", msg, ", from data: ", string(p))
		publish <- msg
	}
}
