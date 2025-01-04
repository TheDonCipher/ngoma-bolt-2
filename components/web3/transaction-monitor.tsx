"use client";

import { useEffect } from 'react';
import { useWebSocket } from '@/lib/services/websocket.service';
import { TransactionEvent } from '@/lib/types/web3';
import { useToast } from '@/hooks/use-toast';

export function TransactionMonitor() {
  const { subscribe } = useWebSocket();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribe<TransactionEvent>('transaction', (event) => {
      const title = event.status === 'confirmed' 
        ? 'Transaction Confirmed'
        : event.status === 'failed'
        ? 'Transaction Failed'
        : 'Transaction Pending';

      toast({
        title,
        description: `Transaction ${event.hash.slice(0, 6)}...${event.hash.slice(-4)}`,
        variant: event.status === 'failed' ? 'destructive' : 'default',
      });
    });

    return () => {
      unsubscribe();
    };
  }, [subscribe, toast]);

  return null;
}
