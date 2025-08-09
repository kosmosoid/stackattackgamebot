package api

import (
	"html"
	"net/http"
	"strconv"
	_ "time/tzdata"

	"github.com/kosmosoid/stackattackbot/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/kosmosoid/stackattackbot/internal/service"
)

type Handler struct {
	service *service.Service
}

func NewHandler(service *service.Service) *Handler {
	return &Handler{service: service}
}

func RegisterHandlers(router *gin.Engine, service *service.Service) {
	h := NewHandler(service)
	router.GET("/", h.index)

	router.GET("/hiscore", h.getHiscore)

	router.POST("/savescore", h.saveScore)

	router.GET("/telegram-app", h.telegramApp)

	router.NoRoute(func(c *gin.Context) {
		c.String(http.StatusNotFound, "%s", "")
	})
	router.NoMethod(func(c *gin.Context) {
		c.String(http.StatusNotFound, "%s", "")
	})
}

func (h *Handler) getHiscore(c *gin.Context) {
	hiscore, err := h.service.GetHiscore(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, hiscore)
}

func (h *Handler) saveScore(c *gin.Context) {

	var user models.User

	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Wrong format"})
		return
	}

	user.Username = html.EscapeString(user.Username)
	user.FirstName = html.EscapeString(user.FirstName)
	user.LastName = html.EscapeString(user.LastName)

	err := h.service.SaveScore(c, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "OK"})
}

func (h *Handler) index(c *gin.Context) {
	c.HTML(http.StatusOK, "", gin.H{})
}

func (h *Handler) telegramApp(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
	c.Header("Pragma", "no-cache")
	c.Header("Expires", "0")
	c.HTML(http.StatusOK, "telegram_app.html", gin.H{
		"master_id": id,
	})
}
