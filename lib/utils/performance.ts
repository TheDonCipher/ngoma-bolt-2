export function measurePerformance(metricName: string) {
  if (typeof window === "undefined") return;

  try {
    const entry = performance.mark(metricName);
    
    // Report to analytics
    if (window.gtag) {
      window.gtag("event", "performance", {
        metric_name: metricName,
        value: entry.startTime,
      });
    }
  } catch (error) {
    console.error("Performance measurement error:", error);
  }
}

export function reportWebVitals(metric: any) {
  if (typeof window === "undefined") return;

  try {
    if (window.gtag) {
      window.gtag("event", "web-vitals", {
        metric_name: metric.name,
        value: metric.value,
        rating: metric.rating,
      });
    }
  } catch (error) {
    console.error("Web Vitals reporting error:", error);
  }
}
