package routers

import (
	"bitbucket.org/v-sh/golang_react_chat/controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{})
}
