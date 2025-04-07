"use client"

import { Notification }                                                                     from "@/interfaces/notifications"
import websocketClient
                                                                                            from "@/utils/websocket-client"
import { IMessage, StompSubscription }                                                      from "@stomp/stompjs"
import { useSession }                                                                       from "next-auth/react"
import { createContext, ReactNode, useContext, useLayoutEffect, useMemo, useRef, useState } from "react"

interface WebSocketContextProps {
    notifications: Notification[]
}

const WebSocketContext = createContext<WebSocketContextProps>({ notifications: [] })

export function WebsocketProvider({ children }: Readonly<{ children: ReactNode }>) {
    const { data: session } = useSession()
    const [ notifications, setNotifications ] = useState<Notification[]>([])
    const subscriptionRef = useRef<StompSubscription | null>(null)
    
    function addNewNotification(notification: Notification) {
        return (prev: Notification[]) => [ notification, ...prev ]
    }
    
    useLayoutEffect(() => {
        if (!session) return
        
        websocketClient.connect()
        
        const handleConnect = () => {
            if (subscriptionRef && !subscriptionRef.current) {
                subscriptionRef.current = websocketClient
                    .subscribe(`/user/${ session.user.username }/notifications`,
                               (message: IMessage) => {
                                   const notification = JSON.parse(message.body) as Notification
                                   setNotifications(addNewNotification(notification))
                               }
                    )
            }
        }
        
        websocketClient.registerOnConnectCallback(handleConnect)
        
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe()
                subscriptionRef.current = null
            }
            websocketClient.disconnect()
        }
    }, [ session ])
    
    const value = useMemo(() => ({ notifications }), [ notifications ])
    
    return <WebSocketContext.Provider value={ value }>{ children }</WebSocketContext.Provider>
}

export function useWebsocket() {
    const context = useContext(WebSocketContext)
    if (!context) throw new Error("useWebsocket must be used within a WebsocketProvider")
    return context
}
