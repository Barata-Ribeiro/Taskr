"use client"

import { Notification } from "@/interfaces/notifications"
import websocketClient from "@/utils/websocket-client"
import { IMessage, StompSubscription } from "@stomp/stompjs"
import { useSession } from "next-auth/react"
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"

interface WebSocketContextProps {
    notifications: Notification[]
}

const WebSocketContext = createContext<WebSocketContextProps>({ notifications: [] })

export function WebsocketProvider({ children }: Readonly<{ children: ReactNode }>) {
    const { data: session } = useSession()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [subscription, setSubscription] = useState<StompSubscription | null>(null)

    useEffect(() => {
        if (session) {
            const handleConnect = () => {
                if (!subscription) {
                    const sub = websocketClient.subscribe("/user/notifications", (message: IMessage) => {
                        const notification = JSON.parse(message.body) as Notification
                        setNotifications(prev => [notification, ...prev])
                    })
                    setSubscription(sub)
                }
            }

            websocketClient.registerOnConnectCallback(handleConnect)
            websocketClient.connect()

            return () => {
                if (subscription) {
                    subscription.unsubscribe()
                    setSubscription(null)
                }

                websocketClient.disconnect()
            }
        }
    }, [session])

    const value = useMemo(() => ({ notifications }), [notifications])

    return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}

export function useWebsocket() {
    const context = useContext(WebSocketContext)
    if (!context) throw new Error("useWebsocket must be used within a WebsocketProvider")
    return context
}
