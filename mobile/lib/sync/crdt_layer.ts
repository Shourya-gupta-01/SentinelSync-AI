// SentinelSync CRDT Logic Layer
// Built over offline Firebase Cache

interface CRDTRecord {
    value: string;
    timestamp: number; // Lamport clock equivalent
    nodeId: str;
}

export class OfflineFirebaseCRDT {
    private localStore: Map<string, CRDTRecord>;
    private nodeId: string;
    private logicalClock: number;

    constructor(nodeId: string) {
        this.nodeId = nodeId;
        this.localStore = new Map();
        this.logicalClock = 0;
    }

    /**
     * Update mapping, incrementing logical clock.
     */
    public setNodeValue(key: string, value: string) {
        this.logicalClock += 1;
        this.localStore.set(key, {
            value,
            timestamp: this.logicalClock,
            nodeId: this.nodeId
        });
        console.log(`[CRDT] ${this.nodeId} updated ${key} -> ${value} at T=${this.logicalClock}`);
    }

    /**
     * Resolves updates when devices reconnect in the mesh or online.
     * Implements basic Last Writer Wins using logical clock + deterministic node tiebreaking.
     */
    public mergeWith(incomingStore: Map<string, CRDTRecord>) {
        console.log(`[CRDT] Merging changes from remote node into ${this.nodeId}...`);
        
        let maxClock = this.logicalClock;
        
        incomingStore.forEach((incomingRecord, key) => {
            const localRecord = this.localStore.get(key);
            maxClock = Math.max(maxClock, incomingRecord.timestamp);
            
            if (!localRecord) {
                this.localStore.set(key, incomingRecord);
            } else {
                // Resolution Logic
                if (incomingRecord.timestamp > localRecord.timestamp) {
                    this.localStore.set(key, incomingRecord);
                } else if (incomingRecord.timestamp === localRecord.timestamp) {
                    // Tie-breaker: lexicographical sort of node IDs
                    if (incomingRecord.nodeId > localRecord.nodeId) {
                        this.localStore.set(key, incomingRecord);
                    }
                }
            }
        });
        
        this.logicalClock = maxClock;
        console.log(`[CRDT] Merge complete. Logical clock advanced to T=${this.logicalClock}`);
    }

    public getStore() {
        return this.localStore;
    }
}
