import { Stack } from 'expo-router'
import React from 'react'

function TicketLayout() {
  return (
    <Stack>
        <Stack.Screen name='CreateTicket' options={{headerShown:false}}/>
    </Stack>
  )
}

export default TicketLayout