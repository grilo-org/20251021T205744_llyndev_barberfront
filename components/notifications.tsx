/*"use client"

import React, { useState } from 'react'
import { Bell, BellRing, Check, CheckCheck, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useNotifications } from '@/context/notification-context'
import { NotificationConfig } from '@/lib/notifications'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface NotificationItemProps {
  notification: NotificationConfig
  onMarkAsRead: (id: string) => void
  onRemove: (id: string) => void
}

function NotificationItem({ notification, onMarkAsRead, onRemove }: NotificationItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      case 'reminder':
        return '⏰'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'reminder':
        return 'border-blue-200 bg-blue-50'
      case 'info':
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <Card className={cn(
      "relative transition-all hover:shadow-md",
      !notification.read && "ring-2 ring-primary/20",
      getTypeColor(notification.type)
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getIcon(notification.type)}</span>
            <CardTitle className="text-sm font-medium">{notification.title}</CardTitle>
            {!notification.read && (
              <Badge variant="secondary" className="h-2 w-2 p-0 bg-primary" />
            )}
          </div>
          <div className="flex items-center space-x-1">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onMarkAsRead(notification.id)}
                title="Marcar como lida"
              >
                <Check className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(notification.id)}
              title="Remover"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-xs text-muted-foreground mb-2">
          {notification.message}
        </CardDescription>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {format(notification.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </span>
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex space-x-1">
              {notification.actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "outline"}
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={() => {
                    action.action()
                    onMarkAsRead(notification.id)
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, removeNotification, markAllAsRead, clearAll } = useNotifications()
  const recentNotifications = notifications.slice(0, 5)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notificações</h4>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Marcar todas
              </Button>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {recentNotifications.length > 0 ? (
            <div className="space-y-2 p-2">
              {recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onRemove={removeNotification}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          )}
        </div>
        {notifications.length > 5 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver todas ({notifications.length})
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <NotificationPanel />
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function NotificationPanel() {
  const { notifications, unreadCount, markAsRead, removeNotification, markAllAsRead, clearAll } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Badge variant="secondary">
              {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
            </Badge>
          )}
        </SheetTitle>
        <SheetDescription>
          Gerencie suas notificações e lembretes
        </SheetDescription>
      </SheetHeader>

  <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Não lidas ({unreadCount})
            </Button>
          </div>
          
          
          <div className="flex space-x-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                title="Marcar todas como lidas"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                title="Limpar todas"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onRemove={removeNotification}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">
                {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
              </p>
              <p className="text-sm">
                {filter === 'unread' 
                  ? 'Todas as suas notificações foram lidas!' 
                  : 'Você receberá notificações sobre seus agendamentos aqui.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function NotificationBell() {
  const { unreadCount } = useNotifications()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <NotificationPanel />
      </SheetContent>
    </Sheet>
  )
}*/
