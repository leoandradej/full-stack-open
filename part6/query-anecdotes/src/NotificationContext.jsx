import { createContext, useContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null,
  )

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const context = useContext(NotificationContext)
  return context[0]
}

const useNotificationDispatch = () => {
  const context = useContext(NotificationContext)
  return context[1]
}

let timeoutId

export const useNotify = () => {
  const dispatch = useNotificationDispatch()

  return (message) => {
    dispatch({ type: 'SET', payload: message })

    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }
}

export default NotificationContext
