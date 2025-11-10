export function waitForDitec(timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkInterval = setInterval(() => {
      if (window.ditec && window.ditec.dSigXadesBpJs) {
        clearInterval(checkInterval);
        console.log("✅ D.Bridge načítaný:", Object.keys(window.ditec));
        resolve(window.ditec);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error("D.Bridge sa nenačítal do " + timeout + "ms"));
      }
    }, 100);
  });
}