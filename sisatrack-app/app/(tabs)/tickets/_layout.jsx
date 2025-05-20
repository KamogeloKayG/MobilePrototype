import { Stack } from 'expo-router'
import React from 'react'

function TicketLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[ticketID]" />
      <Stack.Screen name="CreateTicket"/>
    </Stack>
  );
}

export default TicketLayout