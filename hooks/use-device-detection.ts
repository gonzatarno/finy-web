"use client"

import { useState, useEffect } from "react"

type DeviceType = "ios" | "android" | "web"

export function useDeviceDetection(): DeviceType {
  const [device, setDevice] = useState<DeviceType>("web")

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || ""
    
    // Check for iOS devices
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setDevice("ios")
      return
    }
    
    // Check for Android devices
    if (/android/i.test(userAgent)) {
      setDevice("android")
      return
    }
    
    // Default to web for desktop/other
    setDevice("web")
  }, [])

  return device
}
