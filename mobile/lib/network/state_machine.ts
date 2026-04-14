// Mocking xstate for the network state machine
import { createMachine, assign } from 'xstate';

export const P2PNetworkMachine = createMachine({
  id: 'p2p_network',
  initial: 'WIFI_ACTIVE',
  context: {
    retries: 0,
    maxRetries: 3,
  },
  states: {
    WIFI_ACTIVE: {
      on: {
        DISCONNECT: 'CELLULAR_ACTIVE',
      },
    },
    CELLULAR_ACTIVE: {
      on: {
        RESTORED: 'WIFI_ACTIVE',
        DISCONNECT: 'MESH_ACTIVE',
      },
    },
    MESH_ACTIVE: {
      entry: ['initNearbyConnections'],
      on: {
        RESTORED: 'CELLULAR_ACTIVE',
        P2P_DROP: {
          target: 'DISCONNECTED',
          actions: assign({ retries: (ctx) => ctx.retries + 1 }),
        },
      },
      exit: ['stopNearbyConnections'],
    },
    DISCONNECTED: {
      on: {
        RESTORED: 'MESH_ACTIVE',
      },
      after: {
        // Exponential backoff logic based on retries
        5000: {
          target: 'MESH_ACTIVE',
          cond: (ctx) => ctx.retries < ctx.maxRetries,
        },
      },
    },
  },
}, {
  actions: {
    initNearbyConnections: () => {
      console.log("[NETWORK] Internet lost! Initializing Google Nearby Connections API (Bluetooth / Wi-Fi Direct)...");
    },
    stopNearbyConnections: () => {
      console.log("[NETWORK] Internet restored! Stopping Mesh local broadcasts.");
    }
  }
});
