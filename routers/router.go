package routers

import (
	"bitbucket.org/v-sh/golang_react_chat/controllers"
	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/messages", &controllers.MessagesController{})
	beego.Router("/messages/join", &controllers.MessagesController{}, "get:Join")
}
