export function isCompatible() {
  const isCompat = window.crypto && 
                   document.querySelector && 
                   window.Uint8Array;
  return !!isCompat;
}