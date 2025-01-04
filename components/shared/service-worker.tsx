"use client";

    import { useEffect } from "react";

    export function ServiceWorker() {
      useEffect(() => {
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js');
          });
        }
      }, []);

      return null;
    }