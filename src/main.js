var {app, BrowserWindow} = require("electron")

let win

function createWindow() {
    win = new BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.removeMenu()
    win.loadFile("static/index.html")
    win.on("closed", () => {
        win = null
    })
}

app.on("ready", createWindow)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (win === null) {
        createWindow()
    }
})
