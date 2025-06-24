import env from "@/helpers/env"
import { Client, IMessage, StompSubscription } from "@stomp/stompjs"
import SockJS from "sockjs-client"

const BACKEND_URL = env.BACKEND_ORIGIN ?? "http://localhost:8080"

class WebsocketClient {
    private readonly client: Client
    private readonly subscriptions: { [destination: string]: StompSubscription } = {}
    private readonly onConnectCallbacks: Array<() => void> = []

    constructor() {
        this.client = new Client({
            webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`),
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: msg => console.debug("WebSocket Debug:", msg),
        })

        this.client.onConnect = () => {
            console.log("Connected to WebSocket")
            this.onConnectCallbacks.forEach(callback => callback())
        }

        this.client.onStompError = frame => {
            console.error("Broker reported error: " + frame.headers["message"])
            console.error("Additional details: " + frame.body)
        }

        this.client.debug = str => console.log(str)
    }

    registerOnConnectCallback(callback: () => void) {
        this.onConnectCallbacks.push(callback)
    }

    configureHeaders(headers: { [key: string]: string }) {
        this.client.configure({ connectHeaders: headers })
    }

    connect(headers: { [key: string]: string } = {}) {
        this.configureHeaders(headers)

        if (!this.client.active) this.client.activate()
    }

    disconnect() {
        if (this.client.active) this.client.deactivate().then(() => console.log("Disconnected from WebSocket"))
    }

    subscribe(destination: string, callback: (message: IMessage) => void): StompSubscription {
        const sub = this.client.subscribe(destination, callback)
        this.subscriptions[destination] = sub
        return sub
    }

    unSubscribe(destination: string) {
        const sub = this.subscriptions[destination]
        if (sub) {
            sub.unsubscribe()
            delete this.subscriptions[destination]
        }
    }

    unregisterOnConnectCallback(callback: () => void) {
        const index = this.onConnectCallbacks.indexOf(callback)
        if (index !== -1) this.onConnectCallbacks.splice(index, 1)
    }

    send(destination: string, body: string, headers: { [key: string]: string } = {}) {
        this.client.publish({ destination, body: JSON.stringify(body), headers })
    }
}

const websocketClient = new WebsocketClient()
export default websocketClient
